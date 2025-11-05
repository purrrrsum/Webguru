import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from './utils';
import { verifyOTP } from './otp';
import { getUserByEmail, createUser } from './db';
import { compare } from 'bcryptjs';

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
  // Development fallback
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
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

        // Check for admin bypass
        if (credentials.otp === 'admin-login') {
          const agent = await getUserByEmail(credentials.email);
          if (agent && agent.role === 'agent') {
            return {
              id: agent.id,
              email: agent.email,
              name: agent.name,
              role: agent.role,
            };
          }
          return null;
        }

        // Test login bypass - temporarily enabled for testing
        if (credentials.otp === 'test-login-bypass') {
          const user = await getUserByEmail(credentials.email);
          if (user && user.role === 'user') {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
          return null;
        }

        // Password login for users and agents
        // If OTP field contains a password-like string (not 6 digits), try password login
        if (credentials.otp && credentials.otp.length > 6 && !/^\d{6}$/.test(credentials.otp)) {
          const user = await getUserByEmail(credentials.email);
          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const passwordMatch = await compare(credentials.otp, user.password);
          if (passwordMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
          return null;
        }

        if (!verifyOTP(credentials.email, credentials.otp)) {
          return null;
        }

        // Find or create user
        let user = await getUserByEmail(credentials.email);

        if (!user) {
          // Create new user
          user = await createUser({
            email: credentials.email,
            name: credentials.email.split('@')[0],
            company: '',
            address: '',
            phone: '',
            jobCount: 0,
            role: 'user',
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Find or create user (always as 'user' role for Google login)
        let dbUser = await getUserByEmail(user.email || '');

        if (!dbUser && user.email) {
          dbUser = await createUser({
            email: user.email,
            name: user.name || user.email.split('@')[0],
            company: '',
            address: '',
            phone: '',
            jobCount: 0,
            role: 'user', // Google login always creates regular users
          });
        }

        if (dbUser) {
          // Update user object with database user info
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
  },
  session: {
    strategy: 'jwt',
  },
};

