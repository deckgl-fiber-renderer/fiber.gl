## Why

The current implementation uses JSX.IntrinsicElements to declare 30+ layer-specific elements (`<scatterplotLayer>`, `<geoJsonLayer>`, etc.), which prevents TypeScript generic support for accessor functions. This makes it impossible to achieve type-safe data accessors (e.g., `getPosition`, `getFillColor`) since JSX.IntrinsicElements doesn't support generic parameters. Additionally, the global registration pattern forces all layers to be bundled together, preventing code-splitting and requiring custom layers to be manually registered via `extend()`.

## What Changes

- **BREAKING**: Replace all layer-specific intrinsic elements with a single `<layer>` element that accepts pre-instantiated Layer/View instances
- Add TypeScript generic support for accessor functions by shifting layer instantiation to user code
- Remove automatic layer registration system (`extend()` and `side-effects.ts`)
- Enable code-splitting by eliminating bundled layer imports
- Maintain backwards compatibility in v2, with deprecation warnings for old syntax
- Update reconciler to extract `props.layer` instead of constructing from catalogue
- Require explicit `id` props on all layers (document critical importance for React lifecycle)

## Capabilities

### New Capabilities

- `single-layer-element`: Single `<layer>` JSX element that accepts pre-instantiated Deck.gl Layer or View instances, enabling TypeScript generics and eliminating registration requirements
- `react-layer-lifecycle`: Documentation and patterns for proper React integration including stable IDs, updateTriggers, and layer lifecycle management

### Modified Capabilities

<!-- No existing capabilities are being modified - this is a new API pattern -->

## Impact

**Affected Packages:**

- `@deckgl-fiber-renderer/types`: Complete rewrite of JSX.IntrinsicElements interface
- `@deckgl-fiber-renderer/reconciler`: Update `createDeckglObject()` to handle `<layer>` element; deprecate but maintain catalogue system
- `@deckgl-fiber-renderer/dom`: No changes (wrapper package)
- `@deckgl-fiber-renderer/shared`: No changes

**Breaking Changes (planned for v3):**

- All layer-specific intrinsic elements removed
- `extend()` function removed
- `side-effects.ts` removed
- Users must migrate to `<layer layer={new LayerClass({...})} />` syntax

**Migration Impact:**

- All examples must be updated to demonstrate new pattern
- Documentation must emphasize stable `id` requirement
- Users need clear migration guide showing both syntaxes side-by-side
- Type safety improvements benefit users with complex data types

**External Dependencies:**

- React 19 compatibility maintained
- Deck.gl 9.1+ compatibility maintained
- No new peer dependencies required
