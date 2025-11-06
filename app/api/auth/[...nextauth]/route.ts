import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Create handler with explicit base URL handling for production
async function handler(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
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
  
  // Get the nextauth route segments from params
  const params = await context.params;
  const nextauthRoute = params?.nextauth || [];
  
  // Create a modified request URL with nextauth route in query string
  // This is what NextAuth v4 expects for App Router compatibility
  const url = new URL(req.url);
  
  // Add nextauth route segments to query string for NextAuth compatibility
  if (nextauthRoute.length > 0) {
    url.searchParams.set('nextauth', nextauthRoute.join('/'));
  }
  
  // Create a new request with the modified URL
  const modifiedRequest = new NextRequest(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
  });
  
  try {
    // Call NextAuth with the modified request
    const response = await NextAuth(authOptions)(modifiedRequest as any);
    
    // Add no-cache headers to prevent caching
    if (response instanceof NextResponse) {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }
    
    return response;
  } catch (error: any) {
    console.error('NextAuth handler error:', error);
    return NextResponse.json(
      { error: 'Authentication error', details: error.message },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST };

