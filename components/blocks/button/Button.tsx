import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { RenderLinkResult } from '@weftly/runtime/lib/render-link'
import { toResponsiveCssVars } from '@weftly/runtime/lib/responsive-settings'
import {
  type BrandStyle,
  getBrandStyle,
  isBrandColor,
} from '../brand-colors'
import {
  isNeutralTextColor,
  neutralActionColors,
} from '../text-colors'
import styles from './Button.module.scss'
import { buttonSchema, buttonSizes } from './button.schema'

function resolveActionStyle(color: string | undefined): BrandStyle {
  if (isNeutralTextColor(color)) {
    const token = neutralActionColors[color]
    return {
      '--pt-action-color': token.hex,
      '--pt-action-rgb': token.rgb,
      '--pt-action-contrast': token.contrast,
    }
  }
  return getBrandStyle(isBrandColor(color) ? color : 'polytan')
}

const variantClass: Record<string, string> = {
  primary: styles.filled,
  secondary: styles.outline,
  outline: styles.outline,
  filled: styles.filled,
}

type ButtonSize = (typeof buttonSizes)[number]

const BUTTON_PADDING_BY_SIZE: Record<ButtonSize, string> = {
  sm: '0.625rem 1rem',
  md: '0.875rem 1.25rem',
  lg: '1.125rem 2rem',
}

const BUTTON_FONT_SIZE_BY_SIZE: Record<ButtonSize, string> = {
  sm: 'var(--pt-text-sm)',
  md: 'inherit',
  lg: 'var(--pt-text-lg)',
}

function isButtonSize(value: string | undefined): value is ButtonSize {
  return buttonSizes.includes(value as ButtonSize)
}

export function Button({
  label,
  href,
  variant,
  color,
  size,
  transparentBackground,
}: {
  label?: string
  /** Resolved link from resolveNodeProps — always a RenderLinkResult. */
  href?: RenderLinkResult
  variant?: string
  color?: string
  size?: string | Record<string, unknown>
  transparentBackground?: boolean
}) {
  const className = variantClass[variant ?? 'outline'] ?? styles.outline
  const flatSize = typeof size === 'string' ? size : undefined
  const resolvedSize = isButtonSize(flatSize) ? flatSize : 'md'
  const transparentBackgroundValue =
    transparentBackground && className === styles.outline ? 'true' : undefined
  const paddingStyle = toResponsiveCssVars(
    'pt-button-padding',
    size,
    buttonSchema.settings.size,
    (value) =>
      typeof value === 'string' && isButtonSize(value)
        ? BUTTON_PADDING_BY_SIZE[value]
        : undefined,
  )
  const fontSizeStyle = toResponsiveCssVars(
    'pt-button-font-size',
    size,
    buttonSchema.settings.size,
    (value) =>
      typeof value === 'string' && isButtonSize(value)
        ? BUTTON_FONT_SIZE_BY_SIZE[value]
        : undefined,
  )
  const style: CSSProperties = {
    ...resolveActionStyle(color),
    ...paddingStyle,
    ...fontSizeStyle,
  }
  const content = label ?? ''

  // No destination → a real button, not a dead `#` link (a11y, spec §13).
  if (!href || !href.href) {
    return (
      <button
        type="button"
        className={className}
        data-size={resolvedSize}
        data-transparent-background={transparentBackgroundValue}
        style={style}
      >
        {content}
      </button>
    )
  }

  if (href.useNextLink) {
    return (
      <Link
        href={href.href}
        target={href.target}
        rel={href.rel}
        className={className}
        data-size={resolvedSize}
        data-transparent-background={transparentBackgroundValue}
        style={style}
      >
        {content}
      </Link>
    )
  }

  return (
    <a
      href={href.href}
      target={href.target}
      rel={href.rel}
      download={href.download ? '' : undefined}
      className={className}
      data-size={resolvedSize}
      data-transparent-background={transparentBackgroundValue}
      style={style}
    >
      {content}
    </a>
  )
}
