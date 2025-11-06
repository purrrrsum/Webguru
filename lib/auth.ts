import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from './utils';
import { verifyOTP } from './otp';

// Simple character matching function
// Checks if username and password have matching characters
function simpleCharacterMatch(username: string, password: string): boolean {
  // Normalize both strings (lowercase, remove spaces)
  const normalizedUsername = username.toLowerCase().trim();
  const normalizedPassword = password.toLowerCase().trim();
  
  // Direct match
  if (normalizedUsername === normalizedPassword) {
    return true;
  }
  
  // Check if password contains all characters from username
  const usernameChars = normalizedUsername.split('').filter(c => c !== '@' && c !== '.' && c !== ' ');
  const passwordChars = normalizedPassword.split('');
  
  // Check if all username characters exist in password
  const allCharsMatch = usernameChars.every(char => passwordChars.includes(char));
  
  return allCharsMatch;
}

// Generate a simple user object without database
function createSimpleUser(email: string, role: 'user' | 'agent' = 'user'): User {
  const username = email.split('@')[0];
  return {
    id: `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`,
    email: email,
    name: username.charAt(0).toUpperCase() + username.slice(1),
    company: '',
    address: '',
    phone: '',
    jobCount: 0,
    role: role,
  };
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

        // Extract username from email (part before @)
        const username = credentials.email.split('@')[0];
        const password = credentials.otp;

        // Check for admin bypass (special case for admin login)
        if (credentials.otp === 'admin-login') {
          // For admin login, check if email matches admin pattern
          if (credentials.email.includes('agent') || credentials.email.includes('admin')) {
            return createSimpleUser(credentials.email, 'agent');
          }
          return null;
        }

        // Test login bypass - temporarily enabled for testing
        if (credentials.otp === 'test-login-bypass') {
          return createSimpleUser(credentials.email, 'user');
        }

        // Password login for users and agents
        // Try password login if OTP field doesn't look like a 6-digit OTP
        // Check: not exactly 6 digits, or longer than 6 characters
        const isLikelyPassword = credentials.otp && (
          credentials.otp.length > 6 || 
          (credentials.otp.length >= 4 && !/^\d{6}$/.test(credentials.otp))
        );

        if (isLikelyPassword) {
          // Use simple character matching
          if (simpleCharacterMatch(username, password)) {
            console.log(`[AUTH] Password login successful for ${credentials.email} using character matching`);
            // Determine role based on email pattern
            const role = (credentials.email.includes('agent') || credentials.email.includes('admin')) 
              ? 'agent' 
              : 'user';
            return createSimpleUser(credentials.email, role);
          } else {
            console.error(`[AUTH] Password mismatch for user: ${credentials.email}`);
            throw new Error('Invalid email or password. Username and password must have matching characters.');
          }
        }

        // OTP verification (keep existing OTP logic)
        if (!verifyOTP(credentials.email, credentials.otp)) {
          return null;
        }

        // Create user without database
        return createSimpleUser(credentials.email, 'user');
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Create user without database for Google login
        if (user.email) {
          const simpleUser = createSimpleUser(user.email, 'user');
          user.id = simpleUser.id;
          user.name = simpleUser.name;
          (user as any).role = simpleUser.role;
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

