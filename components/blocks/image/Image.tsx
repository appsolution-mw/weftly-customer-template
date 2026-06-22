import NextImage, { getImageProps } from 'next/image'
import type { AssetRow } from '@weftly/runtime/lib/asset-lookup'
import {
  isResponsiveValueMap,
  type ResponsiveViewport,
} from '@weftly/runtime/lib/responsive-settings'
import { EmptyAssetPlaceholder } from '../_shared/EmptyAssetPlaceholder'
import styles from './Image.module.scss'

type ImageLoading = 'lazy' | 'eager'
type ImageFetchPriority = 'auto' | 'high'

function resolveLoadingAttrs({
  loading,
  fetchPriority,
}: {
  loading?: string
  fetchPriority?: string
}): { loading: ImageLoading; fetchPriority?: 'high' } {
  if (fetchPriority === 'high') {
    return { loading: 'eager', fetchPriority: 'high' }
  }

  return { loading: loading === 'eager' ? 'eager' : 'lazy' }
}

const viewportSources = [
  {
    viewport: 'mobile-portrait',
    media: '(max-width: 375px)',
  },
  {
    viewport: 'mobile-landscape',
    media: '(max-width: 767px)',
  },
  {
    viewport: 'tablet-portrait',
    media: '(max-width: 768px)',
  },
  {
    viewport: 'tablet-landscape',
    media: '(max-width: 1024px)',
  },
] satisfies Array<{ viewport: ResponsiveViewport; media: string }>

type ResponsiveImageMap = Partial<Record<ResponsiveViewport, AssetRow | null>>
type ImageValue = AssetRow | ResponsiveImageMap | null

function isAssetRow(value: unknown): value is AssetRow {
  return (
    value !== null &&
    typeof value === 'object' &&
    'cdnUrl' in value &&
    typeof (value as { cdnUrl?: unknown }).cdnUrl === 'string'
  )
}

function getResponsiveImages(image: ImageValue): ResponsiveImageMap {
  if (!image || isAssetRow(image) || !isResponsiveValueMap(image)) return {}
  return image as ResponsiveImageMap
}

function getFallbackImage(image: ImageValue): AssetRow | null {
  if (isAssetRow(image)) return image
  const responsiveImages = getResponsiveImages(image)
  return (
    responsiveImages.desktop ??
    responsiveImages['tablet-landscape'] ??
    responsiveImages['tablet-portrait'] ??
    responsiveImages['mobile-landscape'] ??
    responsiveImages['mobile-portrait'] ??
    null
  )
}

function hasViewportImage(images: ResponsiveImageMap, fallback: AssetRow): boolean {
  return viewportSources.some(({ viewport }) => {
    const image = images[viewport]
    return image?.cdnUrl && image.cdnUrl !== fallback.cdnUrl
  })
}

function getDimensions(image: AssetRow): { width: number; height: number } {
  return {
    width: image.width ?? 1920,
    height: image.height ?? 1080,
  }
}

function ResponsivePicture({
  image,
  responsiveImages,
  alt,
  loadingAttrs,
  sizes,
}: {
  image: AssetRow
  responsiveImages: ResponsiveImageMap
  alt: string
  loadingAttrs: { loading: ImageLoading; fetchPriority?: 'high' }
  sizes: string
}) {
  const { props: fallbackProps } = getImageProps({
    src: image.cdnUrl,
    alt,
    ...getDimensions(image),
    className: styles.img,
    loading: loadingAttrs.loading,
    fetchPriority: loadingAttrs.fetchPriority,
    sizes,
  })

  return (
    <figure className={styles.wrap}>
      <picture>
        {viewportSources.map(({ viewport, media }) => {
          const sourceImage = responsiveImages[viewport]
          if (!sourceImage?.cdnUrl || sourceImage.cdnUrl === image.cdnUrl) {
            return null
          }
          const { props } = getImageProps({
            src: sourceImage.cdnUrl,
            alt,
            ...getDimensions(sourceImage),
            className: styles.img,
            loading: 'lazy',
            sizes,
          })
          return (
            <source
              key={viewport}
              media={media}
              srcSet={props.srcSet}
              sizes={props.sizes}
            />
          )
        })}
        <img {...fallbackProps} alt={alt} />
      </picture>
    </figure>
  )
}

export function Image({
  image,
  alt,
  loading,
  fetchPriority,
  sizes = '100vw',
  editable,
}: {
  image: ImageValue
  alt?: string
  loading?: ImageLoading | string
  fetchPriority?: ImageFetchPriority | string
  sizes?: string
  editable?: boolean
  locale?: string
}) {
  const fallbackImage = getFallbackImage(image)
  if (!fallbackImage) {
    if (editable) {
      return <EmptyAssetPlaceholder kind="image" />
    }
    return null
  }
  const loadingAttrs = resolveLoadingAttrs({ loading, fetchPriority })
  const responsiveImages = getResponsiveImages(image)
  if (hasViewportImage(responsiveImages, fallbackImage)) {
    return (
      <ResponsivePicture
        image={fallbackImage}
        responsiveImages={responsiveImages}
        alt={alt ?? ''}
        loadingAttrs={loadingAttrs}
        sizes={sizes}
      />
    )
  }
  if (fallbackImage.width == null || fallbackImage.height == null) {
    return (
      <figure className={styles.wrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fallbackImage.cdnUrl}
          alt={alt ?? ''}
          className={styles.img}
          loading={loadingAttrs.loading}
          fetchPriority={loadingAttrs.fetchPriority}
        />
      </figure>
    )
  }
  return (
    <figure className={styles.wrap}>
      <NextImage
        src={fallbackImage.cdnUrl}
        alt={alt ?? ''}
        width={fallbackImage.width}
        height={fallbackImage.height}
        className={styles.img}
        loading={loadingAttrs.loading}
        fetchPriority={loadingAttrs.fetchPriority}
        sizes={sizes}
      />
    </figure>
  )
}
