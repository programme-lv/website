/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  output: 'standalone',
  async headers() {
    // Dev assets default to max-age=14400, which lets browsers and the
    // Cloudflare edge serve stale JS/CSS after the dev server restarts
    // (missing styles, "stale" build overlay, failed server actions).
    if (process.env.NODE_ENV !== 'development') {
      return [];
    }
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
  allowedDevOrigins: process.env.DEV_PUBLIC_HOST ? [process.env.DEV_PUBLIC_HOST] : [],
  async rewrites() {
    return process.env.API_PROXY_TARGET ? [{
      source: '/api/:path*',
      destination: `${process.env.API_PROXY_TARGET}/:path*`,
    }] : []
  },
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
      },
      ...(process.env.DEV_PUBLIC_HOST ? [{
        protocol: 'https',
        hostname: process.env.DEV_PUBLIC_HOST,
        pathname: '/api/**',
      }] : []),
      {
        protocol: 'https',
        hostname: 'api.programme.lv',
        pathname: '/**',
      },
    ]
  },
}

module.exports = nextConfig
