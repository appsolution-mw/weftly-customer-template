import type {
  CollectionField,
  TreeNode,
} from '@weftly/runtime'
import type { AssetRow } from '@weftly/runtime'

export const WEFTLY_IFRAME_PROTOCOL_VERSION = 1
export const WEFTLY_IFRAME_MESSAGE_SOURCE = 'weftly:iframe-host'
export const WEFTLY_BUILDER_MESSAGE_SOURCE = 'weftly:builder-host'

export interface BuilderLivePreviewTranslationEntry {
  valueType: 'TEXT' | 'RICHTEXT' | 'ASSET_ID'
  value: unknown
}

export interface BuilderLivePreviewCollectionField {
  id: string
  collectionId: string
  key: string
  label: string
  type: CollectionField['type']
  order: number
  isRequired: boolean
  isTranslatable: boolean
  isUnique: boolean
  config: unknown
  createdAt: string
  updatedAt: string
}

export interface BuilderLivePreviewResolvedItem {
  id: string
  collectionKey: string
  slug: string
  state: 'DRAFT' | 'STAGED' | 'PUBLISHED'
  publishedAt: string | null
  values: Record<string, unknown>
  templateKey: string | null
  customTemplatePageId: string | null
}

export interface BuilderLivePreviewItemContextEntry {
  collectionKey: string
  fields: BuilderLivePreviewCollectionField[]
  item: BuilderLivePreviewResolvedItem
}

export interface BuilderLivePreviewAssetRow extends Omit<AssetRow, 'sizeBytes'> {
  sizeBytes: string
}

export interface BuilderLivePreviewSnapshot {
  kind: 'builder-live-preview'
  version: 1
  locale: string
  defaultLocale: string
  generatedAt: string
  tree: TreeNode[]
  translations: Record<string, BuilderLivePreviewTranslationEntry>
  assets: Record<string, BuilderLivePreviewAssetRow>
  pageUrls: Record<string, string | null>
  collectionListPreviewItems: Record<string, BuilderLivePreviewItemContextEntry[]>
}

export interface BuilderDraftSnapshotMessage {
  source: typeof WEFTLY_BUILDER_MESSAGE_SOURCE
  protocolVersion: typeof WEFTLY_IFRAME_PROTOCOL_VERSION
  type: 'weftly:builder-draft-snapshot'
  snapshot: BuilderLivePreviewSnapshot
}

export interface IframeNodeGeometry {
  id: string
  key: string
  parentId: string
  category: 'container' | 'leaf'
  top: number
  left: number
  width: number
  height: number
}

export type IframeMessage =
  | {
      source: typeof WEFTLY_IFRAME_MESSAGE_SOURCE
      protocolVersion: typeof WEFTLY_IFRAME_PROTOCOL_VERSION
      type: 'weftly:iframe-ready'
    }
  | {
      source: typeof WEFTLY_IFRAME_MESSAGE_SOURCE
      protocolVersion: typeof WEFTLY_IFRAME_PROTOCOL_VERSION
      type: 'weftly:component-contract'
      contract: unknown[]
    }
  | {
      source: typeof WEFTLY_IFRAME_MESSAGE_SOURCE
      protocolVersion: typeof WEFTLY_IFRAME_PROTOCOL_VERSION
      type: 'weftly:node-geometry'
      nodes: IframeNodeGeometry[]
      contentHeight: number
    }
  | {
      source: typeof WEFTLY_IFRAME_MESSAGE_SOURCE
      protocolVersion: typeof WEFTLY_IFRAME_PROTOCOL_VERSION
      type: 'weftly:iframe-identity'
      projectId: string
    }

export function isBuilderDraftSnapshotMessage(
  value: unknown,
): value is BuilderDraftSnapshotMessage {
  if (!isRecord(value)) return false
  if (value.source !== WEFTLY_BUILDER_MESSAGE_SOURCE) return false
  if (value.protocolVersion !== WEFTLY_IFRAME_PROTOCOL_VERSION) return false
  if (value.type !== 'weftly:builder-draft-snapshot') return false

  return isBuilderLivePreviewSnapshot(value.snapshot)
}

function isBuilderLivePreviewSnapshot(value: unknown): value is BuilderLivePreviewSnapshot {
  if (!isRecord(value)) return false

  return (
    value.kind === 'builder-live-preview' &&
    value.version === 1 &&
    typeof value.locale === 'string' &&
    typeof value.defaultLocale === 'string' &&
    typeof value.generatedAt === 'string' &&
    Array.isArray(value.tree) &&
    value.tree.every(isTreeNode) &&
    isTranslationEntryRecord(value.translations) &&
    isAssetRowRecord(value.assets) &&
    isNullableStringRecord(value.pageUrls) &&
    isCollectionListPreviewItems(value.collectionListPreviewItems)
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isTreeNode(value: unknown): value is TreeNode {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'string' &&
    typeof value.componentKey === 'string' &&
    isRecord(value.props) &&
    Array.isArray(value.children) &&
    value.children.every(isTreeNode)
  )
}

function isTranslationEntryRecord(
  value: unknown,
): value is Record<string, BuilderLivePreviewTranslationEntry> {
  return isRecord(value) && Object.values(value).every(isTranslationEntry)
}

function isTranslationEntry(value: unknown): value is BuilderLivePreviewTranslationEntry {
  return (
    isRecord(value) &&
    (value.valueType === 'TEXT' ||
      value.valueType === 'RICHTEXT' ||
      value.valueType === 'ASSET_ID')
  )
}

function isAssetRowRecord(value: unknown): value is Record<string, BuilderLivePreviewAssetRow> {
  return isRecord(value) && Object.values(value).every(isAssetRow)
}

function isAssetRow(value: unknown): value is BuilderLivePreviewAssetRow {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    (value.kind === 'IMAGE' || value.kind === 'VIDEO' || value.kind === 'DOCUMENT') &&
    typeof value.cdnUrl === 'string' &&
    typeof value.mimeType === 'string' &&
    (value.width === null || typeof value.width === 'number') &&
    (value.height === null || typeof value.height === 'number') &&
    typeof value.sizeBytes === 'string' &&
    /^\d+$/.test(value.sizeBytes) &&
    typeof value.originalFilename === 'string'
  )
}

function isNullableStringRecord(value: unknown): value is Record<string, string | null> {
  return isRecord(value) && Object.values(value).every((entry) => entry === null || typeof entry === 'string')
}

function isCollectionListPreviewItems(
  value: unknown,
): value is Record<string, BuilderLivePreviewItemContextEntry[]> {
  return isRecord(value) && Object.values(value).every(
    (entries) => Array.isArray(entries) && entries.every(isItemContextEntry),
  )
}

function isItemContextEntry(value: unknown): value is BuilderLivePreviewItemContextEntry {
  return (
    isRecord(value) &&
    typeof value.collectionKey === 'string' &&
    Array.isArray(value.fields) &&
    value.fields.every(isCollectionField) &&
    isResolvedItem(value.item)
  )
}

function isCollectionField(value: unknown): value is BuilderLivePreviewCollectionField {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.collectionId === 'string' &&
    typeof value.key === 'string' &&
    typeof value.label === 'string' &&
    typeof value.type === 'string' &&
    Number.isInteger(value.order) &&
    typeof value.isRequired === 'boolean' &&
    typeof value.isTranslatable === 'boolean' &&
    typeof value.isUnique === 'boolean' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  )
}

function isResolvedItem(value: unknown): value is BuilderLivePreviewResolvedItem {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.collectionKey === 'string' &&
    typeof value.slug === 'string' &&
    (value.state === 'DRAFT' || value.state === 'STAGED' || value.state === 'PUBLISHED') &&
    (value.publishedAt === null || typeof value.publishedAt === 'string') &&
    isRecord(value.values) &&
    (value.templateKey === null || typeof value.templateKey === 'string') &&
    (value.customTemplatePageId === null || typeof value.customTemplatePageId === 'string')
  )
}
