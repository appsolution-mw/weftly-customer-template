import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Image as ImageBlock } from '../image/Image'
import {
  isResponsiveValueMap,
  responsiveViewports,
  toResponsiveCssVars,
} from '@weftly/runtime/lib/responsive-settings'
import styles from './Grid.module.scss'
import { gridGaps, gridSchema } from './grid.schema'

type GridGap = (typeof gridGaps)[number]
type ImageBlockProps = ComponentProps<typeof ImageBlock>

const MIN_COLUMNS = 1
const MAX_COLUMNS = 12
const DEFAULT_COLUMNS = 3
const DEFAULT_GAP: GridGap = 'medium'
const gridImageSizeBreakpoints = [
  ['mobile-portrait', '375px'],
  ['mobile-landscape', '767px'],
  ['tablet-portrait', '768px'],
  ['tablet-landscape', '1024px'],
] as const

const gapValue: Record<GridGap, string> = {
  none: '0',
  small: '1rem',
  medium: '1.5rem',
  large: '2.5rem',
}

function toColumn(value: unknown): number | undefined {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value.trim())
        : Number.NaN

  if (!Number.isFinite(parsed)) {
    return undefined
  }

  return Math.min(MAX_COLUMNS, Math.max(MIN_COLUMNS, Math.round(parsed)))
}

function isGridGap(value: string | undefined): value is GridGap {
  return gridGaps.includes(value as GridGap)
}

function toColumnCssVars(raw: unknown): CSSProperties {
  const values = isResponsiveValueMap(raw) ? raw : { desktop: raw }
  const vars: Record<string, string> = {}

  for (const viewport of responsiveViewports) {
    const columns = toColumn(values[viewport])
    if (columns !== undefined) {
      vars[`--pt-grid-columns-${viewport}`] = String(columns)
    }
  }

  return vars as CSSProperties
}

function resolveDataColumns(raw: unknown): number {
  if (isResponsiveValueMap(raw)) {
    return toColumn(raw.desktop) ?? DEFAULT_COLUMNS
  }

  return toColumn(raw) ?? DEFAULT_COLUMNS
}

function getGridImageSizesValue(raw: unknown): string {
  const values = isResponsiveValueMap(raw) ? raw : { desktop: raw }
  const resolvedColumns: Record<string, number> = {}
  let currentColumns = toColumn(values.desktop) ?? DEFAULT_COLUMNS

  resolvedColumns.desktop = currentColumns
  for (const viewport of responsiveViewports.slice(1)) {
    currentColumns = toColumn(values[viewport]) ?? currentColumns
    resolvedColumns[viewport] = currentColumns
  }

  return [
    ...gridImageSizeBreakpoints.map(
      ([viewport, maxWidth]) =>
        `(max-width: ${maxWidth}) ${toImageSize(resolvedColumns[viewport])}`,
    ),
    toImageSize(resolvedColumns.desktop),
  ].join(', ')
}

function toImageSize(columns: number): string {
  const width = 100 / columns
  return `${Number.isInteger(width) ? width : Number(width.toFixed(4))}vw`
}

function withGridImageSizes(child: ReactNode, sizes: string): ReactNode {
  if (!isValidElement<ImageBlockProps>(child)) return child
  if (child.type !== ImageBlock) return child

  return cloneElement(child, {
    sizes: child.props.sizes ?? sizes,
  })
}

export function Grid({
  columns,
  gap,
  children,
}: {
  columns?: number | string | Record<string, unknown>
  gap?: string | Record<string, unknown>
  children?: ReactNode
}) {
  const flatGap = typeof gap === 'string' ? gap : undefined
  const resolvedColumns = resolveDataColumns(columns)
  const resolvedGap = isGridGap(flatGap) ? flatGap : DEFAULT_GAP
  const columnStyle = toColumnCssVars(columns)
  const imageSizes = getGridImageSizesValue(columns)
  const gapStyle = toResponsiveCssVars(
    'pt-grid-gap',
    gap,
    gridSchema.settings.gap,
    (value) =>
      typeof value === 'string' && isGridGap(value)
        ? gapValue[value]
        : undefined,
  )
  const style: CSSProperties | undefined =
    Object.keys(columnStyle).length > 0 || Object.keys(gapStyle).length > 0
      ? { ...columnStyle, ...gapStyle }
      : undefined

  return (
    <div
      className={styles.grid}
      data-columns={resolvedColumns}
      data-gap={resolvedGap}
      style={style}
    >
      {Children.map(children, (child) => withGridImageSizes(child, imageSizes))}
    </div>
  )
}
