/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  // output: 'standalone', // Temporarily disabled - Railway works better with standard output
  // NEXTAUTH_URL is NOT needed during build - it's runtime only
  // Railway will set it automatically via RAILWAY_PUBLIC_DOMAIN at runtime
  
  // Disable caching for production
  generateEtags: false,
  poweredByHeader: false,
  
  // API routes caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  
}

module.exports = nextConfig

