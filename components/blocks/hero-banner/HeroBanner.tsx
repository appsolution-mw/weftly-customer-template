import { getImageProps } from 'next/image'
import type { CSSProperties } from 'react'
import type { AssetRow } from '@weftly/runtime/lib/asset-lookup'
import type { RenderLinkResult } from '@weftly/runtime/lib/render-link'
import { Button } from '../button/Button'
import { Container } from '../container/Container'
import { Headline } from '../headline/Headline'
import { Image as BlockImage } from '../image/Image'
import { RichText } from '../rich-text/RichText'
import { EmptyAssetPlaceholder } from '../_shared/EmptyAssetPlaceholder'
import { sanitizeRichText } from '@weftly/runtime/lib/sanitize'
import {
  heroBannerContentWidths,
  heroBannerPositions,
} from './hero-banner.schema'
import styles from './HeroBanner.module.scss'

type HeroBannerPosition = (typeof heroBannerPositions)[number]
type HeroBannerContentWidth = (typeof heroBannerContentWidths)[number]

type HeroBannerStyle = CSSProperties & {
  '--pt-hero-banner-aspect-ratio'?: string
  '--pt-hero-banner-height'?: string
  '--pt-hero-banner-mobile-aspect-ratio'?: string
}

function isHeroBannerPosition(
  value: string | undefined,
): value is HeroBannerPosition {
  return heroBannerPositions.includes(value as HeroBannerPosition)
}

function isHeroBannerContentWidth(
  value: string | undefined,
): value is HeroBannerContentWidth {
  return heroBannerContentWidths.includes(value as HeroBannerContentWidth)
}

function getImageSizing(
  image: AssetRow | null | undefined,
): Pick<
  HeroBannerStyle,
  '--pt-hero-banner-aspect-ratio' | '--pt-hero-banner-height'
> {
  if (!image?.width || !image.height) return {}
  return {
    '--pt-hero-banner-aspect-ratio': `${image.width} / ${image.height}`,
    '--pt-hero-banner-height': `${(image.height / image.width) * 100}vw`,
  }
}

function getMobileAspectRatio(
  image: AssetRow | null | undefined,
): Pick<HeroBannerStyle, '--pt-hero-banner-mobile-aspect-ratio'> {
  if (!image?.width || !image.height) return {}
  return {
    '--pt-hero-banner-mobile-aspect-ratio': `${image.width} / ${image.height}`,
  }
}

function getImageDimensions(image: AssetRow): { width: number; height: number } {
  return {
    width: image.width ?? 1920,
    height: image.height ?? 1080,
  }
}

function hasVisiblePlainText(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

function hasVisibleRichText(value: string | undefined): boolean {
  if (!value) return false
  const text = sanitizeRichText(value)
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;|&#160;|\u00a0/g, '')
    .trim()

  return text.length > 0
}

function BackgroundPicture({
  image,
  mobileImage,
  alt,
}: {
  image: AssetRow
  mobileImage?: AssetRow | null
  alt: string
}) {
  const desktopDimensions = getImageDimensions(image)
  const { props: desktopProps } = getImageProps({
    src: image.cdnUrl,
    alt,
    ...desktopDimensions,
    sizes: '100vw',
    loading: 'eager',
    fetchPriority: 'high',
    className: styles.backgroundImage,
  })
  const shouldRenderMobileSource =
    mobileImage !== null &&
    mobileImage !== undefined &&
    mobileImage.cdnUrl !== image.cdnUrl
  const mobileProps = shouldRenderMobileSource
    ? getImageProps({
        src: mobileImage.cdnUrl,
        alt,
        ...getImageDimensions(mobileImage),
        sizes: '100vw',
        loading: 'lazy',
        className: styles.backgroundImage,
      }).props
    : null

  return (
    <picture className={styles.picture}>
      {mobileProps ? (
        <source media="(max-width: 767px)" srcSet={mobileProps.srcSet} />
      ) : null}
      <img {...desktopProps} alt={alt} />
    </picture>
  )
}

export function HeroBanner({
  backgroundImage,
  mobileBackgroundImage,
  backgroundAlt,
  contentPosition,
  contentWidth,
  contentImage,
  contentImageAlt,
  headline,
  headlineLevel,
  headlineSize,
  headlineWidth,
  headlineColor,
  headlineWithBar,
  text,
  textColor,
  buttonLabel,
  buttonHref,
  buttonVariant,
  buttonColor,
  buttonSize,
  buttonTransparentBackground,
  editable,
}: {
  backgroundImage?: AssetRow | null
  mobileBackgroundImage?: AssetRow | null
  backgroundAlt?: string
  contentPosition?: string
  contentWidth?: string
  contentImage?: AssetRow | null
  contentImageAlt?: string
  headline?: string
  headlineLevel?: string
  headlineSize?: string | Record<string, unknown>
  headlineWidth?: string | Record<string, unknown>
  headlineColor?: string
  headlineWithBar?: boolean
  text?: string
  textColor?: string
  buttonLabel?: string
  buttonHref?: RenderLinkResult
  buttonVariant?: string
  buttonColor?: string
  buttonSize?: string | Record<string, unknown>
  buttonTransparentBackground?: boolean
  editable?: boolean
}) {
  const resolvedPosition = isHeroBannerPosition(contentPosition)
    ? contentPosition
    : 'center-center'
  const resolvedContentWidth = isHeroBannerContentWidth(contentWidth)
    ? contentWidth
    : 'boxed'
  const primaryImage = backgroundImage ?? mobileBackgroundImage
  const style: HeroBannerStyle = {}
  Object.assign(
    style,
    getImageSizing(primaryImage),
    getMobileAspectRatio(mobileBackgroundImage ?? primaryImage),
  )
  const hasHeadline = hasVisiblePlainText(headline)
  const hasText = hasVisibleRichText(text)
  const hasButton = hasVisiblePlainText(buttonLabel)
  const content = (
    <div className={styles.contentPanel}>
      {contentImage ? (
        <div className={styles.contentImage}>
          <BlockImage
            image={contentImage}
            alt={contentImageAlt ?? ''}
            sizes="(max-width: 767px) 40vw, 18vw"
          />
        </div>
      ) : null}
      {hasHeadline ? (
        <Headline
          text={headline}
          level={headlineLevel}
          size={headlineSize}
          width={headlineWidth}
          color={headlineColor}
          withBar={headlineWithBar}
        />
      ) : null}
      {hasText ? <RichText content={text} color={textColor} /> : null}
      {hasButton ? (
        <Button
          label={buttonLabel}
          href={buttonHref}
          variant={buttonVariant}
          color={buttonColor}
          size={buttonSize}
          transparentBackground={buttonTransparentBackground}
        />
      ) : null}
    </div>
  )

  return (
    <section
      className={styles.heroBanner}
      data-content-position={resolvedPosition}
      data-content-width={resolvedContentWidth}
      style={Object.keys(style).length > 0 ? style : undefined}
    >
      <div className={styles.media}>
        {primaryImage ? (
          <BackgroundPicture
            image={primaryImage}
            mobileImage={backgroundImage ? mobileBackgroundImage : null}
            alt={backgroundAlt ?? ''}
          />
        ) : editable ? (
          <div className={styles.placeholder}>
            <EmptyAssetPlaceholder kind="image" />
          </div>
        ) : null}
      </div>
      <Container
        className={styles.contentLayer}
        contentWidth={resolvedContentWidth}
      >
        {content}
      </Container>
    </section>
  )
}
