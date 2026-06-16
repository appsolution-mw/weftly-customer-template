import {
  loadPublicPageSnapshot,
  PublicSnapshotPageTreeRenderer,
  type PublicPageSnapshot,
} from '@weftly/loader'
import { WebsiteRenderSurface } from '@weftly/runtime'
import { DynamicStub } from './DynamicStub'
import { appRegistry } from '../../lib/registry'

export const dynamic = 'force-dynamic'

const PROJECT_ID = process.env.NEXT_PUBLIC_WEFTLY_PROJECT_ID
const LOCALE = process.env.NEXT_PUBLIC_WEFTLY_DEFAULT_LOCALE ?? 'de'

export default async function CatchAll({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const path = '/' + (slug ?? []).join('/')

  const snapshot = await loadPublicPageSnapshot<PublicPageSnapshot>({
    projectId: PROJECT_ID,
    locale: LOCALE,
    path,
    state: 'PUBLISHED',
  })

  if (!snapshot.ok) {
    return <DynamicStub path={path} />
  }

  return (
    <WebsiteRenderSurface>
      <PublicSnapshotPageTreeRenderer snapshot={snapshot.data} registry={appRegistry} />
    </WebsiteRenderSurface>
  )
}
