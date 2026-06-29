/** @type {import('next').NextConfig} */
const phpApiBaseUrl = process.env.PHP_API_BASE_URL || 'http://localhost/Tectigon/backend/api'
const phpBackendBaseUrl = phpApiBaseUrl.replace(/\/api\/?$/, '')

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
      {
        source: '/backend/api/:path*',
        destination: `${phpApiBaseUrl}/:path*`,
      },
      {
        source: '/uploads/trainings/:path*',
        destination: `${phpBackendBaseUrl}/uploads/trainings/:path*`,
      },
    ]
  },
}

export default nextConfig
