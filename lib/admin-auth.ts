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
      // STRICT: Only allow the specific admin email - reject all others
      if (account?.provider === 'google') {
        const email = user.email?.toLowerCase().trim();
        const adminEmailLower = ADMIN_EMAIL.toLowerCase().trim();
        
        // Strict email check - must match exactly
        if (!email || email !== adminEmailLower) {
          console.warn(`Admin login rejected: ${email} is not authorized`);
          return false; // Reject sign-in
        }
        
        // Double-check email matches
        if (email !== adminEmailLower) {
          return false;
        }
        
        // Set admin role only for authorized email
        (user as any).role = 'admin';
        (user as any).isAdmin = true;
        return true;
      }
      // Reject all non-Google sign-ins
      return false;
    },
    async jwt({ token, user, account }) {
      if (user) {
        const email = user.email?.toLowerCase().trim();
        const adminEmailLower = ADMIN_EMAIL.toLowerCase().trim();
        
        // Verify email on every JWT refresh
        if (!email || email !== adminEmailLower) {
          // Clear token if email doesn't match
          return {};
        }
        
        token.id = user.id || user.email || '';
        token.email = email;
        token.name = user.name || '';
        token.role = 'admin';
        token.isAdmin = true;
      } else if (token.email) {
        // On token refresh, verify email still matches
        const email = token.email.toLowerCase().trim();
        const adminEmailLower = ADMIN_EMAIL.toLowerCase().trim();
        if (email !== adminEmailLower) {
          // Clear token if email doesn't match
          return {};
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Verify email matches admin email before creating session
      const email = token.email?.toLowerCase().trim();
      const adminEmailLower = ADMIN_EMAIL.toLowerCase().trim();
      
      if (!email || email !== adminEmailLower) {
        // Return empty session if email doesn't match
        return session;
      }
      
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = email;
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

