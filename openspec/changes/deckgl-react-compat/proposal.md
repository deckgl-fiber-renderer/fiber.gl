## Why

Users of the official `@deck.gl/react` bindings can't migrate to our fiber renderer without rewriting their code. A compatibility layer lets them switch by changing one import, then migrate to the native API gradually.

## What Changes

- Add `/compat` deep import path to `@deckgl-fiber-renderer/dom` package exporting backwards-compatible API
- Create `DeckGL` component wrapper that adapts official prop API to our native `Deckgl` component
- Implement `DeckGLContext` that exposes viewport, deck instance, and eventManager to child components
- Export JSX layer wrapper components (ScatterplotLayer, ArcLayer, etc.) that bridge React elements to our reconciler's `<layer>` primitive
- Export JSX view wrapper components (MapView, FirstPersonView, etc.) using our reconciler's `<view>` primitive
- Implement `useWidget` hook for deck.gl widget integration (no pre-built widget components)
- Add imperative ref methods (`pickObject`, `pickObjects`, `pickObjectAsync`, etc.) that match the official API
- Create compatible TypeScript type definitions (no dependency on `@deck.gl/react`)
- Document API differences, migration patterns, and unsupported features

**Non-breaking**: Additive only - adds new `/compat` export path without modifying existing native API

## Capabilities

### New Capabilities

- `compat-deckgl-component`: DeckGL component wrapper that translates official API props to our native Deckgl component
- `compat-jsx-layers`: JSX layer wrapper components (15+ core layers from `@deck.gl/layers` and `@deck.gl/geo-layers`)
- `compat-jsx-views`: JSX view wrapper components (MapView, FirstPersonView, OrthographicView, OrbitView)
- `compat-context`: DeckGLContext provider that exposes viewport, deck instance, eventManager to child components
- `compat-widget-hook`: useWidget hook for widget lifecycle management and integration
- `compat-ref-methods`: Imperative ref handle that exposes picking methods and deck instance access
- `compat-types`: TypeScript type definitions that match the official `@deck.gl/react` API surface

### Modified Capabilities

_None - this change only adds new capabilities without modifying existing behavior_

## Impact

**Affected Packages:**
- `@deckgl-fiber-renderer/dom`: Add `/compat` directory and package.json export entry

**New Dependencies:**
- `@deck.gl/widgets` (peer dependency for useWidget hook)

**API Surface:**
- New deep import: `@deckgl-fiber-renderer/dom/compat`
- Exports: `DeckGL`, `useWidget`, `DeckGLContext`, layer components, view components, types
- No changes to existing native API (`Deckgl`, `useDeckgl`, `extend`)

**Bundle Impact:**
- Compat layer adds ~8-10KB minified (layer/view wrappers, context, ref adapter)
- Tree-shakeable when not imported
- Users only pay cost if they use `/compat` import

**Testing:**
- New test files under `packages/dom/src/compat/__tests__/`
- Integration tests that validate official API patterns work correctly
- Type tests that verify IntelliSense compatibility

**Documentation:**
- Migration guide from `@deck.gl/react` to `/compat` to native API
- API compatibility matrix (what works identically, differently, or not at all)
- Widget implementation cookbook
- Known limitations and workarounds
