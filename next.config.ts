import type { NextConfig } from 'next'
import path from 'path'
import { existsSync } from 'fs'

const pullzoneHost = process.env.NEXT_PUBLIC_BUNNY_PULLZONE_HOSTNAME

// Turbopack root: the Weftly monorepo root when developed in-repo (where the
// pnpm lockfile lives), otherwise this app's own directory when the template
// is shipped standalone to a customer.
const appDir = __dirname
const monorepoRoot = path.resolve(appDir, '../..')
const turbopackRoot = existsSync(path.join(monorepoRoot, 'pnpm-workspace.yaml'))
  ? monorepoRoot
  : appDir

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@weftly/runtime', '@weftly/loader', '@weftly/host'],
  turbopack: { root: turbopackRoot },
  experimental: { turbopackFileSystemCacheForDev: false },
  images: {
    remotePatterns: pullzoneHost
      ? [{ protocol: 'https', hostname: pullzoneHost, port: '', pathname: '/**', search: '' }]
      : [{ protocol: 'https', hostname: '*.b-cdn.net', port: '', pathname: '/**', search: '' }],
  },
}

export default nextConfig
