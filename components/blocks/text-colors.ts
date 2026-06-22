import { brandColorKeys, isBrandColor } from './brand-colors'
import { brandCssVarName } from '@weftly/runtime/lib/theme-tokens'

export const neutralTextColors = {
  'dark-gray': 'var(--pt-color-dark-gray)',
  white: 'var(--pt-color-white)',
  black: 'var(--pt-color-off-black)',
} as const

export type NeutralTextColor = keyof typeof neutralTextColors

export const neutralTextColorKeys = Object.keys(
  neutralTextColors,
) as Array<NeutralTextColor>

export function isNeutralTextColor(
  value: string | undefined,
): value is NeutralTextColor {
  return Boolean(value && value in neutralTextColors)
}

/**
 * Action-style tokens for the three neutral colors. Mirrors `brandColors`'
 * { hex, rgb, contrast } shape so Button (and any future action element)
 * can render `--pt-action-color/--pt-action-rgb/--pt-action-contrast` for
 * neutral-coloured variants — same hover/focus mechanics as brand-coloured
 * buttons, just with neutral palette tokens.
 *
 * The `hex` values are intentionally raw `#...` strings (not `var(...)`)
 * because they feed into both colour mixing (rgba hover shadow) and the
 * `--pt-action-rgb` decomposition; the public CSS variables in
 * `styles/globals.scss` use the same hexes, so the two stay in sync.
 */
export const neutralActionColors: Record<
  NeutralTextColor,
  { hex: string; rgb: string; contrast: string }
> = {
  'dark-gray': { hex: '#616161', rgb: '97, 97, 97', contrast: '#ffffff' },
  white: { hex: '#ffffff', rgb: '255, 255, 255', contrast: '#1e2328' },
  black: { hex: '#1e2328', rgb: '30, 35, 40', contrast: '#ffffff' },
}

export const textColorKeys = [
  ...neutralTextColorKeys,
  ...brandColorKeys,
] as const

export type TextColor = (typeof textColorKeys)[number]

export function resolveTextColor(
  value: string | undefined,
  fallback: TextColor,
): { key: TextColor; value: string } {
  if (isNeutralTextColor(value)) {
    return {
      key: value,
      value: neutralTextColors[value],
    }
  }

  if (isBrandColor(value)) {
    return {
      key: value,
      value: `var(--pt-color-${brandCssVarName[value]})`,
    }
  }

  return resolveTextColor(fallback, 'dark-gray')
}
