import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api/auth',
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/auth',
  },
}

export default nextConfig
