import type { NextConfig } from 'next'

const pullzoneHost = process.env.NEXT_PUBLIC_BUNNY_PULLZONE_HOSTNAME

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@weftly/runtime', '@weftly/loader', '@weftly/host'],
  experimental: { turbopackFileSystemCacheForDev: false },
  images: {
    remotePatterns: pullzoneHost
      ? [{ protocol: 'https', hostname: pullzoneHost, port: '', pathname: '/**', search: '' }]
      : [{ protocol: 'https', hostname: '*.b-cdn.net', port: '', pathname: '/**', search: '' }],
  },
}

export default nextConfig
