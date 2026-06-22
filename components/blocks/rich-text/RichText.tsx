import type { CSSProperties } from 'react'
import { SafeHtml } from '../../SafeHtml'
import {
  resolveTextColor as resolveSharedTextColor,
} from '../text-colors'
import { isBlockWidth } from '../block-widths'
import { toResponsiveCssVars } from '@weftly/runtime/lib/responsive-settings'
import styles from './RichText.module.scss'
import { richTextSchema, richTextSizes } from './rich-text.schema'

type RichTextStyle = CSSProperties & {
  '--pt-rich-text-color': string
}

type RichTextSize = (typeof richTextSizes)[number]

function isRichTextSize(value: string | undefined): value is RichTextSize {
  return richTextSizes.includes(value as RichTextSize)
}

function resolveRichTextColor(color: string | undefined): {
  key: string
  style: RichTextStyle
} {
  const textColor = resolveSharedTextColor(color, 'dark-gray')

  return {
    key: textColor.key,
    style: { '--pt-rich-text-color': textColor.value },
  }
}

export function RichText({
  content,
  color,
  size,
  width,
}: {
  content?: string
  color?: string
  size?: string
  width?: string | Record<string, unknown>
}) {
  if (!content) return null

  const textColor = resolveRichTextColor(color)
  const resolvedSize = isRichTextSize(size) ? size : 'm'
  const widthStyle = toResponsiveCssVars(
    'pt-block-max-width',
    width,
    richTextSchema.settings.width,
    (value) =>
      typeof value === 'string' && isBlockWidth(value) ? `${value}%` : undefined,
  )

  return (
    <SafeHtml
      className={styles.richText}
      html={content}
      data-color={textColor.key}
      data-size={resolvedSize}
      style={{ ...textColor.style, ...widthStyle }}
    />
  )
}
