import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import '../styles/globals.scss'
import { defaultLocale } from '../lib/routing'

const helveticaNeue = localFont({
  src: [
    { path: '../fonts/helveticaneueltstd-lt-webfont.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/helveticaneueltcom-bd-webfont.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-helvetica-neue',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
})

const gilroy = localFont({
  src: '../fonts/gilroy-extrabold-webfont.woff2',
  weight: '800',
  style: 'normal',
  variable: '--font-gilroy',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
})

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
    <html lang={locale ?? defaultLocale()} className={`${helveticaNeue.variable} ${gilroy.variable}`}>
      <body>{children}</body>
    </html>
  )
}
