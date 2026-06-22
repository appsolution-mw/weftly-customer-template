import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'
import { collectionRoleSettings } from '@weftly/runtime'

export const containerContentWidths = ['boxed', 'fluid'] as const

export const containerContentWidthLabels: Record<
  (typeof containerContentWidths)[number],
  string
> = {
  boxed: 'Boxed',
  fluid: 'Fluid',
}

export const containerSchema = defineComponentSchema({
  key: 'container',
  name: 'Container',
  group: 'layout',
  icon: 'Square',
  order: 20,
  category: 'container',
  allowedChildren: [
    'headline',
    'grid',
    'button',
    'hero-banner',
    'hero',
    'image',
    'document',
    'richText',
    'collection-item',
  ],
  allowedParents: ['section', 'collection-list', 'collection-item'],
  settings: {
    ...collectionRoleSettings,
    contentWidth: {
      type: 'select',
      label: 'Container-Breite',
      options: [...containerContentWidths],
      optionLabels: containerContentWidthLabels,
      default: 'boxed',
    },
  },
})
