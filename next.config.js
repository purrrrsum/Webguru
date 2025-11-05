/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  output: 'standalone', // For Hostinger deployment
  // NEXTAUTH_URL is NOT needed during build - it's runtime only
  // Railway will set it automatically via RAILWAY_PUBLIC_DOMAIN at runtime
}

module.exports = nextConfig

