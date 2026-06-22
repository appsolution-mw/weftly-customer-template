import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentProps,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import {
  getBrandBackgroundStyle,
  isBrandColor,
} from '../brand-colors'
import { Image as ImageBlock } from '../image/Image'
import { toResponsiveCssVars } from '@weftly/runtime/lib/responsive-settings'
import styles from './Card.module.scss'
import {
  cardBackgrounds,
  cardColumnOrders,
  cardContentAlignments,
  cardImageWidths,
  cardLayouts,
  cardMinHeights,
  cardSchema,
  cardShadows,
  cardSpacings,
} from './card.schema'

type CardLayout = (typeof cardLayouts)[number]
type CardColumnOrder = (typeof cardColumnOrders)[number]
type CardBackground = (typeof cardBackgrounds)[number]
type CardShadow = (typeof cardShadows)[number]
type CardContentAlignment = (typeof cardContentAlignments)[number]
type CardSpacing = (typeof cardSpacings)[number]
type CardImageWidth = (typeof cardImageWidths)[number]
type CardMinHeight = (typeof cardMinHeights)[number]
type ImageBlockProps = ComponentProps<typeof ImageBlock>

const backgroundClass: Record<string, string> = {
  white: styles.bgWhite,
  'light-grey': styles.bgLightGrey,
}

const spacingValue: Record<CardSpacing, string> = {
  none: '0',
  small: '0.75rem',
  medium: '1.25rem',
  large: '2rem',
}

const imagePaddingValue: Record<CardSpacing, string> = {
  none: '0',
  small: 'clamp(0.5rem, 1.5vw, 0.75rem)',
  medium: 'clamp(0.75rem, 2vw, 1.25rem)',
  large: 'clamp(1rem, 3vw, 2rem)',
}

const contentPaddingValue: Record<CardSpacing, string> = {
  none: '0',
  small: 'clamp(0.75rem, 2vw, 1rem)',
  medium: 'clamp(1rem, 3vw, 1.5rem)',
  large: 'clamp(1.25rem, 4vw, 2rem)',
}

const imageWidthValue: Record<CardImageWidth, string> = {
  '40-60': 'minmax(0, 40%) minmax(0, 60%)',
  '50-50': 'repeat(2, minmax(0, 1fr))',
  '60-40': 'minmax(0, 60%) minmax(0, 40%)',
}

const gridTemplateAreasValue: Record<
  CardColumnOrder,
  Record<CardLayout, string>
> = {
  'image-content': {
    vertical: '"image" "content"',
    horizontal: '"image content"',
  },
  'content-image': {
    vertical: '"content" "image"',
    horizontal: '"content image"',
  },
}

const contentAlignmentValue: Record<
  CardContentAlignment,
  {
    justifyItems: string
    textAlign: string
    alignItems: string
    alignContent: string
  }
> = {
  'top-left': {
    justifyItems: 'start',
    textAlign: 'left',
    alignItems: 'flex-start',
    alignContent: 'start',
  },
  'top-center': {
    justifyItems: 'center',
    textAlign: 'center',
    alignItems: 'flex-start',
    alignContent: 'start',
  },
  'top-right': {
    justifyItems: 'end',
    textAlign: 'right',
    alignItems: 'flex-start',
    alignContent: 'start',
  },
  'center-left': {
    justifyItems: 'start',
    textAlign: 'left',
    alignItems: 'center',
    alignContent: 'center',
  },
  'center-center': {
    justifyItems: 'center',
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  'center-right': {
    justifyItems: 'end',
    textAlign: 'right',
    alignItems: 'center',
    alignContent: 'center',
  },
  'bottom-left': {
    justifyItems: 'start',
    textAlign: 'left',
    alignItems: 'flex-end',
    alignContent: 'end',
  },
  'bottom-center': {
    justifyItems: 'center',
    textAlign: 'center',
    alignItems: 'flex-end',
    alignContent: 'end',
  },
  'bottom-right': {
    justifyItems: 'end',
    textAlign: 'right',
    alignItems: 'flex-end',
    alignContent: 'end',
  },
}

const minHeightValue: Record<CardMinHeight, string> = {
  auto: 'auto',
  small: '18rem',
  medium: '24rem',
  large: '32rem',
}

type CardChildProps = {
  'data-node-key'?: unknown
}

function isImageChild(child: ReactNode): child is ReactElement<CardChildProps> {
  if (!isValidElement<CardChildProps>(child)) return false
  if (child.type === ImageBlock) return true
  return child.props['data-node-key'] === 'image'
}

function partitionChildren(children: ReactNode): {
  imageChildren: ReactNode[]
  contentChildren: ReactNode[]
} {
  const imageChildren: ReactNode[] = []
  const contentChildren: ReactNode[] = []

  Children.forEach(children, (child) => {
    if (isImageChild(child)) {
      imageChildren.push(child)
    } else {
      contentChildren.push(child)
    }
  })

  return { imageChildren, contentChildren }
}

function isCardLayout(value: string | undefined): value is CardLayout {
  return cardLayouts.includes(value as CardLayout)
}

function isCardColumnOrder(value: string | undefined): value is CardColumnOrder {
  return cardColumnOrders.includes(value as CardColumnOrder)
}

function isCardBackground(value: string | undefined): value is CardBackground {
  return cardBackgrounds.includes(value as CardBackground)
}

function isCardShadow(value: string | undefined): value is CardShadow {
  return cardShadows.includes(value as CardShadow)
}

function isCardContentAlignment(
  value: string | undefined,
): value is CardContentAlignment {
  return cardContentAlignments.includes(value as CardContentAlignment)
}

function isCardSpacing(value: string | undefined): value is CardSpacing {
  return cardSpacings.includes(value as CardSpacing)
}

function isCardImageWidth(value: string | undefined): value is CardImageWidth {
  return cardImageWidths.includes(value as CardImageWidth)
}

function isCardMinHeight(value: string | undefined): value is CardMinHeight {
  return cardMinHeights.includes(value as CardMinHeight)
}

function getFlatValue(raw: string | Record<string, unknown> | undefined): string | undefined {
  if (typeof raw === 'string') return raw
  if (raw && typeof raw.desktop === 'string') return raw.desktop
  return undefined
}

function getImageWidthValue(
  imageWidth: CardImageWidth,
  columnOrder: CardColumnOrder,
): string {
  if (columnOrder !== 'content-image') {
    return imageWidthValue[imageWidth]
  }

  if (imageWidth === '40-60') {
    return imageWidthValue['60-40']
  }

  if (imageWidth === '60-40') {
    return imageWidthValue['40-60']
  }

  return imageWidthValue[imageWidth]
}

function getImageSizesValue(
  layout: CardLayout,
  imageWidth: CardImageWidth,
  columnOrder: CardColumnOrder,
): string {
  if (layout !== 'horizontal') {
    return '100vw'
  }

  if (imageWidth === '50-50') {
    return '(max-width: 767px) 100vw, 50vw'
  }

  const imageShare =
    columnOrder === 'content-image'
      ? imageWidth === '40-60'
        ? '60vw'
        : '40vw'
      : imageWidth === '40-60'
        ? '40vw'
        : '60vw'

  return `(max-width: 767px) 100vw, ${imageShare}`
}

function withCardImageSizes(child: ReactNode, sizes: string): ReactNode {
  if (!isValidElement<ImageBlockProps>(child)) return child
  if (child.type !== ImageBlock) return child

  return cloneElement(child, {
    sizes: child.props.sizes ?? sizes,
  })
}

function getGridTemplateColumnsValue(
  layout: CardLayout,
  hasImage: boolean,
): string {
  if (!hasImage || layout === 'vertical') {
    return 'minmax(0, 1fr)'
  }

  return 'var(--pt-card-image-width)'
}

function getGridTemplateAreasValue(
  layout: CardLayout,
  columnOrder: CardColumnOrder,
  hasImage: boolean,
): string {
  if (!hasImage) {
    return '"content"'
  }

  return gridTemplateAreasValue[columnOrder][layout]
}

export function Card({
  layout,
  columnOrder,
  background,
  shadow,
  contentAlign,
  imagePadding,
  contentPadding,
  gap,
  imageWidth,
  minHeight,
  children,
}: {
  layout?: string | Record<string, unknown>
  columnOrder?: string
  background?: string
  shadow?: string
  contentAlign?: string | Record<string, unknown>
  imagePadding?: string | Record<string, unknown>
  contentPadding?: string | Record<string, unknown>
  gap?: string | Record<string, unknown>
  imageWidth?: string | Record<string, unknown>
  minHeight?: string | Record<string, unknown>
  children?: ReactNode
}) {
  const flatLayout = getFlatValue(layout)
  const flatContentAlign = getFlatValue(contentAlign)
  const flatImagePadding = getFlatValue(imagePadding)
  const flatContentPadding = getFlatValue(contentPadding)
  const flatGap = getFlatValue(gap)
  const flatImageWidth = getFlatValue(imageWidth)
  const flatMinHeight = getFlatValue(minHeight)
  const resolvedLayout = isCardLayout(flatLayout) ? flatLayout : 'vertical'
  const resolvedColumnOrder = isCardColumnOrder(columnOrder)
    ? columnOrder
    : 'image-content'
  const resolvedBackground = isCardBackground(background) ? background : 'white'
  const resolvedShadow = isCardShadow(shadow) ? shadow : 'medium'
  const resolvedContentAlign = isCardContentAlignment(flatContentAlign)
    ? flatContentAlign
    : 'top-left'
  const resolvedImagePadding = isCardSpacing(flatImagePadding)
    ? flatImagePadding
    : 'none'
  const resolvedContentPadding = isCardSpacing(flatContentPadding)
    ? flatContentPadding
    : 'medium'
  const resolvedGap = isCardSpacing(flatGap) ? flatGap : 'medium'
  const resolvedImageWidth = isCardImageWidth(flatImageWidth)
    ? flatImageWidth
    : '50-50'
  const resolvedMinHeight = isCardMinHeight(flatMinHeight)
    ? flatMinHeight
    : 'auto'
  const brandStyle = isBrandColor(resolvedBackground)
    ? getBrandBackgroundStyle(resolvedBackground)
    : undefined
  const { imageChildren, contentChildren } = partitionChildren(children)
  const hasImage = imageChildren.length > 0
  const imageSizes = getImageSizesValue(
    resolvedLayout,
    resolvedImageWidth,
    resolvedColumnOrder,
  )
  const responsiveStyle = {
    ...toResponsiveCssVars(
      'pt-card-grid-template-columns',
      layout,
      cardSchema.settings.layout,
      (value) =>
        typeof value === 'string' && isCardLayout(value)
          ? getGridTemplateColumnsValue(value, hasImage)
          : undefined,
    ),
    ...toResponsiveCssVars(
      'pt-card-grid-template-areas',
      layout,
      cardSchema.settings.layout,
      (value) =>
        typeof value === 'string' && isCardLayout(value)
          ? getGridTemplateAreasValue(value, resolvedColumnOrder, hasImage)
          : undefined,
    ),
    ...toResponsiveCssVars(
      'pt-card-justify-items',
      contentAlign,
      cardSchema.settings.contentAlign,
      (value) =>
        typeof value === 'string' && isCardContentAlignment(value)
          ? contentAlignmentValue[value].justifyItems
          : undefined,
    ),
    ...toResponsiveCssVars(
      'pt-card-text-align',
      contentAlign,
      cardSchema.settings.contentAlign,
      (value) =>
        typeof value === 'string' && isCardContentAlignment(value)
          ? contentAlignmentValue[value].textAlign
          : undefined,
    ),
    ...toResponsiveCssVars(
      'pt-card-align-items',
      contentAlign,
      cardSchema.settings.contentAlign,
      (value) =>
        typeof value === 'string' && isCardContentAlignment(value)
          ? contentAlignmentValue[value].alignItems
          : undefined,
    ),
    ...toResponsiveCssVars(
      'pt-card-align-content',
      contentAlign,
      cardSchema.settings.contentAlign,
      (value) =>
        typeof value === 'string' && isCardContentAlignment(value)
          ? contentAlignmentValue[value].alignContent
          : undefined,
    ),
    ...toResponsiveCssVars(
      'pt-card-image-padding',
      imagePadding,
      cardSchema.settings.imagePadding,
      (value) =>
        typeof value === 'string' && isCardSpacing(value)
          ? imagePaddingValue[value]
          : undefined,
    ),
    ...toResponsiveCssVars(
      'pt-card-content-padding',
      contentPadding,
      cardSchema.settings.contentPadding,
      (value) =>
        typeof value === 'string' && isCardSpacing(value)
          ? contentPaddingValue[value]
          : undefined,
    ),
    ...toResponsiveCssVars(
      'pt-card-gap',
      gap,
      cardSchema.settings.gap,
      (value) =>
        typeof value === 'string' && isCardSpacing(value)
          ? spacingValue[value]
          : undefined,
    ),
    ...toResponsiveCssVars(
      'pt-card-image-width',
      imageWidth,
      cardSchema.settings.imageWidth,
      (value) =>
        typeof value === 'string' && isCardImageWidth(value)
          ? getImageWidthValue(value, resolvedColumnOrder)
          : undefined,
    ),
    ...toResponsiveCssVars(
      'pt-card-min-height',
      minHeight,
      cardSchema.settings.minHeight,
      (value) =>
        typeof value === 'string' && isCardMinHeight(value)
          ? minHeightValue[value]
          : undefined,
    ),
  }
  const style: CSSProperties | undefined =
    brandStyle || Object.keys(responsiveStyle).length > 0
      ? { ...brandStyle, ...responsiveStyle }
      : undefined
  const className = [
    styles.card,
    brandStyle
      ? styles.bgBrand
      : (backgroundClass[resolvedBackground] ?? styles.bgWhite),
  ].join(' ')

  return (
    <article
      className={className}
      data-layout={resolvedLayout}
      data-column-order={resolvedColumnOrder}
      data-shadow={resolvedShadow}
      data-content-align={resolvedContentAlign}
      data-image-padding={resolvedImagePadding}
      data-content-padding={resolvedContentPadding}
      data-gap={resolvedGap}
      data-image-width={resolvedImageWidth}
      data-min-height={resolvedMinHeight}
      data-has-image={hasImage ? 'true' : 'false'}
      style={style}
    >
      <div className={styles.layout}>
        {hasImage ? (
          <div className={styles.imageSlot} data-card-slot="image">
            {imageChildren.map((child) =>
              withCardImageSizes(child, imageSizes),
            )}
          </div>
        ) : null}
        <div className={styles.contentSlot} data-card-slot="content">
          {contentChildren}
        </div>
      </div>
    </article>
  )
}
