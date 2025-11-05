import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Create handler - NextAuth will use request headers automatically for base URL
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

