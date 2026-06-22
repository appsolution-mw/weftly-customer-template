import type { AssetRow } from '@weftly/runtime/lib/asset-lookup'
import { EmptyAssetPlaceholder } from '../_shared/EmptyAssetPlaceholder'
import styles from './Video.module.scss'

export function Video({
  video,
  poster,
  posterAlt,
  controls,
  autoplay,
  loop,
  muted,
  playsInline,
  editable,
}: {
  video: AssetRow | null
  poster: AssetRow | null
  posterAlt: string | null
  controls: boolean
  autoplay: boolean
  loop: boolean
  muted: boolean
  playsInline: boolean
  editable?: boolean
  locale?: string
}) {
  if (!video) {
    if (editable) {
      return <EmptyAssetPlaceholder kind="video" />
    }
    return null
  }

  return (
    <figure className={styles.wrap}>
      <video
        src={video.cdnUrl}
        poster={poster?.cdnUrl}
        controls={controls}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload="metadata"
        aria-label={posterAlt ?? undefined}
        className={styles.video}
      />
    </figure>
  )
}
