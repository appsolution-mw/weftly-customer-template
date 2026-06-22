import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'

export const videoSchema = defineComponentSchema({
  key: 'video',
  name: 'Video',
  order: 20,
  category: 'leaf',
  allowedChildren: [],
  settings: {
    video: { type: 'video', label: 'Video' },
    poster: { type: 'image', label: 'Poster' },
    posterAlt: {
      type: 'text',
      label: 'Poster-Alt-Text',
      translatable: true,
      default: '',
    },
    controls: { type: 'boolean', label: 'Steuerelemente', default: true },
    autoplay: { type: 'boolean', label: 'Autoplay', default: false },
    loop: { type: 'boolean', label: 'Loop', default: false },
    muted: { type: 'boolean', label: 'Stumm', default: false },
    playsInline: { type: 'boolean', label: 'Inline abspielen', default: true },
  },
})
