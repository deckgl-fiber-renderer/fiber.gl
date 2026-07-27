## Why

Users of the official `@deck.gl/react` bindings cannot currently migrate to fiber.gl without rewriting their React entrypoint and child composition patterns. This change tightens the compatibility plan around the smallest migration surface with strong evidence behind it: a `DeckGL`-shaped wrapper, official-style ref/context types where fiber.gl can support them honestly, and JSX layer/view wrappers that lower into fiber.gl's existing instance-first `<layer>` and `<view>` primitives.

The planning pass is intentionally narrower and more evidence-driven than the previous version:
- widget wrappers and `useWidget` are deferred to a future dedicated change
- the compat story aligns with the real official package shape, where `@deck.gl/react` exports from the package root and layer classes continue coming from packages such as `@deck.gl/layers`
- the migration promise is limited to reducing React-surface rewrite work for supported patterns, not full `@deck.gl/react` parity
- wrapper/export coverage is defined from the existing `packages/types/src/jsx.ts` inventory instead of a smaller hand-picked subset
- the compat ref surface is pinned to methods confirmed for the upstream deck.gl version range already targeted by this repo

## What Changes

- Add a `/compat` deep import path to `@deckgl-fiber-renderer/dom`
- Create a `DeckGL` wrapper that adapts the official React-facing API shape onto the native `Deckgl` component
- Add compat types and context primitives that mirror the official `@deck.gl/react` public surface only where fiber.gl runtime data and update semantics can be supported and verified cleanly
- Export JSX layer and view wrapper components that bridge official-looking React element usage onto fiber.gl's existing `<layer>` and `<view>` primitives
- Audit the compat surface against the official React binding shape, including documented `Render callbacks`, `ContextProvider`, constrained ref methods, prop omissions, and the current native `DeckglProps` boundary
- Export one flat `/compat` entrypoint whose layer/view wrapper coverage is seeded by the existing `packages/types/src/jsx.ts` inventory: 5 views, 13 `@deck.gl/layers` wrappers, 12 `@deck.gl/geo-layers` wrappers, and 2 `@deck.gl/mesh-layers` wrappers; retain the existing deprecated alias coverage for `mVTLayer`/`mvtLayer` and `wMSLayer`/`wmsLayer` instead of inventing new family subpaths in this change
- Document supported, deferred, and unsupported migration patterns with a compatibility matrix

**Non-breaking**: Additive only. This change adds a compat entrypoint without modifying the existing native API or existing package entrypoints.

## Capabilities

### New Capabilities

- `compat-deckgl-component`: `DeckGL` wrapper aligned to the official root-package React entrypoint shape
- `compat-jsx-layers`: JSX layer wrapper components for migration from official React child syntax
- `compat-jsx-views`: JSX view wrapper components for migration from official React child syntax
- `compat-context`: official-style context surface for compat consumers, limited to fields and update semantics the fiber.gl runtime can verify
- `compat-ref-methods`: constrained imperative ref handle aligned with the supported subset of the official React API
- `compat-types`: TypeScript types that match the intended compat surface without depending on `@deck.gl/react`

### Modified Capabilities

_None - this change only adds new capabilities without modifying existing behavior_

## Impact

**Affected Packages:**
- `@deckgl-fiber-renderer/dom`: add `/compat` exports and compat implementation files

**New Dependencies:**
- None planned in this pass

**API Surface:**
- New deep import: `@deckgl-fiber-renderer/dom/compat`
- `/compat` is the only official compat entrypoint in this change
- Planned exports: `DeckGL`, compat context/types, the inventory-backed layer/view wrapper set, ref types
- No changes to existing native API (`Deckgl`, `useDeckgl`, `<layer>`, `<view>`, `extend`)
- Final wrapper/export matrix for this planning pass:
  - views from `@deck.gl/core`: `MapView`, `OrthographicView`, `OrbitView`, `FirstPersonView`, `GlobeView`
  - layer wrappers from `@deck.gl/layers`: `ArcLayer`, `BitmapLayer`, `IconLayer`, `LineLayer`, `PointCloudLayer`, `ScatterplotLayer`, `ColumnLayer`, `GridCellLayer`, `PathLayer`, `PolygonLayer`, `GeoJsonLayer`, `TextLayer`, `SolidPolygonLayer`
  - layer wrappers from `@deck.gl/geo-layers`: `S2Layer`, `QuadkeyLayer`, `TileLayer`, `H3ClusterLayer`, `H3HexagonLayer`, `Tile3DLayer`, `TerrainLayer`, `GeohashLayer`, `GreatCircleLayer`, `TripsLayer`, `MVTLayer`, `WMSLayer`
  - layer wrappers from `@deck.gl/mesh-layers`: `ScenegraphLayer`, `SimpleMeshLayer`
  - deprecated intrinsic alias compatibility retained in the matrix: `mVTLayer` and `mvtLayer` map to `MVTLayer`; `wMSLayer` and `wmsLayer` map to `WMSLayer`
- Final compat ref-method inventory for this planning pass: `deck`, `pickObject`, `pickObjects`, `pickMultipleObjects`, `pickObjectAsync`, `pickObjectsAsync`

**Migration Scope:**
- Target users already importing `DeckGL` from `@deck.gl/react`
- Preserve official deck.gl class imports from packages such as `@deck.gl/layers`, `@deck.gl/geo-layers`, and `@deck.gl/mesh-layers`
- Reduce rewrite work for the React entrypoint, supported JSX layer/view composition, and supported imperative refs
- Testable migration promise: an app using supported patterns can replace the `DeckGL` import with `@deckgl-fiber-renderer/dom/compat`, keep its official deck.gl class imports, and only make targeted syntax changes where fiber.gl documents a known incompatibility
- Do not include widget wrappers or `useWidget` in this change
- Treat official `Render callbacks` (`children` passed as a function, such as `{({viewport}) => ...}`) as unsupported in this change

**Testing:**
- Compat-focused unit, integration, and type coverage under `packages/dom`
- Parity tests for supported official patterns and explicit tests for documented unsupported/deferred patterns
- Coverage tests should verify the declared wrapper/export matrix and the exact compat ref-method inventory above against the supported upstream deck.gl range already targeted by the repo (`>=9.1`, currently locked to `9.3.1` in this workspace)

**Documentation:**
- Migration guide from `@deck.gl/react` to `/compat`
- Compatibility matrix for supported, deferred, and unsupported patterns
- Wrapper/export matrix covering the approved `/compat` layer and view inventory
- Known limitations and workarounds, including explicit entries for deferred widget React wrappers, unsupported official `Render callbacks`, partial context parity, and interleaved-mode caveats
