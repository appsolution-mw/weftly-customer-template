import { headers } from 'next/headers'
import { after } from 'next/server'
import type { Metadata } from 'next'
import { reportConnection } from '@weftly/loader'
import { PreviewStatus } from '../../../../components/preview/PreviewStatus'
import { LivePreviewClient } from '../../../../components/preview/LivePreviewClient'
import {
  contentEnvironment,
  pathFromSlug,
  resolvePreviewParentOrigin,
  toSearchParamEntries,
  type SearchParamsRaw,
} from '../../../../lib/routing'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { robots: { index: false, follow: false } }

type PreviewParams = { locale: string; slug?: string[] }

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<PreviewParams>
  searchParams: Promise<SearchParamsRaw>
}) {
  const [{ slug }, rawSearchParams] = await Promise.all([
    params,
    searchParams,
  ])
  const path = pathFromSlug(slug)
  const parentOrigin = resolvePreviewParentOrigin({
    parentOrigin: rawSearchParams.parentOrigin,
    allowedOrigins: process.env.WEFTLY_BUILDER_ORIGINS,
  })

  // Best-effort, throttled connection heartbeat: tells the builder this deployed
  // site (at this host) holds the project's API key → the builder marks the
  // matching SiteDomain verified. after() keeps the request alive on Vercel.
  const requestHost = (await headers()).get('host')
  const environment = contentEnvironment()
  if (requestHost) {
    after(() => reportConnection({ host: requestHost, environment }))
  }

  return (
    <LivePreviewClient
      parentOrigin={parentOrigin}
      searchParamEntries={toSearchParamEntries(rawSearchParams)}
    >
      <PreviewStatus parentOrigin={parentOrigin} path={path} />
    </LivePreviewClient>
  )
}
