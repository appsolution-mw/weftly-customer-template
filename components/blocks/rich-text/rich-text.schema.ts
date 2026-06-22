import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'
import { textColorKeys } from '../text-colors'
import { headlineSizes } from '../headline/headline.schema'
import {
  blockWidths,
  blockWidthOptionLabels,
} from '../block-widths'

export const richTextColors = textColorKeys
export const richTextSizes = headlineSizes

export const richTextSchema = defineComponentSchema({
  key: 'richText',
  name: 'Rich Text',
  group: 'content',
  icon: 'Pilcrow',
  order: 20,
  category: 'leaf',
  allowedChildren: [],
  settings: {
    content: {
      type: 'richtext',
      label: 'Inhalt',
      translatable: true,
    },
    color: {
      type: 'select',
      label: 'Textfarbe',
      options: [...richTextColors],
      default: 'dark-gray',
    },
    size: {
      type: 'select',
      label: 'Größe',
      options: [...richTextSizes],
      default: 'm',
    },
    width: {
      type: 'select',
      label: 'Breite',
      options: [...blockWidths],
      optionLabels: blockWidthOptionLabels,
      default: '100',
      responsive: true,
    },
  },
})
