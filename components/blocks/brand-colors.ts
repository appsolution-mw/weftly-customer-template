import type { CSSProperties } from 'react'
import { brandCssVarName } from '@weftly/runtime/lib/theme-tokens'

export const brandColors = {
  polytan: { hex: '#248739', rgb: '36, 135, 57', contrast: '#ffffff' },
  sylver: { hex: '#8c9091', rgb: '140, 144, 145', contrast: '#ffffff' },
  ligaturf: { hex: '#78d64b', rgb: '120, 214, 75', contrast: '#ffffff' },
  ligagrass: { hex: '#006934', rgb: '0, 105, 52', contrast: '#ffffff' },
  poligras: { hex: '#171c8f', rgb: '23, 28, 143', contrast: '#ffffff' },
  laykold: { hex: '#0191da', rgb: '1, 145, 218', contrast: '#ffffff' },
  rekortan: { hex: '#ba0c2f', rgb: '186, 12, 47', contrast: '#ffffff' },
  polyplay: { hex: '#f78121', rgb: '247, 129, 33', contrast: '#ffffff' },
  greenTechnology: {
    hex: '#52a747',
    rgb: '82, 167, 71',
    contrast: '#ffffff',
  },
  smartOrange: {
    hex: '#ff5c39',
    rgb: '255, 92, 57',
    contrast: '#ffffff',
  },
  smartAnthracite: {
    hex: '#333f48',
    rgb: '51, 63, 72',
    contrast: '#ffffff',
  },
} as const

export const brandColorKeys = Object.keys(brandColors) as Array<BrandColor>

export type BrandColor = keyof typeof brandColors

export type BrandStyle = CSSProperties & {
  '--pt-action-color': string
  '--pt-action-rgb': string
  '--pt-action-contrast': string
}

export type BrandBackgroundStyle = CSSProperties & {
  '--pt-section-bg': string
}

export function isBrandColor(value: string | undefined): value is BrandColor {
  return Boolean(value && value in brandColors)
}

export function getBrandStyle(color: BrandColor): BrandStyle {
  const cssVar = brandCssVarName[color]
  return {
    '--pt-action-color': `var(--pt-color-${cssVar})`,
    '--pt-action-rgb': `var(--pt-color-${cssVar}-rgb)`,
    '--pt-action-contrast': `var(--pt-color-${cssVar}-contrast)`,
  }
}

export function getBrandBackgroundStyle(color: BrandColor): BrandBackgroundStyle {
  return {
    '--pt-section-bg': `var(--pt-color-${brandCssVarName[color]})`,
  }
}
