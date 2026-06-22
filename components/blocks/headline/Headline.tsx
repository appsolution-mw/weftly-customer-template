import { createElement, type CSSProperties, type ReactNode } from 'react'
import { toResponsiveCssVars } from '@weftly/runtime/lib/responsive-settings'
import {
  resolveTextColor,
  type TextColor,
} from '../text-colors'
import { isBlockWidth } from '../block-widths'
import styles from './Headline.module.scss'
import { headlineSchema, headlineSizes } from './headline.schema'

const LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
type Level = (typeof LEVELS)[number]
type HeadlineSize = (typeof headlineSizes)[number]

const SIZE_BY_LEVEL: Record<Level, string> = {
  h1: 'xxl',
  h2: 'xl',
  h3: 'l',
  h4: 'm',
  h5: 's',
  h6: 'xs',
}

const HEADLINE_FONT_SIZE_BY_SIZE: Record<HeadlineSize, string> = {
  xs: 'clamp(var(--pt-headline-size-xs-min), var(--pt-headline-size-xs-fluid), var(--pt-headline-size-xs-max))',
  s: 'clamp(var(--pt-headline-size-s-min), var(--pt-headline-size-s-fluid), var(--pt-headline-size-s-max))',
  m: 'clamp(var(--pt-headline-size-m-min), var(--pt-headline-size-m-fluid), var(--pt-headline-size-m-max))',
  l: 'clamp(var(--pt-headline-size-l-min), var(--pt-headline-size-l-fluid), var(--pt-headline-size-l-max))',
  xl: 'clamp(var(--pt-headline-size-xl-min), var(--pt-headline-size-xl-fluid), var(--pt-headline-size-xl-max))',
  xxl: 'clamp(var(--pt-headline-size-xxl-min), var(--pt-headline-size-xxl-fluid), var(--pt-headline-size-xxl-max))',
}

const BREAK_CONTROL_TOKENS: Record<string, string> = {
  '[shy]': '­',
  '[zwsp]': '​',
}

function isHeadlineSize(value: string | undefined): value is HeadlineSize {
  return headlineSizes.includes(value as HeadlineSize)
}

function applyBreakControlTokens(text: string): string {
  return Object.entries(BREAK_CONTROL_TOKENS).reduce(
    (value, [token, character]) => value.replaceAll(token, character),
    text,
  )
}

function renderMultilineText(text: unknown): ReactNode[] {
  // Defense-in-depth: a binding whose context evaluates to a non-string
  // (e.g. unresolved locale-map, null, raw item-id) must not crash the
  // renderer. Coerce to string; empty input renders nothing.
  const safe = typeof text === 'string' ? text : ''
  if (!safe) return []
  return applyBreakControlTokens(safe).split(/\r?\n/).flatMap((line, index) =>
    index === 0 ? [line] : [createElement('br', { key: index }), line],
  )
}

function resolveHeadlineColor(color: string | undefined): {
  key: TextColor
  style: CSSProperties & {
    '--pt-action-color': string
  }
} {
  const textColor = resolveTextColor(color, 'sylver')

  return {
    key: textColor.key,
    style: { '--pt-action-color': textColor.value },
  }
}

export function Headline({
  text,
  level,
  size,
  color,
  width,
  withBar = false,
}: {
  text?: string
  level?: string
  size?: string | Record<string, unknown>
  color?: string
  width?: string | Record<string, unknown>
  withBar?: boolean
}) {
  const tag: Level = LEVELS.includes(level as Level) ? (level as Level) : 'h2'
  const flatSize = typeof size === 'string' ? size : undefined
  const resolvedSize = isHeadlineSize(flatSize) ? flatSize : SIZE_BY_LEVEL[tag]
  const resolvedColor = resolveHeadlineColor(color)
  const className = withBar
    ? `${styles.headline} ${styles.withBar}`
    : styles.headline
  const responsiveSizeStyle = toResponsiveCssVars(
    'pt-headline-font-size',
    size,
    headlineSchema.settings.size,
    (value) =>
      typeof value === 'string' && isHeadlineSize(value)
        ? HEADLINE_FONT_SIZE_BY_SIZE[value]
        : undefined,
  )
  const widthStyle = toResponsiveCssVars(
    'pt-block-max-width',
    width,
    headlineSchema.settings.width,
    (value) =>
      typeof value === 'string' && isBlockWidth(value) ? `${value}%` : undefined,
  )
  const style: CSSProperties = {
    ...resolvedColor.style,
    ...responsiveSizeStyle,
    ...widthStyle,
  }

  return createElement(
    tag,
    {
      className,
      'data-size': resolvedSize,
      'data-color': resolvedColor.key,
      style,
    },
    createElement('span', { className: styles.text }, renderMultilineText(text ?? '')),
  )
}
