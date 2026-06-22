import styles from './EmptyAssetPlaceholder.module.scss'

type Kind = 'image' | 'document' | 'video'

// Hardcoded German labels: the Editor UI is German-only at this layer, and
// async getTranslations would force the host block (Image/Document/Video) to
// become async — which crashes inside EditorCanvas (a Client Component that
// imports PageTreeRenderer, transitively pulling these blocks into the
// client bundle; React 19 forbids async Client Components). When English
// editor UI is needed, accept a label prop and have PageTreeRenderer (a pure
// Server Component) resolve the translations and pass them through.
const LABEL_BY_KIND: Record<Kind, string> = {
  image: 'Bild auswählen',
  document: 'Datei auswählen',
  video: 'Video auswählen',
}

/** Minimal inline SVG glyphs — no admin-UI (builder-ui/Icon) dependency. */
function ImageGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function DocumentGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function VideoGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}

const GLYPH_BY_KIND: Record<Kind, () => React.JSX.Element> = {
  image: ImageGlyph,
  document: DocumentGlyph,
  video: VideoGlyph,
}

export function EmptyAssetPlaceholder({ kind }: { kind: Kind }) {
  const label = LABEL_BY_KIND[kind]
  const Glyph = GLYPH_BY_KIND[kind]
  return (
    <div className={styles.empty} role="img" aria-label={label}>
      <span className={styles.icon}>
        <Glyph />
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
