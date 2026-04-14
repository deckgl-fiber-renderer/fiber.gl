## Context

deck.gl has two fundamental primitives that are currently both accepted by the `<layer>` element:

- **Layer**: Rendering primitive (ScatterplotLayer, GeoJsonLayer, etc.) - defines what to draw
- **View**: Viewport/camera management (MapView, OrbitView, etc.) - defines how/where to view the scene

Both are descriptor objects that are cheap to instantiate and matched by ID for diffing. The reconciler operates in persistence mode, creating new instances on every change rather than mutating existing ones.

The current unified `<layer>` element works but conflates these conceptually distinct primitives. deck.gl supports multiple views (for minimaps, split-screen, etc.), and the JSX hierarchy could eventually be used to scope layers to specific views - but only if Views and Layers are distinct elements.

## Goals / Non-Goals

**Goals:**

- Provide semantic clarity: `<view>` for viewport management, `<layer>` for rendering
- Enforce type safety: prevent passing View to `<layer>` or Layer to `<view>` at compile time
- Set foundation for future hierarchical filtering (view children scoped to that view)
- Maintain current flattening behavior and capabilities
- Clean API before v2 release (no backwards compatibility needed)

**Non-Goals:**

- Implementing hierarchical filtering now (Phase 2 - future work)
- Changing reconciler flattening behavior (`flattenTree` / `organizeList` unchanged)
- Modifying how deck.setProps receives views/layers arrays
- Supporting View-only or Layer-only rendering modes

## Decisions

### Decision 1: Dedicated `<view>` element with same structure as `<layer>`

**Choice:** Add `<view view={View}>` element that mirrors `<layer layer={Layer}>` pattern.

**Rationale:**

- **Consistency**: Both elements follow the same pass-through pattern established by single-layer-element
- **Type safety**: TypeScript can enforce `view: View` and `layer: Layer` separately at JSX level
- **Clarity**: `<view view={new MapView()}>` is immediately recognizable as viewport management
- **Children support**: Both can have children, maintaining current compositional patterns
- **Future-ready**: Distinct elements enable hierarchical filtering later without API change

**Alternatives considered:**

- **Keep unified element**: Rejected - loses semantic clarity and type safety benefits
- **Use type prop**: `<deckgl type="view" instance={...} />` - Rejected as less idiomatic React/JSX
- **Auto-detect**: Reconciler checks `instanceof View` - Rejected as runtime-only, loses TS benefits

### Decision 2: Breaking change before v2 release (no compatibility layer)

**Choice:** Make `<layer>` Layer-only and `<view>` View-only immediately, with TypeScript errors for misuse.

**Rationale:**

- v2 not yet released, so no published users to break
- Clean API from day one is better than technical debt
- Avoids maintaining deprecated union type `Layer | View`
- Forces correct usage at compile time rather than runtime warnings
- Simplifies reconciler logic (no type checking needed)

**Implementation:**

```typescript
// packages/types/src/jsx.ts
export interface DeckglElements {
  view: {
    view: View;
    children?: ReactNode;
  };

  layer: {
    layer: Layer; // Remove "| View"
    children?: ReactNode;
  };

  // Update deprecation messages
  /** @deprecated Use <view view={new MapView({...})} /> instead */
  mapView: ExtractViewProps<MapView> & { children: ReactNode };
  // ... etc for all view elements
}
```

```typescript
// packages/reconciler/src/config.ts
function createDeckglObject(type: Type, props: Props): Instance {
  // New view element
  if (type === "view") {
    if (!props.view) {
      throw new Error("<view> element requires a 'view' prop");
    }

    if (process.env.NODE_ENV === "development") {
      validateViewId(props.view);
    }

    return {
      children: [],
      node: props.view,
    };
  }

  // Updated layer element (Layer only)
  if (type === "layer") {
    if (!props.layer) {
      throw new Error("<layer> element requires a 'layer' prop");
    }

    if (process.env.NODE_ENV === "development") {
      validateLayerId(props.layer);

      // Optional: warn if View passed (should be caught by TS)
      if (isView(props.layer)) {
        console.error("View instance passed to <layer> element. Use <view view={...} /> instead.");
      }
    }

    return {
      children: [],
      node: props.layer,
    };
  }

  // Legacy deprecated elements continue working
  // ...
}
```

### Decision 3: Preserve current flattening behavior

**Choice:** Keep `flattenTree()` and `organizeList()` unchanged - hierarchy remains organizational only.

**Rationale:**

- Hierarchical filtering is Phase 2 (future enhancement)
- Current flattening behavior works correctly for all use cases
- Users can still use `layerFilter` prop for view-specific layers
- Clean separation of concerns: this change is about API clarity, not behavior change
- Easier to test and validate (no logic changes)

**Current behavior preserved:**

```tsx
// Input JSX
<Deckgl>
  <view view={new MapView({ id: 'main' })}>
    <layer layer={new ScatterplotLayer({ id: 'points' })} />
  </view>
  <view view={new MapView({ id: 'minimap' })}>
    <layer layer={new PathLayer({ id: 'routes' })} />
  </view>
</Deckgl>

// Reconciler output (unchanged)
{
  views: [MapView('main'), MapView('minimap')],
  layers: [ScatterplotLayer('points'), PathLayer('routes')]
}
// All layers render in all views (same as before)
```

### Decision 4: Update all view deprecation messages

**Choice:** Change deprecated view elements to point to `<view>` instead of `<layer>`.

**Rationale:**

- Guides users to correct element during migration
- Prevents confusion about which element to use
- Makes deprecation path explicit and clear
- Aligns deprecation warnings with new API structure

**Implementation:**

```typescript
// Before
/** @deprecated Use <layer layer={new MapView({...})} /> instead */
mapView: ExtractViewProps<MapView> & { children: ReactNode };

// After
/** @deprecated Use <view view={new MapView({...})} /> instead */
mapView: ExtractViewProps<MapView> & { children: ReactNode };
```

Runtime warnings updated similarly:

```typescript
// In createDeckglObject for legacy view elements
if (process.env.NODE_ENV === "development" && isViewType(type)) {
  console.warn(
    `Using deprecated <${type}> element. Migrate to <view view={new ${toPascal(type)}({...})} />`,
  );
}
```

### Decision 5: Maintain ID validation for both elements

**Choice:** Apply same ID validation to Views as we do for Layers.

**Rationale:**

- deck.gl matches Views by ID just like Layers
- Missing View IDs cause same issues as missing Layer IDs (re-initialization)
- Consistent development-mode warnings help users catch issues early
- View IDs are especially important for multi-view scenarios (minimap, split-screen)

**Implementation:**

```typescript
function validateViewId(view: View): void {
  if (!view.id || view.id === "unknown") {
    console.warn(
      'View missing explicit "id" prop. deck.gl requires stable IDs for efficient diffing.',
      view,
    );
  }
}
```

## Architecture

### Type System Changes

```
packages/types/src/jsx.ts
├── DeckglElements interface
│   ├── view: { view: View; children?: ReactNode }      [NEW]
│   ├── layer: { layer: Layer; children?: ReactNode }   [MODIFIED - removed | View]
│   └── [deprecated elements with updated JSDoc]
└── JSX.IntrinsicElements extends DeckglElements
```

### Reconciler Changes

```
packages/reconciler/src/config.ts
└── createDeckglObject(type, props)
    ├── type === 'view'                [NEW]
    │   ├── Validate props.view exists
    │   ├── Validate View ID (dev mode)
    │   └── Return { node: props.view, children: [] }
    │
    ├── type === 'layer'               [UPDATED]
    │   ├── Validate props.layer exists
    │   ├── Validate Layer ID (dev mode)
    │   ├── Warn if View passed (dev mode)
    │   └── Return { node: props.layer, children: [] }
    │
    └── Legacy catalogue path           [UPDATED]
        └── Update warnings for view types
```

### Flattening Pipeline (Unchanged)

```
React Tree → flattenTree() → organizeList() → deck.setProps()

flattenTree(): Recursively flattens all Instance nodes into single array
organizeList(): Splits flattened array into { views: View[], layers: Layer[] }

No changes needed - both <view> and <layer> elements produce Instance objects
that flatten and organize the same way as before.
```

## Implementation Notes

### Package Build Order

1. **types**: Update JSX interface first (other packages depend on it)
2. **reconciler**: Update createDeckglObject logic
3. **dom**: No changes needed (just wrapper)
4. **examples**: Update all View usage to new syntax

### Testing Strategy

- **Type tests**: Verify `<view view={Layer}>` produces TypeScript error
- **Type tests**: Verify `<layer layer={View}>` produces TypeScript error
- **Unit tests**: Test new `type === 'view'` branch in createDeckglObject
- **Unit tests**: Test ID validation for Views
- **Integration tests**: Verify both elements coexist and flatten correctly
- **Integration tests**: Verify deck.setProps receives correct views/layers arrays

### Migration Path for Internal Examples

Find all View usage:

```bash
grep -r "layer={new.*View" examples/
```

Replace pattern:

```tsx
# Before
<layer layer={new MapView({ id: 'main' })} />

# After
<view view={new MapView({ id: 'main' })} />
```

### Future Hierarchical Filtering (Phase 2 - Out of Scope)

When ready to implement:

1. Add flag: `<Deckgl hierarchicalViews={true}>`
2. Update `flattenTree()` to track parent View IDs
3. Auto-generate `layerFilter` from tree structure
4. Document escape hatch for "all views" layers

This change sets up the API but doesn't implement the behavior.

## References

- Archived change: `openspec/changes/archive/2026-03-24-single-layer-element` (established pass-through pattern)
- deck.gl Views: https://deck.gl/docs/api-reference/core/view
- deck.gl Multiple Views: https://deck.gl/docs/developer-guide/views#using-multiple-views
- React Reconciler: github.com/facebook/react/tree/main/packages/react-reconciler
