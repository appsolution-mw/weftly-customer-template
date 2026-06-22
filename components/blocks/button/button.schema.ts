import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'
import { textColorKeys } from '../text-colors'

export const buttonVariants = ['outline', 'filled'] as const
// Neutral (dark-gray/white/black) + brand. Same palette as Headline/RichText.
export const buttonColors = textColorKeys
export const buttonSizes = ['sm', 'md', 'lg'] as const

export const buttonSchema = defineComponentSchema({
  key: 'button',
  name: 'Button',
  group: 'actions',
  icon: 'MousePointerClick',
  order: 10,
  category: 'leaf',
  allowedChildren: [],
  settings: {
    label: { type: 'text', label: 'Beschriftung', translatable: true, default: 'Button' },
    href: { type: 'link', label: 'Link' },
    variant: {
      type: 'select',
      label: 'Stil',
      options: [...buttonVariants],
      default: 'filled',
    },
    color: {
      type: 'select',
      label: 'Farbe',
      options: [...buttonColors],
      default: 'black',
    },
    size: {
      type: 'select',
      label: 'Größe',
      options: [...buttonSizes],
      default: 'md',
      responsive: true,
    },
    transparentBackground: {
      type: 'boolean',
      label: 'Transparenter Hintergrund',
      default: false,
    },
  },
})
