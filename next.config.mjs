/** @type {import('next').NextConfig} */
const phpApiBaseUrl = process.env.PHP_API_BASE_URL || 'http://localhost/Tectigon/backend/api'

const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${phpApiBaseUrl}/auth/:path*`,
      },
    ]
  },
}

export default nextConfig
