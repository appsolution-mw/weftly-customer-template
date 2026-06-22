import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'

export const heroSchema = defineComponentSchema({
  key: 'hero',
  name: 'Hero',
  group: 'composed',
  icon: 'PanelTop',
  order: 10,
  category: 'leaf',
  allowedChildren: [],
  settings: {
    headline: { type: 'text', label: 'Überschrift', translatable: true, default: 'Headline' },
    teaser: { type: 'richtext', label: 'Teaser', translatable: true },
    buttonLabel: { type: 'text', label: 'Button-Text', translatable: true, default: 'Mehr erfahren' },
    buttonHref: { type: 'link', label: 'Button-Link' },
    backgroundImage: { type: 'image', label: 'Hintergrundbild' },
    backgroundVideo: { type: 'video', label: 'Hintergrund-Video' },
    background: { type: 'color', label: 'Hintergrundfarbe' },
  },
})
