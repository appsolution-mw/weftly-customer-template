import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'

export const documentSchema = defineComponentSchema({
  key: 'document',
  name: 'Dokument',
  group: 'content',
  icon: 'FileText',
  order: 40,
  category: 'leaf',
  allowedChildren: [],
  settings: {
    file: { type: 'document', label: 'Datei' },
    label: { type: 'text', label: 'Beschriftung', translatable: true, default: 'Download' },
    showSize: { type: 'boolean', label: 'Dateigröße anzeigen', default: true },
  },
})
