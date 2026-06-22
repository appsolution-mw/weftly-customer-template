// Shared width option set for content blocks (RichText, Headline, …).
// Persisted as string ('20'/'30'/'50'/'80'/'100'); rendered as `${value}%`
// via toResponsiveCssVars on the CSS variable `--pt-block-max-width`.
export const blockWidths = ['20', '30', '50', '80', '100'] as const
export type BlockWidth = (typeof blockWidths)[number]

export const blockWidthOptionLabels: Record<BlockWidth, string> = {
  '20': '20%',
  '30': '30%',
  '50': '50%',
  '80': '80%',
  '100': '100%',
}

export function isBlockWidth(value: string | undefined): value is BlockWidth {
  return blockWidths.includes(value as BlockWidth)
}
