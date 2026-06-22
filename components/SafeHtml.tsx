import type { HTMLAttributes } from 'react'
import { sanitizeRichText } from '@weftly/runtime/lib/sanitize'

/**
 * The ONLY component permitted to inject HTML. `dangerouslySetInnerHTML` is
 * used here and nowhere else, always with `sanitizeRichText` applied inline to
 * the value, so CMS/untrusted HTML is sanitised at the exact point of use.
 */
export function SafeHtml({
  html,
  className,
  ...props
}: {
  html: string
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML' | 'children'>) {
  // Defense-in-depth: callers resolve props as `unknown`; never feed a
  // non-string into the injector.
  const safe = typeof html === 'string' ? html : ''
  return (
    <div
      {...props}
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(safe) }}
    />
  )
}
