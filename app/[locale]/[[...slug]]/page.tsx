import { headers } from 'next/headers'
import type { Metadata } from 'next'
import {
  loadPublicPageSnapshot,
  PublicSnapshotPageTreeRenderer,
  type PublicPageSnapshot,
} from '@weftly/loader'
import * as WeftlyLoader from '@weftly/loader'
import { WebsiteRenderSurface } from '@weftly/runtime'
import { DynamicStub } from '../../../components/DynamicStub'
import { appRegistry } from '../../../lib/registry'
import {
  contentEnvironment,
  pathFromSlug,
  snapshotCacheTag,
  toURLSearchParams,
  type SearchParamsRaw,
} from '../../../lib/routing'

export const dynamic = 'force-dynamic'

const PROJECT_ID = process.env.NEXT_PUBLIC_WEFTLY_PROJECT_ID?.trim() || undefined

type PageParams = { locale: string; slug?: string[] }

type CollectionListResolver = (input: {
  snapshot: PublicPageSnapshot
  searchParams?: URLSearchParams
  options?: { tags?: string[] }
}) => Promise<{
  snapshot: PublicPageSnapshot
  errors: Array<{ nodeId: string; reason: string; status?: number }>
}>

/**
 * @weftly/loader 0.3.x can render the static collection payload embedded in
 * a snapshot, but does not export the request-dependent resolver yet. Keep
 * that release buildable and activate dynamic pagination/filtering as soon as
 * the installed loader exposes the additive capability.
 */
function collectionListResolver(): CollectionListResolver | undefined {
  return (WeftlyLoader as unknown as {
    resolvePublicCollectionLists?: CollectionListResolver
  }).resolvePublicCollectionLists
}

function faviconIcons(url: string | null | undefined): Metadata['icons'] | undefined {
  return url ? { icon: [{ url }] } : undefined
}

function metadataFromSnapshot(snapshot: PublicPageSnapshot): Metadata {
  const seo = snapshot.seo
  if (!seo) return { icons: faviconIcons(snapshot.site.faviconUrl) }

  const title = seo.title
  const description = seo.metaDescription.trim() || undefined
  const ogTitle = seo.ogTitle ?? title
  const ogDescription = (seo.ogDescription ?? seo.metaDescription).trim() || undefined
  const ogImage =
    seo.ogImageAssetId && snapshot.assets[seo.ogImageAssetId]
      ? snapshot.assets[seo.ogImageAssetId].cdnUrl
      : undefined
  const suffix = snapshot.canonicalPath === '/' ? '' : snapshot.canonicalPath
  const canonical =
    seo.canonical ?? `${snapshot.site.canonicalBaseUrl}/${snapshot.locale}${suffix}`

  return {
    title,
    description,
    icons: faviconIcons(snapshot.site.faviconUrl),
    alternates: { canonical },
    robots:
      seo.noindex || !snapshot.site.indexingAllowed
        ? { index: false, follow: false }
        : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

async function loadSnapshot(locale: string, path: string) {
  const host = (await headers()).get('host')

  return loadPublicPageSnapshot({
    host,
    projectId: PROJECT_ID,
    locale,
    path,
    environment: contentEnvironment(),
    tags: [snapshotCacheTag(locale, path)],
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const snapshot = await loadSnapshot(locale, pathFromSlug(slug))

  const metadata = snapshot.ok ? metadataFromSnapshot(snapshot.data) : {}
  return contentEnvironment() === 'staging'
    ? { ...metadata, robots: { index: false, follow: false } }
    : metadata
}

export default async function PublicPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>
  searchParams: Promise<SearchParamsRaw>
}) {
  const [{ locale, slug }, rawSearchParams] = await Promise.all([
    params,
    searchParams,
  ])
  const path = pathFromSlug(slug)
  const snapshot = await loadSnapshot(locale, path)

  if (!snapshot.ok) {
    return <DynamicStub path={path} />
  }

  const urlParams = toURLSearchParams(rawSearchParams)
  const resolver = collectionListResolver()
  const resolved = resolver
    ? await resolver({
        snapshot: snapshot.data,
        searchParams: urlParams,
        options: { tags: [snapshotCacheTag(locale, path)] },
      })
    : { snapshot: snapshot.data, errors: [] }
  if (resolved.errors.length > 0) {
    console.warn('[public-runtime] collection list resolution failed', {
      path,
      locale,
      errors: resolved.errors,
    })
  }

  return (
    <WebsiteRenderSurface>
      <PublicSnapshotPageTreeRenderer
        snapshot={resolved.snapshot}
        registry={appRegistry}
        urlParams={urlParams}
        now={new Date()}
      />
    </WebsiteRenderSurface>
  )
}
