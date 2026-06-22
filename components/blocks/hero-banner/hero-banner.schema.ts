import { defineComponentSchema } from '@weftly/runtime/lib/component-schema'
import { textColorKeys } from '../text-colors'
import { headlineSizes } from '../headline/headline.schema'
import { buttonSizes, buttonVariants } from '../button/button.schema'
import { blockWidthOptionLabels, blockWidths } from '../block-widths'

export const heroBannerPositions = [
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center-center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const

export const heroBannerContentWidths = ['boxed', 'fluid'] as const

export const heroBannerPositionLabels: Record<
  (typeof heroBannerPositions)[number],
  string
> = {
  'top-left': 'Oben links',
  'top-center': 'Oben mittig',
  'top-right': 'Oben rechts',
  'center-left': 'Mitte links',
  'center-center': 'Mitte mittig',
  'center-right': 'Mitte rechts',
  'bottom-left': 'Unten links',
  'bottom-center': 'Unten mittig',
  'bottom-right': 'Unten rechts',
}

export const heroBannerSchema = defineComponentSchema({
  key: 'hero-banner',
  name: 'Hero Banner',
  group: 'composed',
  icon: 'RectangleHorizontal',
  order: 20,
  category: 'leaf',
  allowedChildren: [],
  settings: {
    backgroundImage: { type: 'image', label: 'Hintergrundbild' },
    mobileBackgroundImage: { type: 'image', label: 'Mobiles Hintergrundbild' },
    backgroundAlt: {
      type: 'text',
      label: 'Alt-Text',
      translatable: true,
      default: '',
    },
    contentPosition: {
      type: 'select',
      label: 'Content-Ausrichtung',
      options: [...heroBannerPositions],
      optionLabels: heroBannerPositionLabels,
      default: 'center-center',
    },
    contentWidth: {
      type: 'select',
      label: 'Container-Breite',
      options: [...heroBannerContentWidths],
      optionLabels: {
        boxed: 'Boxed',
        fluid: 'Fluid',
      },
      default: 'boxed',
    },
    contentImage: { type: 'image', label: 'Bild im Content' },
    contentImageAlt: {
      type: 'text',
      label: 'Content-Bild Alt-Text',
      translatable: true,
      default: '',
    },
    headline: {
      type: 'text',
      label: 'Überschrift',
      translatable: true,
      default: 'Neue Überschrift',
      multiline: true,
    },
    headlineLevel: {
      type: 'select',
      label: 'Überschriften-Ebene',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      default: 'h1',
    },
    headlineSize: {
      type: 'select',
      label: 'Überschriften-Größe',
      options: [...headlineSizes],
      default: 'xxl',
      responsive: true,
    },
    headlineWidth: {
      type: 'select',
      label: 'Überschriften-Breite',
      options: [...blockWidths],
      optionLabels: blockWidthOptionLabels,
      default: '100',
      responsive: true,
    },
    headlineColor: {
      type: 'select',
      label: 'Überschriften-Farbe',
      options: [...textColorKeys],
      default: 'white',
    },
    headlineWithBar: {
      type: 'boolean',
      label: 'Balken anzeigen',
      default: true,
    },
    text: {
      type: 'richtext',
      label: 'Text',
      translatable: true,
    },
    textColor: {
      type: 'select',
      label: 'Textfarbe',
      options: [...textColorKeys],
      default: 'white',
    },
    buttonLabel: {
      type: 'text',
      label: 'Button-Text',
      translatable: true,
      default: 'Mehr erfahren',
    },
    buttonHref: { type: 'link', label: 'Button-Link' },
    buttonVariant: {
      type: 'select',
      label: 'Button-Stil',
      options: [...buttonVariants],
      default: 'outline',
    },
    buttonColor: {
      type: 'select',
      label: 'Button-Farbe',
      options: [...textColorKeys],
      default: 'white',
    },
    buttonSize: {
      type: 'select',
      label: 'Button-Größe',
      options: [...buttonSizes],
      default: 'lg',
      responsive: true,
    },
    buttonTransparentBackground: {
      type: 'boolean',
      label: 'Button transparent',
      default: true,
    },
  },
})
