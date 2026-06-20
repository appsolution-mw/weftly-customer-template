export function DynamicStub({ path }: { path: string }) {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Dynamischer Inhalt</h1>
      <p>
        Diese Route (<code>{path}</code>) hat keinen veröffentlichten Weftly
        Snapshot. Prüfe Projekt-ID, Locale und CDN-Konfiguration.
      </p>
    </main>
  )
}
