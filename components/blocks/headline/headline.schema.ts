import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'
import { textColorKeys } from '../text-colors'
import {
  blockWidths,
  blockWidthOptionLabels,
} from '../block-widths'

export const headlineSizes = ['xs', 's', 'm', 'l', 'xl', 'xxl'] as const
export const headlineColors = textColorKeys

export const headlineSchema = defineComponentSchema({
  key: 'headline',
  name: 'Headline',
  group: 'content',
  icon: 'Heading1',
  order: 10,
  category: 'leaf',
  allowedChildren: [],
  settings: {
    text: {
      type: 'text',
      label: 'Text',
      translatable: true,
      default: 'Neue Überschrift',
      multiline: true,
    },
    level: {
      type: 'select',
      label: 'Ebene',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      default: 'h2',
    },
    size: {
      type: 'select',
      label: 'Größe',
      options: [...headlineSizes],
      default: 'xl',
      responsive: true,
    },
    color: {
      type: 'select',
      label: 'Farbe',
      options: [...headlineColors],
      default: 'sylver',
    },
    width: {
      type: 'select',
      label: 'Breite',
      options: [...blockWidths],
      optionLabels: blockWidthOptionLabels,
      default: '100',
      responsive: true,
    },
    withBar: {
      type: 'boolean',
      label: 'Balken anzeigen',
      default: false,
    },
  },
})
