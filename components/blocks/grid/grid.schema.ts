import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'
import { collectionRoleSettings } from '@weftly/runtime'

export const gridGaps = ['none', 'small', 'medium', 'large'] as const

export const gridSchema = defineComponentSchema({
  key: 'grid',
  name: 'Grid',
  group: 'layout',
  icon: 'LayoutGrid',
  order: 30,
  category: 'container',
  allowedChildren: [
    'card',
    'headline',
    'richText',
    'button',
    'image',
    'document',
    'collection-item',
  ],
  settings: {
    ...collectionRoleSettings,
    columns: {
      type: 'number',
      label: 'Spalten',
      default: 3,
      responsive: true,
    },
    gap: {
      type: 'select',
      label: 'Abstand',
      options: [...gridGaps],
      default: 'medium',
      responsive: true,
    },
  },
})
