import type { ReactNode } from 'react'
import '../styles/globals.scss'
import { defaultLocale } from '../lib/routing'

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale?: string }>
}) {
  const { locale } = await params

  return (
    <html lang={locale ?? defaultLocale()}>
      <body>{children}</body>
    </html>
  )
}
