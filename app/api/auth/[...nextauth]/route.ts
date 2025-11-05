import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Create handler with explicit base URL handling for production
async function handler(req: NextRequest) {
  // Get the base URL from request headers (production-aware)
  const host = req.headers.get('host') || '';
  const protocol = req.headers.get('x-forwarded-proto') || 'https';
  
  // Set NEXTAUTH_URL from request if not already set
  if (typeof process.env.NEXTAUTH_URL === 'undefined' || !process.env.NEXTAUTH_URL) {
    if (process.env.NODE_ENV === 'production') {
      process.env.NEXTAUTH_URL = 'https://www.thesupport.agency';
    } else if (host && !host.includes('localhost')) {
      process.env.NEXTAUTH_URL = `${protocol}://${host}`;
    } else if (process.env.NEXT_PUBLIC_BASE_URL) {
      process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_BASE_URL;
    }
  }
  
  const response = await NextAuth(authOptions)(req);
  
  // Add no-cache headers to prevent caching
  if (response instanceof NextResponse) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  return response;
}

export { handler as GET, handler as POST };

