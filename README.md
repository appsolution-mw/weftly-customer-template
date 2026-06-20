# Weftly Customer Template

A standalone Next.js site that renders published Weftly content. It installs the
Weftly SDK from npm (`@weftly/runtime`, `@weftly/loader`, `@weftly/host`) — no
database, no platform monorepo.

## Requirements

- Node >= 20.17.0
- npm 11
- A valid Weftly license key (production use; see each `@weftly/*` package LICENSE)

## Setup

    npm install
    cp .env.example .env.local   # then fill in NEXT_PUBLIC_WEFTLY_PROJECT_ID + a CDN base

## Develop / build

    npm run dev      # http://localhost:3000
    npm test
    npm run build    # next build (succeeds without env; renders DynamicStub if no snapshot)
    npm run start

## How it works

`app/page.tsx` redirects to the configured default locale, currently `de` unless
`NEXT_PUBLIC_WEFTLY_DEFAULT_LOCALE` is set.

`app/[locale]/[[...slug]]/page.tsx` fetches a published page snapshot from the
Weftly CDN via `@weftly/loader`, emits snapshot-driven metadata, and renders it
with `@weftly/runtime`'s `WebsiteRenderSurface` +
`PublicSnapshotPageTreeRenderer`.

`app/preview/[locale]/[[...slug]]/page.tsx` is the Builder preview target. It
can render staged/published snapshots and listens for live draft snapshots from
the Builder iframe protocol. Set `WEFTLY_BUILDER_ORIGINS` to the Builder origin
that may embed this app, for example `http://localhost:3000` during monorepo
development.

`lib/registry.ts` shows how to register your own block component
(`@weftly/host`) alongside the built-in registry. `@weftly/runtime` ships
precompiled CSS Modules, so it is listed in `transpilePackages` in
`next.config.ts`.

This template intentionally does not include the monorepo `apps/site` DB
fallbacks, Prisma imports, `next-intl`, sitemap DB reads, or OG image API. Those
remain platform concerns in the Builder/public app until the published SDKs
expose portable equivalents.
