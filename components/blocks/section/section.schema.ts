import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'
import { brandColorKeys } from '../brand-colors'
import { collectionRoleSettings } from '@weftly/runtime'

export const sectionBackgrounds = ['white', 'light-grey', ...brandColorKeys] as const
export const sectionImageFits = ['cover', 'contain', 'fill', 'none', 'scale-down'] as const
export const sectionImagePositions = [
  'center',
  'top',
  'right',
  'bottom',
  'left',
  'left top',
  'right top',
  'left bottom',
  'right bottom',
] as const

export const sectionSchema = defineComponentSchema({
  key: 'section',
  name: 'Section',
  group: 'layout',
  icon: 'Rows3',
  order: 10,
  category: 'container',
  allowedChildren: [
    'section',
    'container',
    'grid',
    'headline',
    'button',
    'hero-banner',
    'hero',
    'image',
    'document',
    'richText',
    'collection-list',
    'collection-item',
  ],
  settings: {
    ...collectionRoleSettings,
    spacing: {
      type: 'select',
      label: 'Abstand',
      options: ['small', 'medium', 'large'],
      default: 'medium',
      responsive: true,
    },
    background: {
      type: 'select',
      label: 'Hintergrund',
      options: [...sectionBackgrounds],
      default: 'white',
    },
    backgroundImage: {
      type: 'image',
      label: 'Hintergrundbild',
    },
    imageFit: {
      type: 'select',
      label: 'Bild-Anpassung',
      options: [...sectionImageFits],
      default: 'cover',
    },
    imagePosition: {
      type: 'select',
      label: 'Bild-Ausrichtung',
      options: [...sectionImagePositions],
      default: 'center',
    },
    anchor: {
      type: 'text',
      label: 'Anchor-ID',
      default: '',
    },
  },
})
