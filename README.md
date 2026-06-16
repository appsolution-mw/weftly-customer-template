# Weftly Customer Template

A standalone Next.js site that renders published Weftly content. It installs the
Weftly SDK from npm (`@weftly/runtime`, `@weftly/loader`, `@weftly/host`) — no
database, no platform monorepo.

## Requirements

- Node >= 20
- A valid Weftly license key (production use; see each `@weftly/*` package LICENSE)

## Setup

    npm install
    cp .env.example .env.local   # then fill in NEXT_PUBLIC_WEFTLY_PROJECT_ID + a CDN base

## Develop / build

    npm run dev      # http://localhost:3000
    npm run build    # next build (succeeds without env; renders DynamicStub if no snapshot)
    npm run start

## How it works

`app/[[...slug]]/page.tsx` fetches a published page snapshot from the Weftly CDN
via `@weftly/loader` and renders it with `@weftly/runtime`'s
`WebsiteRenderSurface` + `PublicSnapshotPageTreeRenderer`. `lib/registry.ts`
shows how to register your own block component (`@weftly/host`) alongside the
built-in registry. `@weftly/runtime` ships precompiled CSS Modules, so it is
listed in `transpilePackages` in `next.config.ts`.
