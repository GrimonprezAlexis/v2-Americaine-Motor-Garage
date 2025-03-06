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
    AWS_S3_BUCKET: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
    SMTP_HOST: process.env.NEXT_PUBLIC_SMTP_HOST,
    SMTP_PORT: process.env.NEXT_PUBLIC_SMTP_PORT,
    SMTP_USER: process.env.NEXT_PUBLIC_SMTP_USER,
    SMTP_PASS: process.env.NEXT_PUBLIC_SMTP_PASS,
    SMTP_FROM: process.env.NEXT_PUBLIC_SMTP_FROM,
    SMTP_TO_ADMIN: process.env.NEXT_PUBLIC_SMTP_TO_ADMIN
  },
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig