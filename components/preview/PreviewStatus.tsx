import styles from './PreviewStatus.module.scss'

export function PreviewStatus({
  parentOrigin,
  path,
}: {
  parentOrigin: string | null
  path: string
}) {
  return (
    <main className={styles.status} role="status">
      <h1>{parentOrigin ? 'Vorschau wird geladen' : 'Vorschau nicht verbunden'}</h1>
      <p>
        {parentOrigin
          ? `Warte auf den Seitenentwurf für ${path} aus dem Builder.`
          : 'Die Builder-Adresse fehlt oder ist für diese Vorschau nicht freigegeben. Öffne die Vorschau im Builder und prüfe die freigegebenen Builder-Adressen in der Website-Konfiguration.'}
      </p>
    </main>
  )
}
