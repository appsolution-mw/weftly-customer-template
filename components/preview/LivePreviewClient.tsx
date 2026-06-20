'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createIframeHostBridge,
} from './iframe-host'
import {
  isBuilderDraftSnapshotMessage,
  type BuilderLivePreviewCollectionField,
  type BuilderLivePreviewSnapshot,
} from './iframe-protocol'
import {
  PageTreeRenderer,
  WebsiteRenderSurface,
  buildAssetLookup,
  type AssetRow,
  type BuilderCollectionListPreviewItems,
  type CollectionField,
  type TranslationLookup,
} from '@weftly/runtime'
import { appRegistry } from '../../lib/registry'

type LivePreviewClientProps = {
  parentOrigin: string | null
  searchParamEntries: [string, string][]
  children: ReactNode
}

export function LivePreviewClient({
  parentOrigin,
  searchParamEntries,
  children,
}: LivePreviewClientProps): ReactNode {
  const [snapshot, setSnapshot] = useState<BuilderLivePreviewSnapshot | null>(null)

  useEffect(() => {
    if (!parentOrigin) return

    const bridge = createIframeHostBridge({
      registry: appRegistry,
      parentOrigin,
      // The builder reconciles this against the project being edited (live
      // connection status). Trust comes from the bearer-auth /connect call.
      projectId: process.env.NEXT_PUBLIC_WEFTLY_PROJECT_ID,
    })

    return () => {
      bridge.destroy()
    }
  }, [parentOrigin])

  useEffect(() => {
    if (!parentOrigin) return

    const onMessage = (event: MessageEvent<unknown>): void => {
      if (event.origin !== parentOrigin) return
      if (event.source !== window.parent) return
      if (!isBuilderDraftSnapshotMessage(event.data)) return

      setSnapshot(event.data.snapshot)
    }

    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [parentOrigin])

  if (!snapshot) return children

  return (
    <LivePreviewRenderer
      snapshot={snapshot}
      searchParamEntries={searchParamEntries}
    />
  )
}

function LivePreviewRenderer({
  snapshot,
  searchParamEntries,
}: {
  snapshot: BuilderLivePreviewSnapshot
  searchParamEntries: [string, string][]
}) {
  const assets = useMemo(
    () =>
      buildAssetLookup(
        Object.values(snapshot.assets).map((asset) => ({
          ...asset,
          sizeBytes: BigInt(asset.sizeBytes),
        } satisfies AssetRow)),
      ),
    [snapshot.assets],
  )
  const translations = useCallback<TranslationLookup>(
    (nodeId, prop) => snapshot.translations[`node:${nodeId}:${prop}`],
    [snapshot.translations],
  )
  const pageUrls = useCallback(
    (pageId: string) => snapshot.pageUrls[pageId] ?? null,
    [snapshot.pageUrls],
  )
  const urlParams = useMemo(
    () => new URLSearchParams(searchParamEntries),
    [searchParamEntries],
  )
  const collectionListPreviewItems = useMemo<BuilderCollectionListPreviewItems>(
    () => deserializeCollectionListPreviewItems(snapshot),
    [snapshot],
  )

  return (
    <WebsiteRenderSurface>
      <PageTreeRenderer
        tree={snapshot.tree}
        locale={snapshot.locale}
        defaultLocale={snapshot.defaultLocale}
        translations={translations}
        assets={assets}
        pageUrls={pageUrls}
        editable
        mode="builder"
        urlParams={urlParams}
        now={new Date(snapshot.generatedAt)}
        collectionListPreviewItems={collectionListPreviewItems}
        registry={appRegistry}
      />
    </WebsiteRenderSurface>
  )
}

function deserializeCollectionListPreviewItems(
  snapshot: BuilderLivePreviewSnapshot,
): BuilderCollectionListPreviewItems {
  return Object.fromEntries(
    Object.entries(snapshot.collectionListPreviewItems).map(([nodeId, entries]) => [
      nodeId,
      entries.map((entry) => ({
        collectionKey: entry.collectionKey,
        fields: entry.fields.map(deserializeCollectionField),
        item: {
          ...entry.item,
          publishedAt: entry.item.publishedAt
            ? new Date(entry.item.publishedAt)
            : null,
        },
      })),
    ]),
  )
}

function deserializeCollectionField(
  field: BuilderLivePreviewCollectionField,
): CollectionField {
  return {
    ...field,
    createdAt: new Date(field.createdAt),
    updatedAt: new Date(field.updatedAt),
  }
}
