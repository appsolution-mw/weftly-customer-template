import { contentEnvironment } from '../lib/routing'
import styles from './DynamicStub.module.scss'

export function DynamicStub({ path }: { path: string }) {
  const staging = contentEnvironment() === 'staging'

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>WEFTLY · {staging ? 'STAGING' : 'WEBSITE'}</p>
        <h1>Deine Website ist gestartet.</h1>
        <p>Für diese Seite ist noch kein Inhalt verfügbar.</p>
        {staging ? (
          <>
            <p>
              Schließe die Verbindung in Weftly ab, gestalte deine erste Seite im
              Builder und veröffentliche sie auf Staging. Danach erscheint sie hier.
            </p>
            <a href="https://app.weftly.site">Zur Einrichtung in Weftly →</a>
            <p className={styles.hint}>
              Bereits veröffentlicht? Prüfe Projekt-ID, Sprache und CDN-Konfiguration
              für die Seite <code>{path}</code>.
            </p>
          </>
        ) : (
          <p>Die Inhalte werden hier nach der Veröffentlichung bereitgestellt.</p>
        )}
      </section>
    </main>
  )
}
