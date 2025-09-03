import './src/env.js'
import type { NextConfig } from 'next'

const config: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    useCache: true
  }
}

export default config
