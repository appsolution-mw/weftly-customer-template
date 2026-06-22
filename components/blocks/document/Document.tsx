import type { AssetRow } from '@weftly/runtime/lib/asset-lookup'
import { formatBytes } from '@weftly/runtime/lib/format-bytes'
import { EmptyAssetPlaceholder } from '../_shared/EmptyAssetPlaceholder'
import styles from './Document.module.scss'

export function Document({
  file,
  label,
  showSize = true,
  editable,
}: {
  file: AssetRow | null
  label?: string
  showSize?: boolean
  editable?: boolean
  locale?: string
}) {
  if (!file) {
    if (editable) {
      return <EmptyAssetPlaceholder kind="document" />
    }
    return null
  }
  const text = label ?? file.originalFilename
  return (
    <a href={file.cdnUrl} download className={styles.link}>
      <span>{text}</span>
      {showSize && (
        <span className={styles.size}>({formatBytes(file.sizeBytes)})</span>
      )}
    </a>
  )
}
