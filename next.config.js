/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Request-Header-Size',
            value: 'unlimited'
          }
        ]
      }
    ]
  },
  // セキュリティとパフォーマンスの設定を追加
  images: {
    domains: ['vercel.com', 'lh3.googleusercontent.com'], // Google OAuth用のドメインも追加
  },
  cookies: {
    secure: process.env.NODE_ENV === 'production',
  },
  // 本番環境でのセキュリティヘッダーを追加
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}