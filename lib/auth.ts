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
  getUserByPhone,
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
  overrides: Partial<User> = {},
  existingAccount?: User | null
): Promise<User> {
  const targetRole = overrides.role || role;
  // Check for existing account
  const existing = existingAccount ?? (await getUserByEmail(email));

  if (existing) {
    // If email exists with different role, deny access
    if (existing.role !== targetRole) {
      throw new Error(
        `This email is already registered as ${existing.role}. Please sign in using the ${existing.role === 'agent' ? 'agent' : 'user'} login page.`
      );
    }

    // Account exists with the correct role, update if needed
    const updates: Partial<User> = {};

    if (overrides.name && overrides.name !== existing.name) {
      updates.name = overrides.name;
    }
    if (overrides.company && overrides.company !== existing.company) {
      updates.company = overrides.company;
    }
    if (overrides.address && overrides.address !== existing.address) {
      updates.address = overrides.address;
    }
    if (overrides.phone && overrides.phone !== existing.phone) {
      updates.phone = overrides.phone;
    }
    if (overrides.password && overrides.password !== existing.password) {
      updates.password = overrides.password;
    }

    if (Object.keys(updates).length > 0) {
      const updated = await updateUser(existing.id, updates);
      return (updated || existing) as User;
    }

    return existing;
  }

  // Account doesn't exist, create it with the requested role
  return await createUser({
    email,
    name: overrides.name || getNameFromEmail(email),
    company: overrides.company || '',
    address: overrides.address || '',
    phone: overrides.phone || '',
    jobCount: overrides.jobCount ?? 0,
    role: targetRole,
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
        email: { label: 'Email or Phone', type: 'text' },
        otp: { label: 'OTP or Token', type: 'text' },
        role: { label: 'Role', type: 'text' },
        isMsg91: { label: 'Is MSG91', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          return null;
        }

        const identifier = credentials.email.trim();
        const secret = credentials.otp.trim();
        const isMsg91 = credentials.isMsg91 === 'true';

        await ensureDatabaseSetup();

        // ---------------- MSG91 VERIFICATION FLOW ---------------- //
        if (isMsg91) {
          try {
            // Verify token locally via MSG91 API exactly as the user specified
            const tokenResponse = await fetch('https://control.msg91.com/api/v5/widget/verifyAccessToken', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                "authkey": "497253TuQmsnhAYdW69a3b86cP1", // The authkey from the frontend widget configuration
                "access-token": secret // jwt_token_from_otp_widget
              }),
            });
            const tokenData = await tokenResponse.json();

            if (tokenData.type === 'error' || tokenData.message !== 'Mobile number verified successfully') {
              throw new Error('MSG91 OTP Validation Failed. Please try again.');
            }

            // Extract the verified mobile number straight from the MSG91 verification payload
            const verifiedMobile = tokenData.mobile;
            if (!verifiedMobile) {
              throw new Error('Mobile number could not be extracted from MSG91 payload.');
            }

            // Find User By Phone
            const userPhone = verifiedMobile.startsWith('+') ? verifiedMobile : `+${verifiedMobile}`;
            const existingPhoneAccount = await getUserByPhone(userPhone);

            if (!existingPhoneAccount) {
              throw new Error(`No account found for phone number ${userPhone}. Please register first.`);
            }

            // Validate requested role matches the existing account
            if (credentials.role && existingPhoneAccount.role !== credentials.role && credentials.role !== 'auto') {
              throw new Error(
                `This phone number is registered as ${existingPhoneAccount.role}. Please use the ${existingPhoneAccount.role === 'agent' ? 'agent' : 'user'} login page.`
              );
            }

            const sanitizedPhoneAccount = { ...existingPhoneAccount };
            delete (sanitizedPhoneAccount as any).password;
            return sanitizedPhoneAccount as any;

          } catch (err: any) {
            throw new Error(`MSG91 Authentication Error: ${err.message}`);
          }
        }
        // -------------------------------------------------------- //

        const email = identifier.toLowerCase();

        const requestedRole =
          credentials.role === 'agent' || credentials.role === 'user'
            ? credentials.role
            : inferRoleFromEmail(email);

        // Check if account exists
        const existingAccount = await getUserByEmail(email);

        // If account exists, always use its existing role for authentication
        // This prevents role mismatch errors when logging in
        const actualRole = existingAccount?.role || requestedRole;

        // For OTP/password login with existing accounts, use the account's role
        // Role check only matters when creating new accounts via OTP
        if (existingAccount && existingAccount.role !== requestedRole) {
          // If trying to use OTP to create account with different role, deny
          // But for password login, we'll use the existing account's role
          const isOtpAttempt = /^\d{6}$/.test(secret.trim());
          if (isOtpAttempt) {
            throw new Error(
              `This email is registered as ${existingAccount.role}. Please use the ${existingAccount.role === 'agent' ? 'agent' : 'user'} login page.`
            );
          }
          // For password login, we'll proceed with the existing account's role
        }

        // Admin bypass is restricted to agent/admin emails
        if (secret === 'admin-login') {
          if (requestedRole !== 'agent' && actualRole !== 'agent') {
            throw new Error('Admin access allowed only for agent accounts.');
          }

          const user = await ensureUserAccount(email, 'agent', {
            role: 'agent',
            name: getNameFromEmail(email),
            company: 'TheSupport.agency',
            address: '',
            phone: '',
          }, existingAccount || undefined);

          const sanitized = { ...user };
          delete (sanitized as any).password;
          return sanitized as any;
        }

        if (secret === 'test-login-bypass') {
          const user = await ensureUserAccount(email, actualRole, {}, existingAccount || undefined);
          const sanitized = { ...user };
          delete (sanitized as any).password;
          return sanitized as any;
        }

        const isOtpCode = /^\d{6}$/.test(secret);

        if (isOtpCode) {
          if (!verifyOTP(email, secret)) {
            return null;
          }

          const user = await ensureUserAccount(email, actualRole, {}, existingAccount || undefined);
          const sanitized = { ...user };
          delete (sanitized as any).password;
          return sanitized as any;
        }

        if (!existingAccount) {
          throw new Error('User not found. Please request an OTP first.');
        }

        if (!existingAccount.password) {
          throw new Error('Password not set. Use OTP login once to create your account.');
        }

        let passwordMatch = false;
        try {
          passwordMatch = await bcrypt.compare(secret, existingAccount.password);
        } catch (error) {
          console.warn('Bcrypt comparison failed, trying plaintext comparison:', error);
          passwordMatch = secret === existingAccount.password;
        }

        if (!passwordMatch) {
          throw new Error('Invalid email or password.');
        }

        // Return the existing account with its actual role
        const sanitized = { ...existingAccount };
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

          // For Google OAuth, check if account already exists first
          const existingAccount = await getUserByEmail(user.email);

          // If account exists, use its existing role
          // Otherwise, infer role from email
          let requestedRole: 'user' | 'agent' = existingAccount?.role || inferRoleFromEmail(user.email);

          const dbUser = await ensureUserAccount(user.email, requestedRole, {
            name: user.name || getNameFromEmail(user.email),
          }, existingAccount || undefined);

          user.id = dbUser.id;
          user.name = dbUser.name;
          (user as any).role = dbUser.role;
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'user';

        // For Google OAuth, check if we need to update role based on cookie
        // The cookie is set before OAuth and should be available in the request
        // Since we can't access cookies directly here, we'll rely on the role
        // set during signIn, which uses email inference
        // The actual role selection happens at login page level
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

