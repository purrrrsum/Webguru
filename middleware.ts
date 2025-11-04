import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Public routes that don't require authentication
    const publicRoutes = [
      '/',
      '/about',
      '/pricing',
      '/contact',
      '/blog',
      '/policy',
      '/terms',
      '/auth/signin',
      '/admin', // Admin login page is public
      '/test-chat', // Test page for getting chat URLs
    ];

    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    // Allow public routes and API auth routes
    if (isPublicRoute || pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }

    // Protect all other routes - redirect to signin if not authenticated
    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        // Public routes don't need token
        const publicRoutes = ['/', '/about', '/pricing', '/contact', '/blog', '/policy', '/terms', '/auth/signin', '/admin', '/test-chat'];
        const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
        
        if (isPublic || pathname.startsWith('/api/auth')) {
          return true; // Allow public routes
        }
        
        return !!token; // Require token for protected routes
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/chat/:path*',
    '/profile/:path*',
    '/api/upload/:path*',
    '/api/tick/:path*',
    '/api/delete/:path*',
    '/api/profile/:path*',
    '/api/jobs/:path*',
    '/api/chat/:path*',
  ],
};

