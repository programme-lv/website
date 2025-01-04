const { hostname } = require('os')

/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tasks',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      // {
      //   hostname: 'proglv-public.s3.eu-central-1.amazonaws.com'
      // }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
