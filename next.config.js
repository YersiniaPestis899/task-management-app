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
  }
}

module.exports = nextConfig