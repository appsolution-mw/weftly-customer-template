import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'
import { collectionRoleSettings } from '@weftly/runtime'

export const cardsColumns = ['1', '2', '3'] as const
export const cardsGaps = ['none', 'small', 'medium', 'large'] as const

export const cardsSchema = defineComponentSchema({
  key: 'cards',
  name: 'Cards',
  category: 'container',
  palette: false,
  allowedChildren: ['card', 'collection-item'],
  settings: {
    ...collectionRoleSettings,
    columns: {
      type: 'select',
      label: 'Spalten',
      options: [...cardsColumns],
      default: '3',
      responsive: true,
    },
    gap: {
      type: 'select',
      label: 'Abstand',
      options: [...cardsGaps],
      default: 'medium',
      responsive: true,
    },
  },
})
