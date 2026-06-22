import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'
import { sectionBackgrounds } from '../section/section.schema'
import { collectionRoleSettings } from '@weftly/runtime'

export const cardLayouts = ['vertical', 'horizontal'] as const
export const cardColumnOrders = ['image-content', 'content-image'] as const
export const cardBackgrounds = sectionBackgrounds
export const cardShadows = ['none', 'small', 'medium', 'large'] as const
export const cardContentAlignments = [
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center-center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const
export const cardSpacings = ['none', 'small', 'medium', 'large'] as const
export const cardImageWidths = ['40-60', '50-50', '60-40'] as const
export const cardMinHeights = ['auto', 'small', 'medium', 'large'] as const

export const cardSchema = defineComponentSchema({
  key: 'card',
  name: 'Card',
  order: 10,
  category: 'container',
  allowedChildren: ['image', 'headline', 'richText', 'button', 'collection-item'],
  allowedParents: ['grid', 'cards'],
  settings: {
    ...collectionRoleSettings,
    layout: {
      type: 'segmented',
      label: 'Layout',
      options: [...cardLayouts],
      default: 'vertical',
      responsive: true,
      optionIcons: {
        vertical: 'Rows2',
        horizontal: 'Columns2',
      },
      optionTooltips: {
        vertical: 'Vertikal',
        horizontal: 'Horizontal',
      },
    },
    columnOrder: {
      type: 'segmented',
      label: 'Spalten-Reihenfolge',
      options: [...cardColumnOrders],
      default: 'image-content',
      optionIcons: {
        'image-content': 'PanelLeft',
        'content-image': 'PanelRight',
      },
      optionTooltips: {
        'image-content': 'Bild links',
        'content-image': 'Bild rechts',
      },
    },
    background: {
      type: 'select',
      label: 'Hintergrund',
      options: [...cardBackgrounds],
      default: 'white',
    },
    shadow: {
      type: 'select',
      label: 'Schatten',
      options: [...cardShadows],
      default: 'medium',
    },
    contentAlign: {
      type: 'select',
      label: 'Inhalt-Ausrichtung',
      options: [...cardContentAlignments],
      default: 'top-left',
      responsive: true,
    },
    imagePadding: {
      type: 'select',
      label: 'Bild-Innenabstand',
      options: [...cardSpacings],
      default: 'none',
      responsive: true,
    },
    contentPadding: {
      type: 'select',
      label: 'Inhalt-Innenabstand',
      options: [...cardSpacings],
      default: 'medium',
      responsive: true,
    },
    gap: {
      type: 'select',
      label: 'Abstand',
      options: [...cardSpacings],
      default: 'medium',
      responsive: true,
    },
    imageWidth: {
      type: 'select',
      label: 'Bildbreite',
      options: [...cardImageWidths],
      default: '50-50',
      responsive: true,
    },
    minHeight: {
      type: 'select',
      label: 'Mindesthöhe',
      options: [...cardMinHeights],
      default: 'auto',
      responsive: true,
    },
  },
})
