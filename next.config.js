/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  output: 'standalone',
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
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development' ? true : false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'proglv-dev.s3.eu-central-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'proglv-public.s3.eu-central-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dvhk4hiwp1rmf.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      }
    ]
  },
}

module.exports = nextConfig
