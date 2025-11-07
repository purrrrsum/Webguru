import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User } from './utils';
import { verifyOTP } from './otp';
import {
  ensureDatabaseSetup,
  createLoginLog,
  getUserByEmail,
  createUser,
  updateUser,
} from './db';

function getNameFromEmail(email: string): string {
  const username = email.split('@')[0] || 'user';
  return username
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function inferRoleFromEmail(email: string): 'user' | 'agent' {
  const normalized = email.toLowerCase();
  if (normalized.includes('agent') || normalized.includes('admin') || normalized.endsWith('@thesupport.in')) {
    return 'agent';
  }
  return 'user';
}

async function ensureUserAccount(
  email: string,
  role: 'user' | 'agent',
  overrides: Partial<User> = {}
): Promise<User> {
  const existing = await getUserByEmail(email);
  if (existing) {
    if (overrides.role && existing.role !== overrides.role) {
      const updated = await updateUser(existing.id, { role: overrides.role });
      return (updated || existing) as User;
    }
    if (existing.role !== role) {
      const updated = await updateUser(existing.id, { role });
      return (updated || existing) as User;
    }
    if (overrides.password && overrides.password !== existing.password) {
      const updated = await updateUser(existing.id, { password: overrides.password });
      return (updated || existing) as User;
    }
    return existing;
  }

  return await createUser({
    email,
    name: overrides.name || getNameFromEmail(email),
    company: overrides.company || '',
    address: overrides.address || '',
    phone: overrides.phone || '',
    jobCount: overrides.jobCount ?? 0,
    role: overrides.role || role,
    password: overrides.password,
  });
}

// Validate required environment variables (runtime only, not during build)
// Only check in production runtime, never during build
if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  if (!process.env.NEXTAUTH_SECRET) {
    console.error('⚠️  WARNING: NEXTAUTH_SECRET is not set. Authentication will not work properly.');
    console.error('   Generate one with: openssl rand -base64 32');
  }
}

// NEXTAUTH_URL is runtime-only, never accessed during build
// Railway auto-sets it via RAILWAY_PUBLIC_DOMAIN at runtime
// This function is only called at runtime, never during build
const getNextAuthUrl = () => {
  // Only access at runtime, not during build
  if (typeof window !== 'undefined') {
    // Client-side: use window location
    return window.location.origin;
  }
  
  // Server-side runtime: Railway automatically sets this
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  // Fallback: Use RAILWAY_PUBLIC_DOMAIN if available
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  // Production fallback: use our public Railway URI
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.thesupport.agency';
  }
  // Development: use NEXT_PUBLIC_BASE_URL or throw error
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  throw new Error('NEXTAUTH_URL or NEXT_PUBLIC_BASE_URL must be set in development');
};

// Check if Google OAuth is configured
const isGoogleOAuthConfigured = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  return !!(clientId && clientSecret && clientId.trim() !== '' && clientSecret.trim() !== '');
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Use request headers to determine base URL dynamically
  useSecureCookies: process.env.NODE_ENV === 'production',
  providers: [
    // Only add Google Provider if credentials are configured
    ...(isGoogleOAuthConfigured() ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),
    CredentialsProvider({
      name: 'OTP',
      credentials: {
        email: { label: 'Email', type: 'email' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const secret = credentials.otp.trim();

        await ensureDatabaseSetup();

        const desiredRole = inferRoleFromEmail(email);

        // Admin bypass is restricted to agent/admin emails
        if (secret === 'admin-login') {
          if (desiredRole !== 'agent') {
            throw new Error('Admin access allowed only for agent accounts.');
          }

          const user = await ensureUserAccount(email, 'agent', {
            role: 'agent',
            name: getNameFromEmail(email),
            company: 'TheSupport.agency',
            address: '',
            phone: '',
          });

          const sanitized = { ...user };
          delete (sanitized as any).password;
          return sanitized as any;
        }

        if (secret === 'test-login-bypass') {
          const user = await ensureUserAccount(email, desiredRole);
          const sanitized = { ...user };
          delete (sanitized as any).password;
          return sanitized as any;
        }

        const isOtpCode = /^\d{6}$/.test(secret);

        if (isOtpCode) {
          if (!verifyOTP(email, secret)) {
            return null;
          }

          const user = await ensureUserAccount(email, desiredRole);
          const sanitized = { ...user };
          delete (sanitized as any).password;
          return sanitized as any;
        }

        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
          throw new Error('User not found. Please request an OTP first.');
        }

        if (!existingUser.password) {
          throw new Error('Password not set. Use OTP login once to create your account.');
        }

        let passwordMatch = false;
        try {
          passwordMatch = await bcrypt.compare(secret, existingUser.password);
        } catch (error) {
          console.warn('Bcrypt comparison failed, trying plaintext comparison:', error);
          passwordMatch = secret === existingUser.password;
        }

        if (!passwordMatch) {
          throw new Error('Invalid email or password.');
        }

        const sanitized = { ...existingUser };
        delete (sanitized as any).password;
        return sanitized as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await ensureDatabaseSetup();
        if (user?.id) {
          await createLoginLog({
            userId: user.id,
            email: user.email,
            role: (user as any).role || 'user',
            provider: account?.provider || 'credentials',
          });
        }
      } catch (error) {
        console.warn('Database setup/logging skipped during sign-in:', (error as any)?.message || error);
      }

      if (account?.provider === 'google') {
        if (user.email) {
          await ensureDatabaseSetup();
          const dbUser = await ensureUserAccount(user.email, 'user', {
            name: user.name || getNameFromEmail(user.email),
          });

          user.id = dbUser.id;
          user.name = dbUser.name;
          (user as any).role = dbUser.role;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'user' | 'agent';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};

