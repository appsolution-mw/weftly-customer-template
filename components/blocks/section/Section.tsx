import NextImage from 'next/image'
import type { CSSProperties, ReactNode } from 'react'
import type { AssetRow } from '@weftly/runtime/lib/asset-lookup'
import {
  getBrandBackgroundStyle,
  isBrandColor,
} from '../brand-colors'
import { toResponsiveCssVars } from '@weftly/runtime/lib/responsive-settings'
import styles from './Section.module.scss'
import {
  sectionImageFits,
  sectionImagePositions,
  sectionSchema,
} from './section.schema'

const spacingValue: Record<string, string> = {
  small: '1.5rem 1rem',
  medium: '3rem 1rem',
  large: '5rem 1rem',
}

const spacingClass: Record<string, string> = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
}

const backgroundClass: Record<string, string> = {
  white: styles.bgWhite,
  'light-grey': styles.bgLightGrey,
}

type SectionImageFit = (typeof sectionImageFits)[number]
type SectionImagePosition = (typeof sectionImagePositions)[number]

function isSectionImageFit(value: string | undefined): value is SectionImageFit {
  return sectionImageFits.includes(value as SectionImageFit)
}

function isSectionImagePosition(
  value: string | undefined,
): value is SectionImagePosition {
  return sectionImagePositions.includes(value as SectionImagePosition)
}

export function Section({
  spacing,
  background,
  backgroundImage,
  imageFit,
  imagePosition,
  anchor,
  children,
}: {
  spacing?: string | Record<string, unknown>
  background?: string
  backgroundImage?: AssetRow | null
  imageFit?: string
  imagePosition?: string
  anchor?: string
  children?: ReactNode
}) {
  const resolvedBackground = background ?? 'white'
  const brandStyle = isBrandColor(resolvedBackground)
    ? getBrandBackgroundStyle(resolvedBackground)
    : undefined
  const flatSpacing = typeof spacing === 'string' ? spacing : undefined
  const spacingStyle = toResponsiveCssVars(
    'pt-section-spacing',
    spacing,
    sectionSchema.settings.spacing,
    (value) => (typeof value === 'string' ? spacingValue[value] : undefined),
  )
  const className = [
    styles.section,
    spacingClass[flatSpacing ?? 'medium'] ?? styles.medium,
    brandStyle
      ? styles.bgBrand
      : (backgroundClass[resolvedBackground] ?? styles.bgWhite),
  ].join(' ')
  const style: CSSProperties | undefined =
    brandStyle || Object.keys(spacingStyle).length > 0
      ? { ...brandStyle, ...spacingStyle }
      : undefined
  const resolvedFit = isSectionImageFit(imageFit) ? imageFit : 'cover'
  const resolvedPosition = isSectionImagePosition(imagePosition)
    ? imagePosition
    : 'center'
  const imageStyle: CSSProperties = {
    objectFit: resolvedFit,
    objectPosition: resolvedPosition,
  }

  return (
    <section className={className} id={anchor || undefined} style={style}>
      {backgroundImage?.cdnUrl ? (
        <>
          <div className={styles.backgroundImage} aria-hidden="true">
            {backgroundImage.width != null && backgroundImage.height != null ? (
              <NextImage
                src={backgroundImage.cdnUrl}
                alt=""
                fill
                sizes="100vw"
                className={styles.backgroundMedia}
                style={imageStyle}
              />
            ) : (
              // next/image requires dimensions; SVGs and unknown-size assets
              // stay as normal images while still being real DOM media.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={backgroundImage.cdnUrl}
                alt=""
                className={styles.backgroundMedia}
                style={imageStyle}
              />
            )}
          </div>
          <div className={styles.content}>{children}</div>
        </>
      ) : (
        children
      )}
    </section>
  )
}
