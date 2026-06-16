import { createRegistry, defineComponent } from '@weftly/host'
import { builtinRegistry, type BlockComponent } from '@weftly/runtime'
import { DemoBlock } from '../components/DemoBlock'

/**
 * This customer project's component registry: Weftly's starter blocks plus
 * one project-owned component. Swap `builtinRegistry` for a fully custom set
 * to replace the starter library entirely.
 */
export const appRegistry = createRegistry([
  builtinRegistry,
  defineComponent({
    key: 'demo',
    name: 'Demo',
    category: 'leaf',
    component: DemoBlock as unknown as BlockComponent,
    settings: { title: { type: 'text', label: 'Title', default: '' } },
  }),
])
