## Context

The current architecture uses JSX.IntrinsicElements to declare layer-specific elements, requiring global registration of all Deck.gl layers via `side-effects.ts`. This creates three major problems:

1. **Type system limitation**: JSX.IntrinsicElements doesn't support generic parameters, preventing type-safe accessor functions
2. **Bundle bloat**: All layer classes are imported regardless of usage, blocking code-splitting
3. **Registration overhead**: Custom layers require manual `extend()` calls

The reconciler operates in **persistence mode** (not mutation mode), meaning it creates new instances on every change. This aligns perfectly with Deck.gl's design philosophy that "layers are just descriptor objects that are very cheap to instantiate" and matched by ID for efficient diffing.

## Goals / Non-Goals

**Goals:**

- Enable TypeScript generics on layer accessor functions
- Eliminate layer registration requirements
- Support code-splitting and tree-shaking
- Maintain backwards compatibility in v2
- Align API with Deck.gl's recommended patterns

**Non-Goals:**

- Changing reconciler mode (stays persistence mode)
- Modifying Deck.gl layer lifecycle
- Optimizing layer instantiation (already cheap per Deck.gl)
- Supporting JSX without TypeScript (already not supported)

## Decisions

### Decision 1: Single `<layer>` element with pass-through pattern

**Choice:** Replace all intrinsic elements with `<layer layer={instance} />` that passes through user-instantiated layers.

**Rationale:**

- Preserves TypeScript generics naturally (constructors support generics, JSX.IntrinsicElements doesn't)
- Aligns with Deck.gl's expected pattern of receiving new instances each render
- Zero overhead - reconciler just extracts `props.layer` instead of constructing from catalogue
- Makes layer lifecycle explicit and transparent to users

**Alternatives considered:**

- **Auto-instantiation**: `<layer type={ScatterplotLayer} data={...} />` - Rejected because it loses generic type inference
- **Factory pattern**: `<layer factory={() => new ScatterplotLayer({...})} />` - Rejected as unnecessarily complex
- **HOC pattern**: `createLayer(ScatterplotLayer)` - Rejected because it obscures JSX usage

### Decision 2: Keep backwards compatibility in v2, remove in v3

**Choice:** Maintain catalogue system alongside new pattern, add deprecation warnings.

**Rationale:**

- Allows gradual migration without forcing breaking changes immediately
- Users can test new pattern while keeping existing code working
- Provides time to update documentation and examples
- Aligns with Semver major version practices

**Implementation:**

```ts
function createDeckglObject(type: Type, props: Props): Instance {
  if (type === "layer") {
    if (!props.layer) {
      throw new Error("<layer> element requires a 'layer' prop");
    }
    return { children: [], node: props.layer };
  }

  // Legacy path with deprecation warning
  if (process.env.NODE_ENV === "development") {
    console.warn(
      `Using deprecated ${type} element. Migrate to <layer layer={new ${toPascal(type)}({...})} />`
    );
  }

  const name = toPascal(type);
  if (!catalogue[name]) {
    throw new Error(`Unsupported element type: ${type}`);
  }
  return { children: [], node: new catalogue[name](props) };
}
```

### Decision 3: Runtime warning for missing layer IDs

**Choice:** Add development-mode warning when layers lack explicit `id` props.

**Rationale:**

- Missing IDs cause expensive reinitialization on every render
- This is the #1 footgun for users migrating to new pattern
- Cannot be enforced at type level (ID is optional in Deck.gl's types)
- Warning helps users catch this during development

**Implementation approach:**
Add check in `createDeckglObject` for `type === "layer"`:

```ts
if (process.env.NODE_ENV === "development" && props.layer && !props.layer.id) {
  console.warn(
    'Layer missing explicit "id" prop - this will cause expensive ' +
      'reinitialization on every render. Add: id: "unique-id"'
  );
}
```

### Decision 4: Support both Layer and View instances

**Choice:** Accept `Layer | View` in `props.layer`.

**Rationale:**

- Views (MapView, GlobeView, etc.) follow same pattern as layers
- Both have the same lifecycle and ID-matching behavior
- Simplifies API by not requiring separate `<view>` element
- Aligns with Deck.gl's unified Layer/View architecture

**Type definition:**

```ts
export interface DeckglElements {
  layer: {
    layer: Layer | View;
    children?: ReactNode; // For views with nested layers
  };
}
```

### Decision 5: Remove all layer imports from side-effects.ts

**Choice:** Keep `side-effects.ts` file but remove all imports, add deprecation notice.

**Rationale:**

- Breaking change staged for v3, not v2
- Users currently importing side-effects will get no-op in v2
- Clear migration path with loud deprecation message
- Allows us to mark `sideEffects: false` in package.json for v3

**Migration path:**

```ts
// v2: side-effects.ts
console.warn(
  "@deckgl-fiber-renderer/reconciler/side-effects is deprecated. " +
    "Layer registration is no longer needed. " +
    "Remove this import and use <layer layer={new LayerClass({...})} />"
);
// No actual imports

// v3: File removed entirely
```

## Risks / Trade-offs

### Risk: Users forget explicit IDs

**Impact:** Layers reinitialize on every render, causing performance issues.

**Mitigation:**

- Runtime warning in development mode
- Prominent documentation with visual examples
- Migration guide explicitly calls this out
- All examples show correct pattern with IDs

### Risk: Verbosity increase from new syntax

**Impact:** `<layer layer={new ScatterplotLayer({...})} />` is longer than `<scatterplotLayer />`.

**Trade-off accepted:**

- Type safety benefit outweighs verbosity
- Explicit layer construction is more transparent
- Matches React patterns (components aren't magic strings)
- Similar to other React renderers (react-three-fiber uses `<primitive object={...} />`)

### Risk: Breaking change concerns

**Impact:** Users must eventually migrate all code.

**Mitigation:**

- v2 supports both syntaxes side-by-side
- Clear migration guide with automated search patterns
- Deprecation warnings guide users
- Major version bump communicates breaking change

### Risk: updateTriggers confusion

**Impact:** Users may not understand when to use updateTriggers.

**Mitigation:**

- Dedicated documentation section on updateTriggers
- Examples showing common patterns
- Explain Deck.gl's accessor function handling
- Link to official Deck.gl performance guide

## Migration Plan

### Phase 1: v2 Release (Non-breaking)

1. Add `<layer>` element support to types package
2. Update reconciler to handle `type === "layer"`
3. Add runtime warnings for deprecations and missing IDs
4. Update all examples to new syntax
5. Create comprehensive migration guide
6. Update README to show new syntax as primary

**Rollback:** Remove new code, keep existing catalogue system. No breaking changes introduced.

### Phase 2: Migration Period (6-12 months)

1. Monitor adoption through npm downloads and GitHub issues
2. Help users migrate via examples and documentation
3. Consider optional eslint plugin to flag old syntax
4. Gather feedback on pain points

**Success metrics:**

- Migration guide has clear examples
- Issue tracker shows successful migrations
- No major blockers identified

### Phase 3: v3 Release (Breaking)

1. Remove all layer-specific intrinsic elements from types
2. Remove catalogue system from reconciler
3. Delete `side-effects.ts` and `extend.ts`
4. Mark `sideEffects: false` in reconciler package.json
5. Update peer dependency ranges if needed

**Rollback:** Revert to v2.x if adoption is insufficient. Major version rollback is acceptable.

## Package Changes

### @deckgl-fiber-renderer/types

**Current:**

```ts
export interface DeckglElements {
  scatterplotLayer: ScatterplotLayerProps;
  geoJsonLayer: GeoJsonLayerProps;
  // ... 30+ elements
}
```

**New (v2):**

```ts
export interface DeckglElements {
  layer: { layer: Layer | View; children?: ReactNode };

  // v2: Keep for backwards compat, mark deprecated in JSDoc
  /** @deprecated Use <layer layer={new ScatterplotLayer({...})} /> */
  scatterplotLayer: ScatterplotLayerProps;
  /** @deprecated Use <layer layer={new GeoJsonLayer({...})} /> */
  geoJsonLayer: GeoJsonLayerProps;
  // ... etc
}
```

**New (v3):**

```ts
export interface DeckglElements {
  layer: { layer: Layer | View; children?: ReactNode };
}
```

### @deckgl-fiber-renderer/reconciler

**Files modified:**

- `src/config.ts`: Update `createDeckglObject()` and `cloneInstance()`
- `src/side-effects.ts`: Add deprecation warning, remove imports (v2), delete file (v3)
- `src/extend.ts`: Add deprecation warning (v2), delete file (v3)

**No changes needed:**

- `src/renderer.ts`: Already handles layers generically
- `src/utils.ts`: Layer flattening/organization unchanged
- Other reconciler hooks: Agnostic to layer construction

## Open Questions

None - design is complete and implementation path is clear. All critical decisions have been made based on:

- Deck.gl's documented best practices
- React reconciler persistence mode patterns
- TypeScript generic type system capabilities
- User experience feedback from exploration phase
