# Research Findings

This document answers `openspec/changes/deckgl-react-compat/questions.md` using only evidence from:
- the active change artifacts under `openspec/changes/deckgl-react-compat/`
- the current codebase under `packages/*`
- the current specs of record under `openspec/specs/`
- upstream `@deck.gl/react` docs and source where explicitly cited below

`examples/*` were intentionally ignored in this pass.

Where current repo evidence plus the cited upstream docs/source still do not answer a question empirically, that answer is marked **Unanswered in this pass**.

---

## 1. Which active `openspec/changes/deckgl-react-compat/*` artifacts still mention widget support, `useWidget`, or widget wrappers, and in which sections do those references appear?

The active change artifacts do not currently define widget support, `useWidget`, or a widget wrapper capability as part of this change.

Current active artifact references are limited to deferral or out-of-scope statements:
- `openspec/changes/deckgl-react-compat/proposal.md`
  - `widget wrappers and useWidget are deferred to a future dedicated change`
  - `Do not include widget wrappers or useWidget in this change`
  - documentation notes `deferred widget React wrappers`
- `openspec/changes/deckgl-react-compat/design.md`
  - `widget wrappers and useWidget are out of scope for this change`
  - `Widget wrappers or useWidget` appears in `Non-Goals`
  - `Decision 5: Remove widgets from this change completely`
  - `This change should not add @deck.gl/widgets dependencies`
- `openspec/changes/deckgl-react-compat/specs/compat-deckgl-component/spec.md`
  - widget React wrappers are described as deferred from this change
- `openspec/changes/deckgl-react-compat/specs/compat-context/spec.md`
  - widget-related context support is described as out of scope
- `openspec/changes/deckgl-react-compat/specs/compat-types/spec.md`
  - widget compat APIs are described as out of scope

Historical references remain in research-history artifacts:
- `openspec/changes/deckgl-react-compat/pr-questions.md`
- older research content that existed before this rewrite of `answers.md`

No active file named `openspec/changes/deckgl-react-compat/specs/compat-widget-hook/spec.md` exists now.

## 2. Which active `openspec/changes/deckgl-react-compat/*` artifacts still describe the older partial wrapper plan (for example the prior `15-20` layer wording), and which artifacts now define the approved inventory-backed wrapper matrix?

The older partial wrapper plan does not appear in the active proposal, design, tasks, or compat specs now.

The approved inventory-backed wrapper matrix appears in:
- `openspec/changes/deckgl-react-compat/proposal.md`
  - `Export one flat /compat entrypoint whose layer/view wrapper coverage is seeded by the existing packages/types/src/jsx.ts inventory`
  - explicit counts: 5 views, 13 `@deck.gl/layers` wrappers, 12 `@deck.gl/geo-layers` wrappers, 2 `@deck.gl/mesh-layers` wrappers
  - explicit canonical matrix under `API Surface`
- `openspec/changes/deckgl-react-compat/design.md`
  - `Decision 9: Choose broader inventory-backed wrapper coverage, but keep exports under one /compat entrypoint`
  - explicit canonical matrix under `Final wrapper/export matrix for specs generation`
- `openspec/changes/deckgl-react-compat/specs/compat-jsx-layers/spec.md`
  - explicit approved layer wrapper inventory
- `openspec/changes/deckgl-react-compat/specs/compat-jsx-views/spec.md`
  - explicit approved view wrapper inventory
- `openspec/changes/deckgl-react-compat/tasks.md`
  - implementation tasks reference the approved matrix and exact counts

Historical discussion of the older partial plan remains in `pr-questions.md` only.

## 3. Which active `openspec/changes/deckgl-react-compat/*` artifacts use the official term `Render callbacks`, and which artifacts still use older or unclear wording for function children?

Active artifacts using the official term `Render callbacks` include:
- `openspec/changes/deckgl-react-compat/proposal.md`
- `openspec/changes/deckgl-react-compat/design.md`
- `openspec/changes/deckgl-react-compat/specs/compat-deckgl-component/spec.md`
- `openspec/changes/deckgl-react-compat/tasks.md`

The active artifacts describe the syntax explicitly as `children` passed as a function, such as `{({viewport}) => ...}`.

The older unclear wording `positioned render callbacks` remains only in historical research/review material, not in the active proposal, design, tasks, or compat specs.

## 4. What migration promise is stated in the current `proposal.md`, `design.md`, and compat specs: full parity, reduced rewrite work for supported patterns, or some other scope?

The current active artifacts state a scoped migration promise: reduced rewrite work for supported patterns, not full `@deck.gl/react` parity.

Evidence:
- `openspec/changes/deckgl-react-compat/proposal.md`
  - `the migration promise is limited to reducing React-surface rewrite work for supported patterns, not full @deck.gl/react parity`
  - `Testable migration promise: an app using supported patterns can replace the DeckGL import with @deckgl-fiber-renderer/dom/compat ... and only make targeted syntax changes where fiber.gl documents a known incompatibility`
- `openspec/changes/deckgl-react-compat/design.md`
  - `Decision 4: Reframe the migration promise around React-surface rewrite reduction, not full API parity`
  - compatibility matrix row: `Full @deck.gl/react behavioral parity | Unsupported`
- `openspec/changes/deckgl-react-compat/specs/compat-deckgl-component/spec.md`
  - `Compat DeckGL scopes its migration promise to supported official patterns`
  - scenario states the specification does not claim full `@deck.gl/react` behavioral parity

## 5. What evidence in the current repo defines the official `@deck.gl/react` public surface relevant to this change, including props, ref methods, context fields, child patterns, and package export shape?

The cited upstream docs/source define the relevant public surface:
- `DeckGL` component docs and public prop/ref type:
  - `https://deck.gl/docs/api-reference/react/deckgl`
  - `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/deckgl.ts`
- context type:
  - `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/utils/deckgl-context.ts`
- package entrypoint manifest:
  - `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/package.json`
- root export surface:
  - `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/index.ts`
- JSX child semantics and extraction/positioning logic:
  - `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/utils/extract-jsx-layers.ts`
  - `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/utils/position-children-under-views.ts`
- React usage docs:
  - `https://deck.gl/docs/get-started/using-with-react`
  - `https://deck.gl/docs/api-reference/react/overview`

Taken together, those upstream sources show:
- the root package entrypoint shape
- the `DeckGL` prop and ref surface
- the official context fields
- the documented React child patterns, including `Render callbacks`
- the root-package re-exports for widget React components and `useWidget`

The current change artifacts also record the approved subset relevant to this repo in:
- `proposal.md`
- `design.md`
- `specs/compat-deckgl-component/spec.md`
- `specs/compat-context/spec.md`
- `specs/compat-ref-methods/spec.md`
- `specs/compat-types/spec.md`

## 6. What package entrypoints does official `@deck.gl/react` export today, and is there evidence of official `/layers`, `/geo-layers`, or similar subpath exports?

Upstream `modules/react/package.json` exports only the package root entrypoint.

Evidence:
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/package.json`
  - exports `"."`

Upstream `modules/react/src/index.ts` shows what the root entrypoint exports:
- `DeckGL`
- widget React components
- `useWidget`
- `DeckGLContextValue`, `DeckGLRef`, and `DeckGLProps`

Evidence:
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/index.ts`

No evidence was found in the upstream package manifest for official `@deck.gl/react/layers`, `@deck.gl/react/geo-layers`, `@deck.gl/react/mesh-layers`, or similar family subpath exports.

## 7. What layer and view coverage is already encoded in `packages/types/src/jsx.ts` through deprecated intrinsic JSX support?

`packages/types/src/jsx.ts` encodes the following deprecated intrinsic JSX names.

Views:
- `mapView`
- `orthographicView`
- `orbitView`
- `firstPersonView`
- `globeView`

Layers from `@deck.gl/layers`:
- `arcLayer`
- `bitmapLayer`
- `iconLayer`
- `lineLayer`
- `pointCloudLayer`
- `scatterplotLayer`
- `columnLayer`
- `gridCellLayer`
- `pathLayer`
- `polygonLayer`
- `geoJsonLayer`
- `textLayer`
- `solidPolygonLayer`

Layers from `@deck.gl/geo-layers`:
- `s2Layer`
- `quadkeyLayer`
- `tileLayer`
- `h3ClusterLayer`
- `h3HexagonLayer`
- `tile3DLayer`
- `terrainLayer`
- `geohashLayer`
- `greatCircleLayer`
- `tripsLayer`
- `mVTLayer`
- `mvtLayer`
- `wMSLayer`
- `wmsLayer`

Layers from `@deck.gl/mesh-layers`:
- `scenegraphLayer`
- `simpleMeshLayer`

This deprecated intrinsic inventory aligns with the approved compat wrapper matrix at the capability level. The canonical approved geo-layer wrappers are `MVTLayer` and `WMSLayer`; `mVTLayer`/`mvtLayer` and `wMSLayer`/`wmsLayer` are preserved only as documented alias compatibility, not as additional canonical wrapper inventory.

## 8. What evidence in the current codebase distinguishes native instance-first support (`<layer>` / `<view>`) from the proposed compat wrapper surface?

Current native instance-first support is defined in code and specs:
- `openspec/specs/single-layer-element/spec.md`
  - requires `<layer layer={new ScatterplotLayer(...)} />`
- `openspec/specs/view-element/spec.md`
  - requires `<view view={new MapView({ id: 'main' })} />`
- `packages/reconciler/src/config.ts`
  - contains the reconciler behavior for `<layer>` and `<view>` elements
- `packages/reconciler/src/utils.ts`
  - supports tree flattening and organization

The proposed compat wrapper surface is defined only in the active change artifacts, not yet in runtime code:
- `proposal.md`
- `design.md`
- `specs/compat-deckgl-component/spec.md`
- `specs/compat-jsx-layers/spec.md`
- `specs/compat-jsx-views/spec.md`
- `specs/compat-types/spec.md`

No current implementation files under `packages/*` define a compat runtime yet.

## 9. What official `DeckGL` prop boundary is documented upstream, and how does it differ from the current native `DeckglProps` type in `packages/types/src/react.ts`?

Upstream official `DeckGL` prop type is defined in:
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/deckgl.ts`

That upstream type is:
- `Omit<DeckProps, 'width' | 'height' | 'gl' | 'parent' | 'canvas' | '_customRender'>`
- plus React-facing props including:
  - `Deck?: typeof Deck`
  - `width?: string | number`
  - `height?: string | number`
  - `children?: React.ReactNode | DeckGLRenderCallback`
  - `ContextProvider?`

Current native fiber.gl type is defined in:
- `packages/types/src/react.ts`

That native type is:
- `DeckProps<ViewsT> & MapboxOverlayProps & { children?: ReactNode }`

Empirically visible differences:
- current native `DeckglProps` includes a broader prop bag because it combines `DeckProps` and `MapboxOverlayProps`
- upstream official `DeckGL` omits `gl`, `parent`, `canvas`, and `_customRender`
- upstream official `DeckGL` explicitly includes `ContextProvider`
- upstream official `DeckGL` allows `children` to be either `ReactNode` or a `DeckGLRenderCallback`

## 10. What imperative ref methods are documented by official `@deck.gl/react`, and which of those methods match the approved compat ref inventory in this change?

Upstream official docs/source expose the following ref surface:
- `deck`
- `pickObject`
- `pickObjects`
- `pickMultipleObjects`
- `pickObjectAsync`
- `pickObjectsAsync`

Evidence:
- `https://deck.gl/docs/api-reference/react/deckgl`
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/deckgl.ts`

The approved compat ref inventory in the active change artifacts matches that exact list.

Evidence in active artifacts:
- `proposal.md`
- `design.md`
- `specs/compat-ref-methods/spec.md`
- `specs/compat-types/spec.md`
- `tasks.md`

## 11. What context fields are documented by official `@deck.gl/react`, and which of those fields are directly available from the current fiber.gl store and hooks?

Upstream official context fields are:
- `viewport`
- `container`
- `eventManager`
- `onViewStateChange`
- `deck`
- `widgets`

Evidence:
- `https://deck.gl/docs/api-reference/react/deckgl`
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/utils/deckgl-context.ts`

Current fiber.gl store/hook evidence:
- `packages/shared/src/store.ts`
  - store fields are `deckgl` and `_passedLayers`
- `packages/dom/src/hooks.tsx`
  - `useDeckgl()` returns the deck instance

From that current code, only the deck instance is directly available through the current shared store and hook surface. The other official context fields are not directly stored in `packages/shared/src/store.ts`.

## 12. What evidence shows whether official React child semantics include more than layer/view extraction, such as `Render callbacks`, `ContextProvider`, or widget React components?

Upstream docs/source show that official React child semantics include more than layer/view extraction.

Evidence:
- `https://deck.gl/docs/api-reference/react/deckgl`
  - documents `Render callbacks`
  - documents `ContextProvider`
  - documents JSX layers, JSX views, and JSX widgets
- `https://deck.gl/docs/get-started/using-with-react`
  - documents React usage patterns with JSX layers, views, and widgets as children
- `https://deck.gl/docs/api-reference/react/overview`
  - documents widget React components and `useWidget`
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/index.ts`
  - re-exports widget React components and `useWidget` from the package root
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/utils/extract-jsx-layers.ts`
  - defines extraction logic for React children and render callbacks
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/utils/position-children-under-views.ts`
  - positions children under views and constructs context values

This is broader than the current native fiber.gl behavior, which currently centers on layer/view instances and reconciler tree organization.

## 13. What current repo evidence exists for interleaved-mode constraints that affect compat view behavior?

Current repo evidence for interleaved-mode constraints includes:
- `packages/dom/src/components.tsx`
  - standard mode creates `Deck`
  - interleaved mode creates `MapboxOverlay`
- `packages/reconciler/src/renderer.ts`
  - renderer branches between `Deck` and `MapboxOverlay`
- `packages/reconciler/src/config.ts`
  - includes the note that for interleaved mode the renderer cannot pass a `views` prop
- `openspec/specs/dom-component-testing/spec.md`
  - includes the scenario `Renders hidden div in interleaved mode`

The active change artifacts also preserve this as a compat limitation rather than claiming wrappers remove it:
- `design.md` compatibility matrix
- `specs/compat-jsx-views/spec.md`

## 14. What current repo evidence exists for stable layer ID requirements and development-time validation that may affect migration behavior?

Stable layer ID requirements and validation are evidenced in:
- `AGENTS.md`
  - states that layer IDs are mandatory for deck.gl diffing
- `openspec/config.yaml`
  - design/proposal/spec rules emphasize ID handling
- `openspec/specs/single-layer-element/spec.md`
  - requires development warning for missing layer IDs
- `packages/reconciler/src/config.ts`
  - contains runtime validation and warnings for missing IDs and invalid instance use

The active compat artifacts also preserve stable IDs as explicit requirements in compat examples:
- `proposal.md`
- `design.md`
- `specs/compat-deckgl-component/spec.md`
- `specs/compat-jsx-layers/spec.md`

## 15. Which tests already exist in `packages/dom`, `packages/reconciler`, and `packages/types` that are relevant to a compat research matrix, and which compat-specific tests do not yet exist?

Relevant existing tests include:
- `packages/dom/src/__tests__/deckgl-component.test.tsx`
- `packages/dom/src/__tests__/hooks.test.tsx`
- `packages/reconciler/src/__tests__/renderer.test.ts`
- `packages/reconciler/src/__tests__/config-instance-creation.test.ts`
- `packages/reconciler/src/__tests__/config-tree-operations.test.ts`
- `packages/reconciler/src/__tests__/config-host-context.test.ts`
- `packages/reconciler/src/__tests__/config-suspense.test.ts`
- `packages/types/src/__tests__/props-types.test-d.ts`
- `packages/types/src/__tests__/jsx-types.test-d.ts`
- `packages/types/src/__tests__/view-element-types.test-d.ts`

No current tests under `packages/*` were found for:
- a `/compat` entrypoint
- compat `DeckGL` wrapper behavior
- compat ref behavior
- compat context types or runtime behavior
- compat JSX wrapper inventories

## 16. Which source files provide the primary empirical evidence for this research pass?

Primary files used in this pass:
- `openspec/changes/deckgl-react-compat/proposal.md`
- `openspec/changes/deckgl-react-compat/design.md`
- `openspec/changes/deckgl-react-compat/tasks.md`
- `openspec/changes/deckgl-react-compat/pr-questions.md`
- `openspec/changes/deckgl-react-compat/specs/compat-deckgl-component/spec.md`
- `openspec/changes/deckgl-react-compat/specs/compat-context/spec.md`
- `openspec/changes/deckgl-react-compat/specs/compat-jsx-layers/spec.md`
- `openspec/changes/deckgl-react-compat/specs/compat-jsx-views/spec.md`
- `openspec/changes/deckgl-react-compat/specs/compat-ref-methods/spec.md`
- `openspec/changes/deckgl-react-compat/specs/compat-types/spec.md`
- `openspec/specs/single-layer-element/spec.md`
- `openspec/specs/view-element/spec.md`
- `openspec/specs/dom-component-testing/spec.md`
- `packages/types/src/jsx.ts`
- `packages/types/src/react.ts`
- `packages/dom/src/components.tsx`
- `packages/dom/src/hooks.tsx`
- `packages/reconciler/src/config.ts`
- `packages/reconciler/src/renderer.ts`
- `packages/reconciler/src/utils.ts`
- `packages/shared/src/store.ts`
- selected tests under `packages/*/src/__tests__/`

Upstream files/docs cited explicitly where needed:
- `https://deck.gl/docs/api-reference/react/deckgl`
- `https://deck.gl/docs/get-started/using-with-react`
- `https://deck.gl/docs/api-reference/react/overview`
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/package.json`
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/index.ts`
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/deckgl.ts`
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/utils/deckgl-context.ts`
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/utils/extract-jsx-layers.ts`
- `https://raw.githubusercontent.com/visgl/deck.gl/master/modules/react/src/utils/position-children-under-views.ts`

## 17. Which questions remain unanswered after reviewing the current repo and upstream `@deck.gl/react` docs/source, and why are they still unanswered?

The following evidence gaps remain.

### A. Real-world usage frequency
**Unanswered in this pass.**

The current repo and the cited upstream docs/source do not provide empirical data about how common specific `@deck.gl/react` usage patterns are in real migration targets.

Examples of still-unanswered frequency questions:
- how common official `Render callbacks` are in real apps
- how common widget React components are in real apps
- which migration patterns are most common in external consumer codebases

### B. Required compatibility breadth threshold
**Unanswered in this pass.**

The current repo plus upstream docs/source do not define an empirical threshold for when this change should count as a sufficient migration aid versus a partial adapter.

### C. Rename/scope-change decision for the slug
**Unanswered in this pass.**

The current repo shows the slug is still `deckgl-react-compat`, but the evidence reviewed here does not establish a factual rule for when the slug should be renamed.

### D. Code generation tradeoff evidence
**Unanswered in this pass.**

The current repo shows the wrapper inventory and the planning artifacts, but this pass did not produce measured evidence about when code generation would be justified relative to manual wrappers.

### E. Full runtime semantic comparison with official React bindings
**Unanswered in this pass.**

The current repo and cited upstream sources establish that official React behavior includes child positioning, context construction, and render callbacks. This pass did not execute a runtime-behavior comparison between official `@deck.gl/react` and fiber.gl across all update and nesting cases.
