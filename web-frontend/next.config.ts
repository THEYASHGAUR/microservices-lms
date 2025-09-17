import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
  },
}

export default nextConfig
