/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'app.auto-ways.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        pathname: '/**',
      }
    ]
  },
  env: {
    AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
    AWS_S3_BUCKET: process.env.NEXT_PUBLIC_AWS_S3_BUCKET
  },
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig