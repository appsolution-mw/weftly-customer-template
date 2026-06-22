import { createRegistry, defineComponent } from '@weftly/host'
import { builtinRegistry, type BlockComponent } from '@weftly/runtime'
import { DemoBlock } from '../components/DemoBlock'
import { Section } from '../components/blocks/section/Section'
import { sectionSchema } from '../components/blocks/section/section.schema'
import { Container } from '../components/blocks/container/Container'
import { containerSchema } from '../components/blocks/container/container.schema'
import { Grid } from '../components/blocks/grid/Grid'
import { gridSchema } from '../components/blocks/grid/grid.schema'
import { Cards } from '../components/blocks/cards/Cards'
import { cardsSchema } from '../components/blocks/cards/cards.schema'
import { Card } from '../components/blocks/card/Card'
import { cardSchema } from '../components/blocks/card/card.schema'
import { Headline } from '../components/blocks/headline/Headline'
import { headlineSchema } from '../components/blocks/headline/headline.schema'
import { Button } from '../components/blocks/button/Button'
import { buttonSchema } from '../components/blocks/button/button.schema'
import { Hero } from '../components/blocks/hero/Hero'
import { heroSchema } from '../components/blocks/hero/hero.schema'
import { HeroBanner } from '../components/blocks/hero-banner/HeroBanner'
import { heroBannerSchema } from '../components/blocks/hero-banner/hero-banner.schema'
import { Image } from '../components/blocks/image/Image'
import { imageSchema } from '../components/blocks/image/image.schema'
import { Document } from '../components/blocks/document/Document'
import { documentSchema } from '../components/blocks/document/document.schema'
import { Video } from '../components/blocks/video/Video'
import { videoSchema } from '../components/blocks/video/video.schema'
import { RichText } from '../components/blocks/rich-text/RichText'
import { richTextSchema } from '../components/blocks/rich-text/rich-text.schema'

/**
 * This customer project's component registry: Weftly's built-in blocks (
 * collection-list + collection-item) plus all 13 owned design components.
 *
 * Builder preview imports this registry in the browser, so all registered
 * components must stay client-safe: no database clients, filesystem access,
 * server-only imports, or secrets.
 */

const block = (schema: object, component: unknown) =>
  defineComponent({
    ...(schema as Record<string, unknown>),
    component: component as BlockComponent,
  } as Parameters<typeof defineComponent>[0])

export const appRegistry = createRegistry([
  builtinRegistry, // collection-list + collection-item (aus @weftly/runtime)
  block(sectionSchema, Section),
  block(containerSchema, Container),
  block(gridSchema, Grid),
  block(cardsSchema, Cards),
  block(cardSchema, Card),
  block(headlineSchema, Headline),
  block(buttonSchema, Button),
  block(heroSchema, Hero),
  block(heroBannerSchema, HeroBanner),
  block(imageSchema, Image),
  block(documentSchema, Document),
  block(videoSchema, Video),
  block(richTextSchema, RichText),
  defineComponent({
    key: 'demo',
    name: 'Demo',
    category: 'leaf',
    component: DemoBlock as unknown as BlockComponent,
    settings: { title: { type: 'text', label: 'Title', default: '' } },
  }),
])
