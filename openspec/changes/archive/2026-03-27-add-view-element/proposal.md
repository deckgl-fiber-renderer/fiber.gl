## Why

The current `<layer>` element accepts both Layer and View instances (`layer: Layer | View`), which conflates two conceptually distinct primitives in deck.gl:

1. **Layers**: Rendering primitives that define what to draw (ScatterplotLayer, GeoJsonLayer, etc.)
2. **Views**: Viewport/camera management that defines where and how to view the scene (MapView, OrbitView, etc.)

This creates three problems:

1. **Semantic confusion**: `<layer layer={new MapView()}>` reads awkwardly and doesn't communicate that this is viewport management, not a rendering primitive
2. **Type safety limitation**: A single union type `Layer | View` prevents enforcing which element accepts which type at the JSX level
3. **Future hierarchy constraints**: When implementing hierarchical view filtering (layers scoped to specific views), having distinct elements makes the parent-child relationship explicit and semantically meaningful

Additionally, deck.gl supports multiple views for use cases like minimaps, split-screen, and multi-viewport layouts. A dedicated `<view>` element makes these relationships declarative and clear.

## What Changes

- **BREAKING**: Split `<layer>` element into two distinct elements:
  - `<layer layer={Layer}>` - Only accepts Layer instances
  - `<view view={View}>` - Only accepts View instances
- Update JSX type definitions to enforce Layer/View separation at compile time
- Update all view-related deprecation messages to point to `<view>` instead of `<layer>`
- Maintain current flattening behavior - hierarchy remains organizational only
- All layers still render in all views unless filtered via `layerFilter` prop
- Sets foundation for future hierarchical filtering without changing current capabilities

## Capabilities

### New Capabilities

- `view-element`: Dedicated `<view>` JSX element for deck.gl View instances, providing semantic clarity and type safety for viewport/camera management

### Modified Capabilities

- `single-layer-element`: The `<layer>` element now only accepts Layer instances (no longer accepts View instances)

## Impact

**Affected Packages:**

- `@deckgl-fiber-renderer/types`: Update `DeckglElements` interface to split `layer` and `view` types
- `@deckgl-fiber-renderer/reconciler`: Add `type === 'view'` branch in `createDeckglObject()`; update deprecation warnings for view elements
- `@deckgl-fiber-renderer/dom`: No changes (wrapper package)
- `@deckgl-fiber-renderer/shared`: No changes

**Breaking Changes (v2 - before first release):**

- `<layer layer={View} />` no longer valid - TypeScript error "View is not assignable to Layer"
- Users must migrate to `<view view={View} />` for all View instances
- All view-specific deprecated elements (`<mapView>`, etc.) now point to `<view>` in migration path

**Migration Impact:**

- All examples using Views must be updated to `<view>` element
- Documentation must clearly distinguish between layer and view elements
- Migration guide needs section on Layer vs View separation
- Users benefit from clearer API and better type safety

**External Dependencies:**

- React 19 compatibility maintained
- Deck.gl 9.1+ compatibility maintained (Views and Layers still passed separately to deck.setProps)
- No new peer dependencies required

**Future Considerations:**

- Sets foundation for hierarchical view filtering: `<view>` children could be scoped to that view only
- Enables future optimizations: reconciler can handle Views and Layers differently if needed
- Clearer migration path if deck.gl ever changes View/Layer APIs
