/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  output: 'standalone', // For Hostinger deployment
  // Make NEXTAUTH_URL optional during build
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  },
}

module.exports = nextConfig

