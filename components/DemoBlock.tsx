/** A component that exists ONLY in this customer project — proof that the
 *  renderer's component set comes from the customer, not from Weftly's
 *  hardcoded map. Sync + client-safe (Keystone). */
export function DemoBlock({ title }: { title?: string; [key: string]: unknown }) {
  return <aside data-demo-block>{title ?? 'Demo'}</aside>
}
