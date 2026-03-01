import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// Admin email restriction
const ADMIN_EMAIL = 'jaffarsadiq1001@gmail.com';
const TEST_ADMIN_EMAIL = 'admin@thesupport.agency';

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
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials?.email === TEST_ADMIN_EMAIL &&
          credentials?.password === 'admin123'
        ) {
          return { id: 'admin-test', email: TEST_ADMIN_EMAIL, name: 'Test Admin', role: 'admin', isAdmin: true };
        }
        return null;
      }
    }),
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
      if (account?.provider === 'credentials' && user.email === TEST_ADMIN_EMAIL) {
        (user as any).role = 'admin';
        (user as any).isAdmin = true;
        return true;
      }

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
      // Reject all non-Google/non-Credentials sign-ins
      return false;
    },
    async jwt({ token, user, account }) {
      if (user) {
        const email = user.email?.toLowerCase().trim() || '';
        const adminEmailLower = ADMIN_EMAIL.toLowerCase().trim();
        const testAdminEmailLower = TEST_ADMIN_EMAIL.toLowerCase().trim();

        // Verify email on every JWT refresh
        if (email !== adminEmailLower && email !== testAdminEmailLower) {
          // Return token with invalid flag if email doesn't match
          token.id = '';
          token.email = '';
          token.role = 'user';
          token.isAdmin = false;
          return token;
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
        const testAdminEmailLower = TEST_ADMIN_EMAIL.toLowerCase().trim();
        if (email !== adminEmailLower && email !== testAdminEmailLower) {
          // Mark token as invalid if email doesn't match
          token.id = '';
          token.email = '';
          token.role = 'user';
          token.isAdmin = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Verify email matches admin email before creating session
      const email = token.email?.toLowerCase().trim() || '';
      const adminEmailLower = ADMIN_EMAIL.toLowerCase().trim();
      const testAdminEmailLower = TEST_ADMIN_EMAIL.toLowerCase().trim();

      if (email !== adminEmailLower && email !== testAdminEmailLower) {
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
    signIn: '/admin',
    error: '/admin?error=AccessDenied',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

