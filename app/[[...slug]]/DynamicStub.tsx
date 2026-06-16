export function DynamicStub({ path }: { path: string }) {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Dynamischer Inhalt</h1>
      <p>
        Diese Route (<code>{path}</code>) benötigt die Weftly Content-API (SP-B)
        — Item-Detail, Collection-Listen, Sitemap usw. sind in SP-C1 noch nicht
        DB-los verfügbar.
      </p>
    </main>
  )
}
