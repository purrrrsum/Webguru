import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Admin email restriction
const ADMIN_EMAIL = 'jaffarsadiq1001@gmail.com';

// Check if Google OAuth is configured
const isGoogleOAuthConfigured = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  return !!(clientId && clientSecret && clientId.trim() !== '' && clientSecret.trim() !== '');
};

export const adminAuthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production',
  providers: [
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
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow the specific admin email
      if (account?.provider === 'google') {
        const email = user.email?.toLowerCase().trim();
        if (email !== ADMIN_EMAIL.toLowerCase()) {
          return false; // Reject sign-in
        }
        // Set admin role
        (user as any).role = 'admin';
        (user as any).isAdmin = true;
        return true;
      }
      return false; // Reject all non-Google sign-ins
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id || user.email || '';
        token.email = user.email || '';
        token.name = user.name || '';
        token.role = 'admin';
        token.isAdmin = true;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).role = 'admin';
        (session.user as any).isAdmin = true;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin-panel/login',
    error: '/admin-panel/login?error=AccessDenied',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

