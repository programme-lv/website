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
    ]
  },
}

module.exports = nextConfig
