/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  output: 'standalone', // For Hostinger deployment
}

module.exports = nextConfig

