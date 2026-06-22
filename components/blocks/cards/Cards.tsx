import type { ReactNode } from 'react'
import { Grid } from '../grid/Grid'
import {
  isResponsiveValueMap,
  responsiveViewports,
} from '@weftly/runtime/lib/responsive-settings'
import { cardsColumns } from './cards.schema'

type CardsColumn = (typeof cardsColumns)[number]

function isCardsColumn(value: string | undefined): value is CardsColumn {
  return cardsColumns.includes(value as CardsColumn)
}

function toGridColumns(value: unknown): number | undefined {
  if (typeof value !== 'string' || !isCardsColumn(value)) {
    return undefined
  }

  return Number(value)
}

function toGridColumnProps(
  columns: string | Record<string, unknown> | undefined,
): number | Record<string, unknown> | undefined {
  if (typeof columns === 'string') {
    return toGridColumns(columns)
  }

  if (!isResponsiveValueMap(columns)) {
    return undefined
  }

  const next: Record<string, unknown> = {}
  for (const viewport of responsiveViewports) {
    const value = toGridColumns(columns[viewport])
    if (value !== undefined) {
      next[viewport] = value
    }
  }

  return next
}

export function Cards({
  columns,
  gap,
  children,
}: {
  columns?: string | Record<string, unknown>
  gap?: string | Record<string, unknown>
  children?: ReactNode
}) {
  return (
    <Grid columns={toGridColumnProps(columns)} gap={gap}>
      {children}
    </Grid>
  )
}
