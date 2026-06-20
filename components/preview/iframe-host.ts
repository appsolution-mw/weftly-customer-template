'use client'

import { registryContract, type ComponentRegistry } from '@weftly/host'
import {
  WEFTLY_IFRAME_MESSAGE_SOURCE,
  WEFTLY_IFRAME_PROTOCOL_VERSION,
  type IframeMessage,
  type IframeNodeGeometry,
} from './iframe-protocol'

const NODE_SELECTOR = '[data-node-id]'
const MIN_CONTENT_HEIGHT = 1
const DOCUMENT_NODE = 9

type IframeHostBridgeOptions = {
  registry: ComponentRegistry
  parentOrigin: string
  root?: ParentNode
  projectId?: string
}

type IframeHostBridge = {
  destroy: () => void
}

export function createIframeHostBridge({
  registry,
  parentOrigin,
  root = document.body,
  projectId,
}: IframeHostBridgeOptions): IframeHostBridge {
  let destroyed = false
  let timer: number | null = null

  const post = (message: IframeMessage): void => {
    if (destroyed) return
    window.parent.postMessage(message, parentOrigin)
  }

  const sendReady = (): void => {
    post({
      source: WEFTLY_IFRAME_MESSAGE_SOURCE,
      protocolVersion: WEFTLY_IFRAME_PROTOCOL_VERSION,
      type: 'weftly:iframe-ready',
    })
  }

  const sendIdentity = (): void => {
    if (!projectId) return
    post({
      source: WEFTLY_IFRAME_MESSAGE_SOURCE,
      protocolVersion: WEFTLY_IFRAME_PROTOCOL_VERSION,
      type: 'weftly:iframe-identity',
      projectId,
    })
  }

  const sendContract = (): void => {
    post({
      source: WEFTLY_IFRAME_MESSAGE_SOURCE,
      protocolVersion: WEFTLY_IFRAME_PROTOCOL_VERSION,
      type: 'weftly:component-contract',
      contract: registryContract(registry),
    })
  }

  const sendGeometry = (): void => {
    post({
      source: WEFTLY_IFRAME_MESSAGE_SOURCE,
      protocolVersion: WEFTLY_IFRAME_PROTOCOL_VERSION,
      type: 'weftly:node-geometry',
      nodes: measureIframeNodeGeometry(root),
      contentHeight: measureIframeContentHeight(root),
    })
  }

  const scheduleGeometry = (): void => {
    if (destroyed || timer !== null) return
    timer = window.setTimeout(() => {
      timer = null
      sendGeometry()
    }, 0)
  }

  const resizeObserver = new ResizeObserver(scheduleGeometry)
  const mutationObserver = new MutationObserver(() => {
    refreshObservedAnchors()
    scheduleGeometry()
  })
  const observedResizeTargets = new Set<Element>()

  function refreshObservedAnchors(): void {
    const nextTargets = new Set(root.querySelectorAll<Element>(NODE_SELECTOR))

    for (const target of observedResizeTargets) {
      if (!nextTargets.has(target)) {
        resizeObserver.unobserve(target)
        observedResizeTargets.delete(target)
      }
    }
    for (const target of nextTargets) {
      if (!observedResizeTargets.has(target)) {
        resizeObserver.observe(target)
        observedResizeTargets.add(target)
      }
    }
  }

  refreshObservedAnchors()
  const mutationTarget = nodeForRoot(root)
  mutationObserver.observe(mutationTarget, {
    attributes: true,
    childList: true,
    subtree: true,
  })
  window.addEventListener('resize', scheduleGeometry)

  sendReady()
  sendIdentity()
  sendContract()
  sendGeometry()

  return {
    destroy: () => {
      destroyed = true
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('resize', scheduleGeometry)
      if (timer !== null) {
        window.clearTimeout(timer)
      }
    },
  }
}

function measureIframeNodeGeometry(root: ParentNode): IframeNodeGeometry[] {
  return Array.from(root.querySelectorAll<Element>(NODE_SELECTOR)).flatMap((anchor) => {
    const rect = measureAnchorBox(anchor)
    if (!rect) return []

    return [{
      id: anchor.getAttribute('data-node-id') ?? '',
      key: anchor.getAttribute('data-node-key') ?? '',
      parentId: anchor.getAttribute('data-node-parent') ?? '',
      category: anchor.getAttribute('data-node-category') === 'container'
        ? 'container'
        : 'leaf',
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }]
  })
}

function measureIframeContentHeight(root: ParentNode): number {
  const bodyHeight = document.body.scrollHeight
  const docHeight = document.documentElement.scrollHeight
  const childBottom = Array.from(root.children).reduce((height, child) => {
    const rect = child.getBoundingClientRect()
    return Math.max(height, rect.bottom)
  }, 0)

  return Math.max(MIN_CONTENT_HEIGHT, Math.ceil(bodyHeight), Math.ceil(docHeight), Math.ceil(childBottom))
}

function measureAnchorBox(anchor: Element): DOMRect | null {
  const ownRect = anchor.getBoundingClientRect()
  if (isPositiveRect(ownRect)) {
    return ownRect
  }

  return unionPositiveRects(Array.from(anchor.querySelectorAll<Element>('*')))
}

function unionPositiveRects(elements: Element[]): DOMRect | null {
  const rects = elements
    .map((element) => element.getBoundingClientRect())
    .filter(isPositiveRect)

  if (rects.length === 0) {
    return null
  }

  const top = Math.min(...rects.map((rect) => rect.top))
  const left = Math.min(...rects.map((rect) => rect.left))
  const right = Math.max(...rects.map((rect) => rect.right))
  const bottom = Math.max(...rects.map((rect) => rect.bottom))

  return new DOMRect(left, top, right - left, bottom - top)
}

function isPositiveRect(rect: DOMRectReadOnly): boolean {
  return rect.width > 0 && rect.height > 0
}

function nodeForRoot(root: ParentNode): Node {
  if ('nodeType' in root && root.nodeType === DOCUMENT_NODE) {
    return (root as Document).documentElement
  }

  return root as Node
}
