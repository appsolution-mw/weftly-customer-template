import React from 'react'
import { SafeHtml } from '../../SafeHtml'
import type { AssetRow } from '@weftly/runtime/lib/asset-lookup'
import styles from './Hero.module.scss'

export function Hero({
  headline,
  teaser,
  buttonLabel,
  buttonHref,
  background,
  backgroundImage,
  backgroundVideo,
}: {
  headline?: string
  teaser?: string
  buttonLabel?: string
  buttonHref?: string
  background?: string
  backgroundImage?: AssetRow | null
  backgroundVideo?: AssetRow | null
}) {
  const bgStyle: React.CSSProperties = {}
  if (background) bgStyle.background = background
  // Precedence: video > image > color. The color stays as the underlying
  // background-color (visible only until the video buffers / the image loads).
  // The image is reused as the <video poster=> when both are set.
  if (!backgroundVideo?.cdnUrl && backgroundImage?.cdnUrl) {
    bgStyle.backgroundImage = `url(${backgroundImage.cdnUrl})`
    bgStyle.backgroundSize = 'cover'
    bgStyle.backgroundPosition = 'center'
  }
  return (
    <section
      className={styles.hero}
      style={Object.keys(bgStyle).length > 0 ? bgStyle : undefined}
    >
      {backgroundVideo?.cdnUrl ? (
        <video
          className={styles.bgVideo}
          src={backgroundVideo.cdnUrl}
          poster={backgroundImage?.cdnUrl}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : null}
      <h1 className={styles.title}>{headline ?? ''}</h1>
      {teaser ? <SafeHtml className={styles.teaser} html={teaser} /> : null}
      {buttonLabel && buttonHref ? (
        <a href={buttonHref}>{buttonLabel}</a>
      ) : null}
    </section>
  )
}
