import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    logging: {
        fetches: {
            fullUrl: true
        }
    },
    env: {
        AUTH_URL: process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000'
    }
}

export default nextConfig
