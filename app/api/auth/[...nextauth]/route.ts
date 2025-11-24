import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest, context: any) => {
  // Set NEXTAUTH_URL dynamically from request headers if not already set
  if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes('localhost')) {
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'www.thesupport.agency';
    
    if (host && !host.includes('localhost')) {
      process.env.NEXTAUTH_URL = `${protocol}://${host}`;
    } else {
      process.env.NEXTAUTH_URL = 'https://www.thesupport.agency';
    }
  }

  const nextAuthHandler = NextAuth(authOptions);
  return nextAuthHandler(req as any, context);
};

export { handler as GET, handler as POST };

