import type { NextConfig } from 'next'
import path from 'path'

const pullzoneHost = process.env.NEXT_PUBLIC_BUNNY_PULLZONE_HOSTNAME
const workspaceRoot = path.resolve(__dirname, '../..')

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@weftly/runtime', '@weftly/loader', '@weftly/host'],
  turbopack: { root: workspaceRoot },
  experimental: { turbopackFileSystemCacheForDev: false },
  images: {
    remotePatterns: pullzoneHost
      ? [{ protocol: 'https', hostname: pullzoneHost, port: '', pathname: '/**', search: '' }]
      : [{ protocol: 'https', hostname: '*.b-cdn.net', port: '', pathname: '/**', search: '' }],
  },
}

export default nextConfig
