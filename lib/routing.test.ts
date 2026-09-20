import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  collectPreviewParentOrigins,
  contentEnvironment,
  defaultLocale,
  isPublicContentState,
  pathFromSlug,
  resolvePreviewParentOrigin,
  resolvePreviewState,
  snapshotCacheTag,
  toSearchParamEntries,
  toURLSearchParams,
} from './routing'

describe('routing helpers', () => {
  it('builds canonical page paths from optional catch-all route params', () => {
    assert.equal(pathFromSlug(undefined), '/')
    assert.equal(pathFromSlug([]), '/')
    assert.equal(pathFromSlug(['products', 'shoes']), '/products/shoes')
  })

  it('falls back to de when no default locale env is configured', () => {
    const previous = process.env.NEXT_PUBLIC_WEFTLY_DEFAULT_LOCALE
    delete process.env.NEXT_PUBLIC_WEFTLY_DEFAULT_LOCALE

    try {
      assert.equal(defaultLocale(), 'de')
    } finally {
      if (previous === undefined) {
        delete process.env.NEXT_PUBLIC_WEFTLY_DEFAULT_LOCALE
      } else {
        process.env.NEXT_PUBLIC_WEFTLY_DEFAULT_LOCALE = previous
      }
    }
  })

  it('converts Next search params into URLSearchParams preserving repeated values', () => {
    const params = toURLSearchParams({
      filter: ['one', 'two'],
      page: '3',
      empty: undefined,
    })

    assert.deepEqual(params.getAll('filter'), ['one', 'two'])
    assert.equal(params.get('page'), '3')
    assert.equal(params.has('empty'), false)
  })

  it('converts search params into stable entries for client components', () => {
    assert.deepEqual(toSearchParamEntries({ a: ['1', '2'], b: '3' }), [
      ['a', '1'],
      ['a', '2'],
      ['b', '3'],
    ])
  })

  it('resolves supported preview states only', () => {
    assert.equal(resolvePreviewState('DRAFT'), 'DRAFT')
    assert.equal(resolvePreviewState('STAGED'), 'STAGED')
    assert.equal(resolvePreviewState('PUBLISHED'), 'PUBLISHED')
    assert.equal(resolvePreviewState('draft'), undefined)
    assert.equal(resolvePreviewState(['DRAFT']), undefined)
  })

  it('identifies states backed by public content snapshots', () => {
    assert.equal(isPublicContentState('STAGED'), true)
    assert.equal(isPublicContentState('PUBLISHED'), true)
    assert.equal(isPublicContentState('DRAFT'), false)
  })

  it('dedupes configured preview parent origins and ignores invalid values', () => {
    assert.deepEqual(
      collectPreviewParentOrigins(
        'https://builder.example, nope, https://builder.example/app, http://localhost:3000',
      ),
      ['https://builder.example', 'http://localhost:3000'],
    )
  })

  it('allows only configured http origins as preview parents', () => {
    assert.equal(
      resolvePreviewParentOrigin({
        parentOrigin: 'https://builder.example/editor?page=1',
        allowedOrigins: 'https://builder.example, http://localhost:3000',
      }),
      'https://builder.example',
    )
    assert.equal(
      resolvePreviewParentOrigin({
        parentOrigin: 'https://attacker.example',
        allowedOrigins: 'https://builder.example',
      }),
      null,
    )
    assert.equal(
      resolvePreviewParentOrigin({
        parentOrigin: 'javascript:alert(1)',
        allowedOrigins: 'https://builder.example',
      }),
      null,
    )
  })

  it('keeps snapshot cache tags stable and below Next.js tag limits', () => {
    const longPath = `/${'very-long-segment/'.repeat(40)}final`
    const tag = snapshotCacheTag('de', longPath)
    const longLocaleTag = snapshotCacheTag('x'.repeat(300), '/products')

    assert.equal(tag.startsWith('public-content:de:'), true)
    assert.equal(tag.length <= 256, true)
    assert.equal(longLocaleTag.length <= 256, true)
    assert.equal(snapshotCacheTag('de', '/products'), 'public-content:de:/products')
  })
})


describe('deployment content environment', () => {
  it('keeps published content as the backwards-compatible default', () => {
    assert.equal(contentEnvironment(''), 'production')
    assert.equal(contentEnvironment('  '), 'production')
    assert.equal(contentEnvironment('production'), 'production')
  })
  it('selects staged content only through explicit deployment configuration', () => {
    assert.equal(contentEnvironment('staging'), 'staging')
    assert.equal(contentEnvironment(' staging '), 'staging')
    assert.throws(() => contentEnvironment('preview'), /WEFTLY_ENVIRONMENT/)
    assert.throws(() => contentEnvironment('DRAFT'), /WEFTLY_ENVIRONMENT/)
  })
})
