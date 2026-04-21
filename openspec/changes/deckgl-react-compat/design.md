## Context

The official `@deck.gl/react` package provides React bindings for deck.gl with a component-based API. Our fiber renderer uses react-reconciler, which integrates differently with React's rendering but requires users to rewrite their code when migrating.

**Current State:**
- Our `@deckgl-fiber-renderer/dom` package exports `Deckgl` component with JSX layer syntax: `<Deckgl><layer layer={new ScatterplotLayer({...})} /></Deckgl>`
- Official API uses `<DeckGL layers={[new ScatterplotLayer({...})]} />` or JSX layers: `<DeckGL><ScatterplotLayer {...} /></DeckGL>`
- No migration path exists - users must rewrite all deck.gl code to switch

**Constraints:**
- Must not modify existing native API (non-breaking change)
- Must work with our reconciler's persistence mode architecture
- Cannot depend on `@deck.gl/react` package (creates circular dependency conceptually)
- Must maintain layer ID requirements (critical for deck.gl diffing)
- Limited to what our current reconciler supports (no positioned render callbacks)

**Stakeholders:**
- Current `@deck.gl/react` users wanting to try our renderer
- Teams with existing deck.gl codebases
- New users familiar with official API patterns

## Goals / Non-Goals

**Goals:**
- Users can import from `/compat` instead of `@deck.gl/react` with minimal code changes
- JSX layer syntax works: `<DeckGL><ScatterplotLayer /></DeckGL>`
- JSX view syntax works: `<DeckGL><MapView /></DeckGL>`
- Imperative ref methods match official API
- Context provides viewport/deck access for child components
- Clear documentation of differences and migration path

**Non-Goals:**
- 100% behavioral compatibility (internal implementation can differ)
- Positioned render callbacks: `{({viewport}) => <div>...</div>}`
- Pre-built widget components (only provide hook)
- Custom Deck class injection: `<DeckGL Deck={CustomDeck} />`
- Supporting `_customRender` prop
- Direct `canvas`/`gl` props (use `interleaved` instead)

## Decisions

### Decision 1: Package Structure - Deep Import Path

**Chosen:** Add `/compat` as deep import to existing `@deckgl-fiber-renderer/dom` package

**Rationale:**
- Keeps related code together in one package
- Users already depend on `@deckgl-fiber-renderer/dom`
- tsdown supports multiple entry points via exports field
- Tree-shakeable - users not using compat pay zero cost

**Alternatives Considered:**
- **New `@deckgl-fiber-renderer/react` package:** More obvious naming but adds maintenance overhead, extra package to publish, and splits related code
- **Separate `@deckgl-fiber-renderer/compat` package:** Clear purpose but overkill for ~10KB of wrapper code

**Implementation:**
```json
// package.json
{
  "exports": {
    ".": "./dist/index.js",
    "./compat": "./dist/compat/index.js",
    "./components": "./dist/components.js",
    "./hooks": "./dist/hooks.js"
  }
}
```

### Decision 2: JSX Layer Strategy - Thin Wrapper Components

**Chosen:** Create wrapper components that use our reconciler's `<layer>` primitive

**Rationale:**
- Our reconciler already supports `<layer layer={instance} />` pattern (recommended v2+ syntax)
- Uses reconciler's persistence mode, diffing, and lifecycle
- Simple implementation - just instantiate and pass through
- Type-safe with preserved generics
- Each wrapper is ~3 lines of code

**Example:**
```tsx
import { ScatterplotLayer as _ScatterplotLayer } from '@deck.gl/layers';

export function ScatterplotLayer(props) {
  const { children, ...layerProps } = props;
  return <layer layer={new _ScatterplotLayer(layerProps)}>{children}</layer>;
}
```

**Alternatives Considered:**
- **Extract JSX then bypass reconciler:** Matches official behavior more closely but loses reconciler benefits (efficient updates, lifecycle hooks, suspense support)
- **Dynamic proxy pattern:** Zero maintenance but less type-safe, harder to tree-shake, less explicit

**Layer Coverage:**
- Start with 15-20 most common layers manually
- Core layers (`@deck.gl/layers`): ScatterplotLayer, ArcLayer, LineLayer, GeoJsonLayer, PolygonLayer, PathLayer, IconLayer, TextLayer, ColumnLayer, GridCellLayer, PointCloudLayer, BitmapLayer, SolidPolygonLayer
- Geo layers (`@deck.gl/geo-layers`): H3HexagonLayer, S2Layer, GreatCircleLayer, TileLayer, MVTLayer
- Can add codegen script later if users need more layers

### Decision 3: DeckGL Component Architecture - Thin Adapter

**Chosen:** Wrapper around native `Deckgl` that translates props

**Rationale:**
- Reuses battle-tested native component
- Minimal code duplication
- Clear translation layer for debugging
- Easier to maintain as native component evolves

**Implementation approach:**
```tsx
export const DeckGL = forwardRef<DeckGLRef, DeckGLProps>((props, ref) => {
  const {
    children,
    ContextProvider,
    ...deckProps
  } = props;

  // Create imperative ref handle
  const deckglRef = useRef<Deck>();
  useImperativeHandle(ref, () => ({
    get deck() { return deckglRef.current; },
    pickObject: (...args) => deckglRef.current?.pickObject(...args),
    pickObjects: (...args) => deckglRef.current?.pickObjects(...args),
    pickMultipleObjects: (...args) => deckglRef.current?.pickMultipleObjects(...args),
    pickObjectAsync: (...args) => deckglRef.current?.pickObjectAsync(...args),
    pickObjectsAsync: (...args) => deckglRef.current?.pickObjectsAsync(...args),
  }));

  return (
    <CompatContextProvider ContextProvider={ContextProvider}>
      <Deckgl ref={deckglRef} {...deckProps}>
        {children}
      </Deckgl>
    </CompatContextProvider>
  );
});
```

**Alternatives Considered:**
- **Fork official implementation:** Higher compatibility but massive code duplication and maintenance burden
- **Hybrid with edge case handling:** More complex, unclear when to use which path

### Decision 4: JSX Element Handling - Let Reconciler Do The Work

**Chosen:** Pass JSX children directly to `Deckgl`, let reconciler handle extraction and organization

**Rationale:**
- Reconciler already has `flattenTree` and `organizeList` utilities (packages/reconciler/src/utils.ts)
- Layer/view wrappers create `<layer>` and `<view>` elements that reconciler processes
- Reconciler's `replaceContainerChildren` flattens tree and separates layers/views automatically
- No manual React.Children walking needed - reconciler does it correctly
- Simpler implementation - less code, fewer edge cases

**How it works:**
1. JSX layer/view wrappers render `<layer layer={instance} />` and `<view view={instance} />`
2. Reconciler processes these through `createInstance` creating Instance nodes
3. `replaceContainerChildren` (line 821 in config.ts) calls `flattenTree(newChildren)`
4. `organizeList` (line 824) separates into `{ views: [], layers: [] }`
5. Combined with layers prop via `state._passedLayers.concat(types.layers)` (line 828)

**Implementation:**
```tsx
export const DeckGL = forwardRef<DeckGLRef, DeckGLProps>((props, ref) => {
  const {
    children,
    layers: layersProp,
    views: viewsProp,
    ...deckProps
  } = props;

  // No extraction needed - just pass everything to Deckgl
  // Reconciler will handle layer/view separation automatically
  return (
    <CompatContextProvider ContextProvider={props.ContextProvider}>
      <Deckgl {...deckProps} layers={layersProp} views={viewsProp}>
        {children}
      </Deckgl>
    </CompatContextProvider>
  );
});
```

**Why this is better:**
- Reuses battle-tested reconciler logic
- Handles nested structures automatically
- Works with fragments, conditional rendering, etc.
- Less code to maintain
- No risk of drift between manual extraction and reconciler behavior

### Decision 5: Context Strategy - Wrapper Around Store

**Chosen:** Create `DeckGLContext` that reads from our existing store and formats for official API

**Rationale:**
- Our store already tracks deck instance via `useDeckgl()` hook
- Just need to format data to match official context shape
- No changes to existing store implementation
- Document limitations if store doesn't expose everything needed

**Implementation:**
```tsx
export const DeckGLContext = createContext<DeckGLContextValue>(null);

export function CompatContextProvider({ children, ContextProvider }) {
  const deckgl = useDeckgl();
  
  const contextValue = useMemo(() => {
    if (!deckgl) return null;
    
    const viewport = deckgl.getViewports()[0];
    
    return {
      viewport,
      container: deckgl.canvas?.parentElement,
      eventManager: deckgl.eventManager,
      onViewStateChange: deckgl.props.onViewStateChange,
      deck: deckgl,
      widgets: deckgl.props.widgets || []
    };
  }, [deckgl]);

  const Provider = ContextProvider || DeckGLContext.Provider;
  
  return <Provider value={contextValue}>{children}</Provider>;
}
```

**Limitations Accepted:**
- Context updates only when deck instance changes (may be less granular than official)
- May not expose all internal deck.gl properties
- Documented in migration guide

### Decision 6: Widget Support - Hook Only

**Chosen:** Provide `useWidget` hook, no pre-built widget components

**Rationale:**
- Hook is ~50 lines, widget components add 500+ lines for 20+ widgets
- Most users need 1-3 widgets, not all 20+
- Users can wrap the 2-3 widgets they need in 5 minutes
- Lower maintenance burden
- Smaller bundle size

**Implementation:**
```tsx
export function useWidget<T extends Widget, PropsT>(
  WidgetClass: { new(props: PropsT): T },
  props: PropsT
): T {
  const deckgl = useDeckgl();
  const widgetRef = useRef<T>();

  if (!widgetRef.current) {
    widgetRef.current = new WidgetClass(props);
  }

  useEffect(() => {
    widgetRef.current?.setProps(props);
  }, [props]);

  useEffect(() => {
    if (deckgl && widgetRef.current) {
      const currentWidgets = deckgl.props.widgets || [];
      deckgl.setProps({ widgets: [...currentWidgets, widgetRef.current] });

      return () => {
        const widgets = deckgl.props.widgets?.filter(w => w !== widgetRef.current);
        deckgl.setProps({ widgets });
      };
    }
  }, [deckgl]);

  return widgetRef.current!;
}
```

**User implementation:**
```tsx
import { useWidget } from '@deckgl-fiber-renderer/dom/compat';
import { ZoomWidget as BaseZoomWidget } from '@deck.gl/widgets';

function ZoomWidget(props) {
  useWidget(BaseZoomWidget, props);
  return null;
}
```

**Alternatives Considered:**
- **Pre-wrapped common widgets:** Better DX but 5-10KB added, maintenance burden
- **All widgets:** Full compatibility but 15-20KB added, high maintenance
- **Codegen widgets:** Automated but build complexity

**Dependencies:**
- `@deck.gl/widgets` as peer dependency (user installs)

### Decision 7: Type Definitions - Create Our Own

**Chosen:** Write compatible types from scratch, no dependency on `@deck.gl/react`

**Rationale:**
- Full control over type definitions
- No dependency on official package
- Can optimize for our implementation
- Can improve types where official ones are unclear

**Type Coverage:**
```tsx
// Core types
export type DeckGLProps<ViewsT = View | View[]> = Omit<
  DeckProps<ViewsT>,
  'canvas' | 'gl' | 'parent' | '_customRender'
> & {
  width?: string | number;
  height?: string | number;
  children?: ReactNode;
  ContextProvider?: Context<DeckGLContextValue>['Provider'];
};

export type DeckGLRef = {
  deck?: Deck;
  pickObject: Deck['pickObject'];
  pickObjects: Deck['pickObjects'];
  pickMultipleObjects: Deck['pickMultipleObjects'];
  pickObjectAsync: Deck['pickObjectAsync'];
  pickObjectsAsync: Deck['pickObjectsAsync'];
};

export type DeckGLContextValue = {
  viewport: Viewport;
  container: HTMLElement;
  eventManager: EventManager;
  onViewStateChange?: DeckProps['onViewStateChange'];
  deck?: Deck;
  widgets?: Widget[];
};

// Layer wrapper types
export type LayerProps<T> = T & {
  children?: ReactNode;
};
```

**Alternatives Considered:**
- **Re-export from `@deck.gl/react`:** Always in sync but requires dependency
- **Hybrid approach:** Partial re-export plus custom types, split maintenance

### Decision 8: Error Handling - Development Warnings

**Chosen:** Runtime warnings in development mode, silent in production

**Rationale:**
- Helpful during migration without breaking apps
- Can detect common mistakes (missing layer IDs, unsupported props)
- Production builds stay clean
- Can add strict mode flag later if needed

**Warning scenarios:**
```tsx
if (process.env.NODE_ENV === 'development') {
  // Warn about unsupported props
  if (props.Deck) {
    console.warn(
      '@deckgl-fiber-renderer/dom/compat: Custom Deck class not supported. ' +
      'See migration guide: https://...'
    );
  }
  
  // Warn about render callbacks
  if (typeof children === 'function') {
    console.warn(
      '@deckgl-fiber-renderer/dom/compat: Positioned render callbacks not supported. ' +
      'See migration guide: https://...'
    );
  }
}
```

**Alternatives Considered:**
- **Silent degradation:** Poor DX, confusing failures
- **Throw errors:** App breaks, frustrating for users
- **Strict mode:** Could add as opt-in later

## Risks / Trade-offs

### [Risk] JSX layer re-render behavior differs from official
**Impact:** Layers may re-initialize at different times than official bindings

**Why it happens:** Our reconciler uses persistence mode (creates new instances on every change), official bindings use mutation mode

**Mitigation:**
- Stable layer IDs prevent expensive re-initialization (our reconciler validates this)
- Document the difference in migration guide
- In practice, deck.gl handles both patterns well due to efficient ID-based diffing

### [Risk] Context may not expose all properties child components need
**Impact:** Some child components reading context may break

**Why it happens:** We map from our store to official context shape, may miss edge cases

**Mitigation:**
- Document which context properties are available
- Test with common child component patterns
- Users can fall back to our native hooks (`useDeckgl`)

### [Risk] Missing layer/view wrappers
**Impact:** Users need layers we haven't wrapped yet

**Why it happens:** Starting with 15-20 common layers, not all 40+

**Mitigation:**
- Users can easily create wrappers for missing layers (3-line pattern)
- Document how to wrap custom layers
- Add codegen script if users request it
- Priority layers cover 80%+ of use cases

### [Risk] Widget hook requires manual component creation
**Impact:** More work than official pre-built widget components

**Why it happens:** Trade-off for smaller bundle and less maintenance

**Mitigation:**
- Provide cookbook with examples of wrapping common widgets
- Pattern is simple (5 lines per widget)
- Most users only need 1-3 widgets

### [Risk] Type definitions drift from official API
**Impact:** Types may become inaccurate as deck.gl evolves

**Why it happens:** We maintain our own types instead of depending on `@deck.gl/react`

**Mitigation:**
- Types based on stable `@deck.gl/core` which changes less frequently
- Test types with real deck.gl usage
- Users report type issues via GitHub

### [Risk] Performance overhead from wrapper layer
**Impact:** Additional function calls and prop spreading

**Why it happens:** Adapter pattern adds indirection

**Mitigation:**
- Overhead is minimal (prop spreading, ref indirection)
- JSX wrappers compile to direct function calls
- Tree-shakeable when not used
- Trade-off acceptable for migration path

## Migration Plan

This is an additive change with no migration needed. Users opt-in by importing from `/compat`.

**Deployment steps:**
1. Add `/compat` directory to `packages/dom/src/`
2. Update `packages/dom/package.json` exports field
3. Add `@deck.gl/widgets` to peerDependencies
4. Build and test
5. Publish via changesets (minor version bump)
6. Update documentation site with migration guide

**Rollback:**
- Remove `/compat` from exports field
- Existing users unaffected (don't import `/compat`)
- No breaking changes

**Testing strategy:**
- Unit tests for each compat component
- Integration tests with real deck.gl layers/views
- Type tests for IntelliSense compatibility
- Manual testing with example app migrated from official API

## Open Questions

### Q1: Should we support more than 15-20 layers initially?
**Options:**
- **A:** Start with 15-20 core + geo layers (recommended)
- **B:** Add mesh + aggregation layers too (~30 total)
- **C:** Codegen all layers from start (~40 total)

**Recommendation:** Option A. Add more based on user requests. Most users need fewer than 10 layers.

### Q2: Should we provide any pre-built widget components?
**Options:**
- **A:** Hook only (current plan)
- **B:** Add 3-5 most common widgets (Zoom, Compass, Fullscreen)
- **C:** Add all widgets

**Recommendation:** Option A initially. Revisit if many users request it.

### Q3: Error handling - warnings or errors for unsupported features?
**Options:**
- **A:** Warnings only (current plan)
- **B:** Errors in development, warnings in production
- **C:** Optional strict mode

**Recommendation:** Option A. Can add strict mode later.

### Q4: Should context update more granularly?
**Options:**
- **A:** Update when deck instance changes (current plan)
- **B:** Update when viewport changes
- **C:** Update on every render

**Recommendation:** Option A. Profile if users report performance issues.

### Q5: Documentation format?
**Options:**
- **A:** Single migration guide page
- **B:** Separate pages for each feature area
- **C:** Interactive migration tool

**Recommendation:** Option B. Easier to navigate, better for SEO.
