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
      <h1>{parentOrigin ? 'Vorschau wird geladen' : 'Website für die Vorschau gestartet'}</h1>
      <p>
        {parentOrigin
          ? `Warte auf den Seitenentwurf für ${path} aus dem Builder.`
          : 'Kehre zur Projekteinrichtung in Weftly zurück und aktualisiere den Verbindungsstatus. Öffne danach den Builder. Falls die Verbindung dort fehlt, prüfe den Projekt-API-Schlüssel und die freigegebene Builder-Adresse in deiner Website-Konfiguration.'}
      </p>
    </main>
  )
}
