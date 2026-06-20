import { headers } from 'next/headers'
import type { Metadata } from 'next'
import {
  loadPublicPageSnapshot,
  PublicSnapshotPageTreeRenderer,
  type PublicPageSnapshot,
} from '@weftly/loader'
import { WebsiteRenderSurface } from '@weftly/runtime'
import { DynamicStub } from '../../../components/DynamicStub'
import { appRegistry } from '../../../lib/registry'
import {
  pathFromSlug,
  snapshotCacheTag,
  toURLSearchParams,
  type SearchParamsRaw,
} from '../../../lib/routing'

export const dynamic = 'force-dynamic'

const PROJECT_ID = process.env.NEXT_PUBLIC_WEFTLY_PROJECT_ID?.trim() || undefined

type PageParams = { locale: string; slug?: string[] }

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

  return loadPublicPageSnapshot<PublicPageSnapshot>({
    host,
    projectId: PROJECT_ID,
    locale,
    path,
    state: 'PUBLISHED',
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

  return snapshot.ok ? metadataFromSnapshot(snapshot.data) : {}
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

  return (
    <WebsiteRenderSurface>
      <PublicSnapshotPageTreeRenderer
        snapshot={snapshot.data}
        registry={appRegistry}
        urlParams={toURLSearchParams(rawSearchParams)}
        now={new Date()}
      />
    </WebsiteRenderSurface>
  )
}
