export type SearchParamsRaw = { [key: string]: string | string[] | undefined }

export type PreviewState = 'DRAFT' | 'STAGED' | 'PUBLISHED'

const SUPPORTED_ORIGIN_PROTOCOLS = new Set(['http:', 'https:'])

export function pathFromSlug(slug: string[] | undefined): string {
  const cleanSegments = (slug ?? [])
    .map((segment) => segment.trim().replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)

  return cleanSegments.length ? `/${cleanSegments.join('/')}` : '/'
}

export function defaultLocale(): string {
  return process.env.NEXT_PUBLIC_WEFTLY_DEFAULT_LOCALE?.trim() || 'de'
}

export function toURLSearchParams(raw: SearchParamsRaw): URLSearchParams {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined) continue

    if (Array.isArray(value)) {
      for (const entry of value) {
        params.append(key, entry)
      }
    } else {
      params.append(key, value)
    }
  }

  return params
}

export function toSearchParamEntries(raw: SearchParamsRaw): [string, string][] {
  return Array.from(toURLSearchParams(raw).entries())
}

export function resolvePreviewState(
  value: string | string[] | undefined,
): PreviewState | undefined {
  if (value === 'DRAFT' || value === 'STAGED' || value === 'PUBLISHED') {
    return value
  }

  return undefined
}

export function isPublicContentState(state: PreviewState): state is 'STAGED' | 'PUBLISHED' {
  return state === 'STAGED' || state === 'PUBLISHED'
}

export function collectPreviewParentOrigins(value: string | undefined): string[] {
  const origins: string[] = []
  const seenOrigins = new Set<string>()

  for (const entry of value?.split(',') ?? []) {
    const origin = toSupportedOrigin(entry)

    if (origin && !seenOrigins.has(origin)) {
      seenOrigins.add(origin)
      origins.push(origin)
    }
  }

  return origins
}

export function resolvePreviewParentOrigin(args: {
  parentOrigin: string | string[] | undefined
  allowedOrigins: string | undefined
}): string | null {
  if (Array.isArray(args.parentOrigin)) {
    return null
  }

  const parentOrigin = toSupportedOrigin(args.parentOrigin)
  if (!parentOrigin) {
    return null
  }

  return collectPreviewParentOrigins(args.allowedOrigins).includes(parentOrigin)
    ? parentOrigin
    : null
}

export function snapshotCacheTag(locale: string, path: string): string {
  const readableTag = `public-content:${locale}:${path}`
  if (readableTag.length <= 256) {
    return readableTag
  }

  const readableLocaleTag = `public-content:${locale}:${hashString(path)}`
  if (readableLocaleTag.length <= 256) {
    return readableLocaleTag
  }

  return `public-content:${hashString(locale)}:${hashString(path)}`
}

function toSupportedOrigin(value: string | null | undefined): string | null {
  try {
    const trimmed = value?.trim()
    if (!trimmed) {
      return null
    }

    const url = new URL(trimmed)
    if (!SUPPORTED_ORIGIN_PROTOCOLS.has(url.protocol)) {
      return null
    }

    return url.origin
  } catch {
    return null
  }
}

function hashString(value: string): string {
  let hash = 0x811c9dc5

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }

  return (hash >>> 0).toString(16).padStart(8, '0')
}
