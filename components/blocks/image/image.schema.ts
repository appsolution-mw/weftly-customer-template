import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'

export const imageSchema = defineComponentSchema({
  key: 'image',
  name: 'Bild',
  group: 'content',
  icon: 'Image',
  order: 30,
  category: 'leaf',
  allowedChildren: [],
  settings: {
    image: { type: 'image', label: 'Bild', responsive: true },
    alt: { type: 'text', label: 'Alt-Text', translatable: true, default: 'Bild' },
    loading: {
      type: 'select',
      label: 'Ladeverhalten',
      options: ['lazy', 'eager'],
      default: 'lazy',
      optionLabels: {
        lazy: 'Lazy Load (Standard)',
        eager: 'Sofort laden',
      },
      description:
        'Lazy für Bilder außerhalb des ersten Viewports. Sofort laden für sichtbare Bilder im ersten Viewport.',
    },
    fetchPriority: {
      type: 'select',
      label: 'Fetch Priority',
      options: ['auto', 'high'],
      default: 'auto',
      optionLabels: {
        auto: 'Automatisch',
        high: 'High für LCP/Hero',
      },
      description:
        'High nur für das wichtigste Hero-/LCP-Bild. Bei High wird Lazy Load automatisch deaktiviert.',
    },
  },
})
