import { headers } from 'next/headers'
import { reportConnection } from '@weftly/loader'
import { DynamicStub } from '../../../../components/DynamicStub'
import { LivePreviewClient } from '../../../../components/preview/LivePreviewClient'
import {
  pathFromSlug,
  resolvePreviewParentOrigin,
  toSearchParamEntries,
  type SearchParamsRaw,
} from '../../../../lib/routing'

export const dynamic = 'force-dynamic'

type PreviewParams = { locale: string; slug?: string[] }

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<PreviewParams>
  searchParams: Promise<SearchParamsRaw>
}) {
  const [{ locale, slug }, rawSearchParams] = await Promise.all([
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
  // matching SiteDomain verified. Never awaited/blocking; swallows failures.
  const requestHost = (await headers()).get('host')
  if (requestHost) void reportConnection({ host: requestHost, environment: 'production' })

  return (
    <LivePreviewClient
      parentOrigin={parentOrigin}
      searchParamEntries={toSearchParamEntries(rawSearchParams)}
    >
      <DynamicStub path={path} />
    </LivePreviewClient>
  )
}
