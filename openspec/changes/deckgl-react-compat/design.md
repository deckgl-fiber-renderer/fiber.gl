---
change: deckgl-react-compat
specs_touched: [compat-deckgl-component, compat-jsx-layers, compat-jsx-views, compat-context, compat-ref-methods, compat-types]
decisions:
  - id: D1
    choice: Keep the existing change slug but switch the compat delivery target to a dedicated `@deckgl-fiber-renderer/compat` package.
    rationale: The work still targets React compatibility migration, and the needed reset is package shape and scope rather than change identity.
    alternatives: [Create a new change slug, Keep a `@deckgl-fiber-renderer/dom/compat` deep import]
  - id: D2
    choice: Model compat around the official `@deck.gl/react` package root rather than nonexistent subpath exports.
    rationale: Upstream `@deck.gl/react` exports from the package root, and layer classes continue to come from deck.gl layer packages.
    alternatives: [Mirror `@deck.gl/react/layers`-style subpaths, Treat subpath parity as required]
  - id: D3
    choice: Lower compat JSX layer/view wrappers into fiber.gl's existing `<layer>` and `<view>` primitives.
    rationale: The native runtime is already instance-first and the reconciler already handles validation, flattening, and organization for those primitives.
    alternatives: [Build a separate React extraction pipeline, Bypass native primitives with a parallel renderer path]
  - id: D4
    choice: Phrase migration as supported-pattern rewrite reduction, not full API parity.
    rationale: Known unsupported official features and current runtime evidence do not justify claiming universal interchangeability.
    alternatives: [Promise one-import full parity, Keep vague minimal-code-change wording]
  - id: D5
    choice: Remove widget wrappers and `useWidget` from this change.
    rationale: PR review and explicit user direction moved widgets to a future dedicated change.
    alternatives: [Keep widgets in scope, Implement `useWidget` only]
  - id: D6
    choice: Use official `Render callbacks` terminology and keep them out of scope.
    rationale: The upstream term is clearer, and current fiber.gl runtime does not support the needed child-positioning/context behavior cleanly.
    alternatives: [Keep ambiguous positioned-render-callback wording, Attempt support in this change]
  - id: D7
    choice: Match the official public prop/ref surface only where evidence is clear.
    rationale: Documented upstream prop omissions, `ContextProvider`, and constrained ref methods support a precise compat boundary.
    alternatives: [Forward the full native prop bag, Guess at undocumented parity]
  - id: D8
    choice: Treat context parity as partial and explicit.
    rationale: fiber.gl currently exposes the deck instance but not the full official context object or update semantics.
    alternatives: [Promise full context parity now, Omit compat context entirely]
  - id: D9
    choice: Use broader inventory-backed wrapper coverage with a dedicated compat package plus deck.gl-family subpath exports.
    rationale: The prior curated layer plan was too narrow, and the existing `packages/types/src/jsx.ts` inventory plus requested 1:1 package-family mapping justify a dedicated package with explicit subpaths.
    alternatives: [Keep curated manual coverage, Keep one flat entrypoint only]
  - id: D10
    choice: Keep views, `DeckGL`, context, and shared types at the compat package root while mapping layer wrappers to family subpaths.
    rationale: The requested 1:1 mapping applies naturally to deck.gl layer package families, while views belong more naturally at the root alongside `DeckGL` and shared compat APIs.
    alternatives: [Add a separate compat views/core subpath, Put all wrappers back under the root entrypoint]
  - id: D11
    choice: Add development-only runtime warnings for detectable unsupported compat usage, silent in production.
    rationale: Migration warnings help users discover unsupported patterns without breaking applications, while production output should remain clean.
    alternatives: [Throw runtime errors for unsupported usage, Stay fully silent in all environments]
  - id: D12
    choice: Treat omitted deck.gl props, methods, context fields, widget APIs, hooks, and wrapper families as explicit review items rather than silent omissions.
    rationale: A compat package can otherwise imply broader parity than intended; explicit review callouts keep exclusions visible and testable.
    alternatives: [Rely on absence from exports alone, Delay exclusions review until implementation]
---

## Context

The official `@deck.gl/react` package exposes a React-first `DeckGL` API from the package root. Official deck.gl usage keeps JSX layer classes in packages such as `@deck.gl/layers`; `@deck.gl/react` itself does not mirror those module families via subpath exports. Its public React surface also includes:
- a `DeckGL` prop shape that omits low-level `gl`, `canvas`, `parent`, and `_customRender`
- `ContextProvider`
- documented `Render callbacks` as function children
- a constrained ref surface rather than arbitrary instance mutation

fiber.gl already has a different native center of gravity:
- the runtime is instance-first
- layers already work via `<layer layer={new SomeLayer(...)} />`
- views already work via `<view view={new SomeView(...)} />`
- the reconciler already flattens and organizes nested layer/view children
- the shared store currently exposes the deck instance, but not the full official React context shape directly

This redesign pass refreshes the change around those facts and the current PR review direction:
- widget wrappers and `useWidget` are out of scope for this change
- the previous partial layer-coverage plan was likely too narrow for the stated migration goal
- the prior wording around function-children support needs to use official terminology and user-visible syntax
- compat should ship as a dedicated `@deckgl-fiber-renderer/compat` package instead of a deep import on `@deckgl-fiber-renderer/dom`
- layer wrappers should map onto deck.gl family subpaths where that mapping is natural, while views stay at the compat package root
- omitted or unsupported deck.gl APIs must be explicitly called out for review
- detectable unsupported migration patterns should produce development-only warnings, not production noise

## Goals / Non-Goals

**Goals:**
- Define a compat surface that materially reduces migration work for existing `@deck.gl/react` users
- Add a dedicated `@deckgl-fiber-renderer/compat` package with package-family subpath exports that feel concrete and reviewable
- Add a `DeckGL` wrapper that aligns with the official root-package API shape where fiber.gl can support it honestly
- Reuse fiber.gl's existing `<layer>` and `<view>` primitives to support official-style JSX layer/view composition
- Provide compat typings, context, and ref methods that match the supported runtime surface
- State unsupported, excluded-for-review, and deferred patterns in official terms users will recognize
- Add development-only warning behavior for detectable unsupported compat usage

**Non-Goals:**
- 100% behavioral compatibility with official `@deck.gl/react`
- Widget wrappers or `useWidget`
- Changing fiber.gl's native instance-first API direction
- Introducing new example apps in this planning pass
- Supporting official `Render callbacks` in this change
- Exposing low-level `gl`, `canvas`, `parent`, or `_customRender` through the compat API

## Decisions

### Decision 1: Keep the existing change slug, but move compat delivery to a dedicated package

**Chosen:** Continue using `openspec/changes/deckgl-react-compat` but deliver compat through a new `@deckgl-fiber-renderer/compat` package.

**Rationale:**
- The active work still targets React-compatibility for deck.gl migration.
- The key reset is scope, not identity: this pass removes widget scope and tightens the migration claims.
- Keeping the slug avoids churn while the artifacts are being refreshed in place.

**Consequence:**
- The artifacts must stop promising all previously listed compat features.
- Future widget work should happen in a separate change rather than being left as partially planned work here.

### Decision 2: Model compat around the official package root while still offering deck.gl-family subpath mapping where it improves migration clarity

**Chosen:** Treat the official package root as the compatibility anchor.

**Rationale:**
- Official `@deck.gl/react` exports from the package root rather than from subpaths like `/layers`.
- Official usage keeps JSX layer classes sourced from packages such as `@deck.gl/layers`.
- The compat surface should therefore focus first on the `DeckGL` root import story and the child/ref/context behavior around it.

**Consequence:**
- The design should not claim parity with nonexistent `@deck.gl/react/layers`-style imports.
- However, the compat package may still provide `@deckgl-fiber-renderer/compat/layers`, `/geo-layers`, `/aggregation-layers`, and `/mesh-layers` as a migration convenience and package-shape contract.
- Views, `DeckGL`, context, and shared types remain at the compat package root rather than being forced into extra subpaths.

### Decision 3: Build on fiber.gl's native instance-first primitives instead of bypassing them

**Chosen:** Any compat JSX layer/view wrappers should lower into fiber.gl's existing `<layer>` and `<view>` elements.

**Rationale:**
- The native runtime already centers on pre-instantiated deck.gl objects.
- The reconciler already validates, flattens, and organizes nested layer/view trees.
- Reusing those primitives preserves the existing architecture instead of creating a parallel React extraction pipeline.

**Implementation direction:**
- `DeckGL` remains a thin React-facing adapter over native `Deckgl`.
- compat layer wrappers instantiate official deck.gl layer classes and render `<layer layer={instance} />`.
- compat view wrappers instantiate view classes and render `<view view={instance} />`.

**Consequence:**
- The compat design is intentionally adapter-based, not a fork of the official renderer internals.
- Migration messaging must explain that fiber.gl stays instance-first underneath even when official-style JSX wrappers are provided.

### Decision 4: Reframe the migration promise around React-surface rewrite reduction, not full API parity

**Chosen:** The refreshed change should promise reduced React-side rewrite work, not blanket "change one import and everything works" parity.

**Testable migration promise:**
- for supported patterns, a consumer can replace the `DeckGL` import with `@deckgl-fiber-renderer/dom/compat`
- keep official deck.gl class imports from their existing deck.gl packages
- preserve imperative picking flows through the constrained compat ref surface
- only perform targeted syntax rewrites for patterns explicitly listed as unsupported or deferred in the compatibility matrix

**Rationale:**
- The previous artifacts overreached given known unsupported official features.
- The current store/runtime evidence does not justify claiming full behavior parity.
- PR review already exposed that incomplete layer coverage and vague non-goal wording weakened the old migration story.

**Consequence:**
- Proposal and later specs/tasks should frame compatibility in terms of supported migration patterns, not universal interchangeability.
- Unsupported official patterns must be called out explicitly.

### Decision 5: Remove widgets from this change completely

**Chosen:** Exclude widget wrappers and `useWidget` from the refreshed design.

**Rationale:**
- PR review explicitly rejected widget wrappers in this change.
- The user explicitly deferred widget work to a dedicated future change.
- Keeping widget content here would blur scope and imply work the current design no longer intends to deliver.

**Consequence:**
- This change should not add `@deck.gl/widgets` dependencies.
- Widget support should only appear in these artifacts as a deferred item in limitation/scoping language, not as a planned capability.

### Decision 6: Use the official term `Render callbacks` for function children and keep them out of scope

**Chosen:** Refer to function children using the official `Render callbacks` terminology and show the user-visible syntax when documenting the non-goal.

**Rationale:**
- The prior term `positioned render callbacks` was unclear in PR review.
- Official deck.gl documentation already names this feature `Render callbacks`.
- The current fiber.gl runtime does not expose the same child-positioning/context machinery needed to promise that feature cleanly.

**Canonical non-goal wording direction:**
- Unsupported in this change: `children` passed as a function, such as `{({viewport}) => ...}`
- Refer to them as official `Render callbacks` in docs and specs.

**Consequence:**
- Later artifacts should use official terminology consistently.
- This unsupported pattern remains visible enough that migration docs need a specific entry for it.

### Decision 7: Match the official public prop/ref surface where evidence is clear

**Chosen:** Align the compat API with the official public React surface in the areas already confirmed by research.

**Confirmed upstream shape to reflect:**
- omit low-level `gl`, `canvas`, `parent`, and `_customRender` from public compat props
- include `ContextProvider`
- include official-style constrained ref methods (`pickObject`, `pickObjects`, `pickMultipleObjects`, `pickObjectAsync`, `pickObjectsAsync`) plus `deck`
- keep the wrapper centered on `DeckGL` at the root compat entrypoint

**Version check used for this decision:**
- the repo targets deck.gl peer ranges of `>=9.1` in `pnpm-workspace.yaml`
- the current workspace lock resolves deck.gl packages to `9.3.1`
- the researched upstream `@deck.gl/react` public ref surface for that supported range includes exactly: `deck`, `pickObject`, `pickObjects`, `pickMultipleObjects`, `pickObjectAsync`, `pickObjectsAsync`
- no broader imperative compat API is planned in this change

**Rationale:**
- These are concrete, documented parts of the official public surface.
- They align with the migration story better than forwarding the entire native prop bag.

**Consequence:**
- Compat types should be defined intentionally rather than by directly re-exporting native `DeckglProps`.
- The wrapper needs an explicit translation boundary between the compat API and the native runtime.

### Decision 8: Treat context parity as partial and explicit

**Chosen:** Promise only a partial official-style context surface in this change.

**Supported promise now:**
- provide a compat context type/provider surface
- include `deck` parity as the required field
- include additional official fields only if implementation can derive and update them with documented semantics

**Do not promise now:**
- full parity for `viewport`, `container`, `eventManager`, `onViewStateChange`, or `widgets`
- official timing/update semantics for those fields until proven by implementation

**Rationale:**
- fiber.gl's shared store currently exposes `deckgl`, not the full official context object.
- `useDeckgl()` returns only the deck instance today.
- Official React context includes `viewport`, `container`, `eventManager`, `onViewStateChange`, and `widgets`, which require runtime-derived values beyond the current store.

**Consequence:**
- Later specs must verify context field presence and update semantics separately.
- Migration docs should describe context parity as partial until those fields are implemented and tested.

### Decision 9: Choose broader inventory-backed wrapper coverage with a dedicated compat package and family subpaths

**Chosen:** Do not use a small curated manual wrapper set as the contract. Use a broader wrapper inventory derived from existing evidence, delivered through a dedicated compat package with family subpath exports for layer wrappers.

**What this resolves:**
- between the reviewed options, the contract is closer to a broader inventory than to a hand-picked manual subset
- add explicit compat family entrypoints for layer wrappers where they map cleanly to existing deck.gl packages
- keep views at the package root rather than inventing a separate views/core subpath for this change
- wrapper breadth should be defined from the existing layer/view inventory already encoded in `packages/types/src/jsx.ts`, not from an ad hoc popularity list

**Final wrapper/export matrix for specs generation:**
- export `DeckGL`, compat context/types/ref types, and the 5 approved view wrappers from `@deckgl-fiber-renderer/compat`
- include 5 view wrappers backed by the current `@deck.gl/core` inventory:
  - `MapView`
  - `OrthographicView`
  - `OrbitView`
  - `FirstPersonView`
  - `GlobeView`
- export 13 layer wrappers from `@deckgl-fiber-renderer/compat/layers`, backed by the current `@deck.gl/layers` inventory:
  - `ArcLayer`
  - `BitmapLayer`
  - `IconLayer`
  - `LineLayer`
  - `PointCloudLayer`
  - `ScatterplotLayer`
  - `ColumnLayer`
  - `GridCellLayer`
  - `PathLayer`
  - `PolygonLayer`
  - `GeoJsonLayer`
  - `TextLayer`
  - `SolidPolygonLayer`
- export 12 canonical layer wrappers from `@deckgl-fiber-renderer/compat/geo-layers`, backed by the current `@deck.gl/geo-layers` inventory:
  - `S2Layer`
  - `QuadkeyLayer`
  - `TileLayer`
  - `H3ClusterLayer`
  - `H3HexagonLayer`
  - `Tile3DLayer`
  - `TerrainLayer`
  - `GeohashLayer`
  - `GreatCircleLayer`
  - `TripsLayer`
  - `MVTLayer`
  - `WMSLayer`
- export 2 layer wrappers from `@deckgl-fiber-renderer/compat/mesh-layers`, backed by the current `@deck.gl/mesh-layers` inventory:
  - `ScenegraphLayer`
  - `SimpleMeshLayer`
- export 5 layer wrappers from `@deckgl-fiber-renderer/compat/aggregation-layers`, aligned to `@deck.gl/aggregation-layers`:
  - `ScreenGridLayer`
  - `HexagonLayer`
  - `ContourLayer`
  - `GridLayer`
  - `HeatmapLayer`
- keep non-layer exports from `@deck.gl/aggregation-layers` out of the JSX wrapper inventory for this change:
  - `_AggregationLayer`
  - `WebGLAggregator`
  - `CPUAggregator`
  - aggregator helper/type exports
- preserve deprecated intrinsic alias compatibility in the planning matrix without turning aliases into separate canonical wrapper families:
  - `mVTLayer` and `mvtLayer` both map to `MVTLayer`
  - `wMSLayer` and `wmsLayer` both map to `WMSLayer`

**Rationale:**
- PR review directly challenged the sufficiency of the old `15-20 most common layers` plan.
- Official `@deck.gl/react` itself exports only from the package root, so mirrored family subpaths are not required for source-shape parity.
- The repo already has a concrete legacy inventory spanning views plus core, geo, and mesh layer families in `packages/types/src/jsx.ts`, which is stronger evidence than guessing at a smaller subset.

**Consequence:**
- Later specs/tasks should implement exactly this wrapper/export matrix unless a new planning revision changes scope.
- Specs generation no longer needs a separate wrapper-inventory discovery step.
- This change stays scoped to a dedicated compat package rooted at `@deckgl-fiber-renderer/compat`, with family subpaths for layer wrappers and root exports for views/shared APIs.
- Whether wrappers are hand-authored or generated remains an implementation detail, not a planning commitment.
- Excluded or deferred APIs must be explicitly listed for review, not hidden by the package layout.

## Compatibility Matrix

| Pattern | Status in this change | Notes |
| --- | --- | --- |
| `import { DeckGL } from '@deck.gl/react'` → `import { DeckGL } from '@deckgl-fiber-renderer/compat'` | Supported | Root compat package is the supported React migration entrypoint in this change. |
| Layer wrapper imports from compat family subpaths such as `@deckgl-fiber-renderer/compat/layers`, `@deckgl-fiber-renderer/compat/geo-layers`, and `@deckgl-fiber-renderer/compat/mesh-layers` | Supported | Compat layer wrappers map to family subpaths, while views stay at the package root. |
| Official deck.gl class imports from packages such as `@deck.gl/layers`, `@deck.gl/geo-layers`, `@deck.gl/aggregation-layers`, and `@deck.gl/mesh-layers` | Supported where explicitly documented | Consumers may keep importing classes from official deck.gl packages where compat support is declared; exclusions must be called out explicitly for review. |
| JSX layer composition through the approved wrapper matrix | Supported | Limited to the inventory-backed wrappers declared in this change. Stable layer IDs remain explicit. |
| JSX view composition through the approved wrapper matrix | Supported | Limited to `MapView`, `OrthographicView`, `OrbitView`, `FirstPersonView`, and `GlobeView`. |
| Compat imperative refs: `deck`, `pickObject`, `pickObjects`, `pickMultipleObjects`, `pickObjectAsync`, `pickObjectsAsync` | Supported | Exact inventory is fixed for the supported upstream deck.gl range already targeted by the repo. |
| `ContextProvider` participation | Supported with limits | Supported only within the partial compat context surface defined in this change. |
| Compat context parity for `deck` | Supported | `deck` is the required supported parity field. |
| Compat context parity for `viewport`, `container`, `eventManager`, `onViewStateChange`, `widgets` | Unsupported unless explicitly verified later in implementation | This change does not promise full official context field or timing parity. |
| Official `Render callbacks` (`children` as a function, such as `{({viewport}) => ...}`) | Unsupported | Use official terminology and document the syntax explicitly. |
| Widget React wrappers such as `<ZoomWidget />` | Deferred | Not part of this change; leave widget compatibility to a future dedicated change. |
| `useWidget` | Deferred | `https://deck.gl/docs/api-reference/react/use-widget` documents it upstream; this change must call out its exclusion explicitly for review. |
| Interleaved mode view behavior beyond existing native constraints | Limited | Compat wrappers do not remove the current native interleaved-mode caveats around views. |
| `@deckgl-fiber-renderer/compat/aggregation-layers` canonical layer wrappers (`ScreenGridLayer`, `HexagonLayer`, `ContourLayer`, `GridLayer`, `HeatmapLayer`) | Supported | Limited to the public layer exports of `@deck.gl/aggregation-layers` that fit the compat JSX wrapper model. |
| `@deck.gl/aggregation-layers` non-layer exports such as `_AggregationLayer`, `WebGLAggregator`, `CPUAggregator`, and aggregator helper/type exports | Excluded for review | These are not part of the JSX wrapper inventory for this change and must not be implied by the family subpath. |
| Unsupported or omitted `DeckGL` props, context fields, and imperative methods outside the approved compat subset | Excluded for review | The change must list them explicitly instead of implying full parity. |
| Full `@deck.gl/react` behavioral parity | Unsupported | The migration promise is scoped to supported patterns only. |

## Risks / Trade-offs

### [Risk] Compat claims outpace what the runtime actually supports
**Impact:** Users may expect official behavior that fiber.gl does not yet match.

**Mitigation:**
- Narrow the top-level migration promise.
- Track supported, deferred, and unsupported patterns explicitly.
- Avoid vague wording such as "minimal code changes" without a scoped explanation.

### [Risk] Context behavior may diverge from official React expectations
**Impact:** Consumers relying on viewport/container/event-manager context semantics may see differences.

**Mitigation:**
- Treat context parity as a verified surface, not an assumed one.
- Document context limitations clearly if runtime plumbing remains partial.

### [Risk] Layer/view coverage may still be too narrow for credible migration
**Impact:** Users may hit missing wrapper/export gaps early.

**Mitigation:**
- Carry the breadth question forward into the next planning stage.
- Use the existing intrinsic inventory and official package families to define a concrete coverage matrix before implementation.

### [Risk] Unsupported official `Render callbacks` reduce migration completeness
**Impact:** Some official React apps will still need targeted rewrites.

**Mitigation:**
- Name the feature exactly as official docs do.
- Provide explicit migration guidance instead of letting this appear as accidental breakage.

## Migration Plan

This remains an additive change. Users would opt in via `@deckgl-fiber-renderer/compat`.

The refreshed planning direction is:
1. match the official root-level `DeckGL` story first
2. support official-style JSX layer/view migration on top of native `<layer>` / `<view>` primitives
3. document unsupported/deferred official patterns clearly
4. keep widget migration out of this change

## Design Review Checkpoint

The next planning phase should treat the following as resolved for scope and wording:

1. wrapper coverage should be inventory-backed and broader than the old curated plan
2. this change delivers a dedicated compat package rooted at `@deckgl-fiber-renderer/compat`, with family subpaths for layer wrappers and views kept at the package root
3. context parity is partial for now and must not promise full official update semantics beyond verified fields
4. the migration promise must be phrased as supported-pattern rewrite reduction, with targeted rewrites only for documented incompatibilities
5. the compatibility matrix must include explicit rows for:
   - deferred widget JSX/wrapper support
   - unsupported official `Render callbacks` (`children` as a function, e.g. `{({viewport}) => ...}`)
   - partial context parity, including `deck` as supported and broader official fields as unverified unless later proven in implementation
   - interleaved-mode caveats that remain inherited from the native renderer

Residual open issues:
- aggregation-layer wrapper coverage still needs to be stated explicitly as supported, deferred, or excluded-for-review in the specs/tasks rather than inferred from package shape alone
- no blocking planning gaps remain for specs generation on root package direction, family subpath direction, or compat ref methods
- any future expansion beyond the declared wrapper/export matrix or ref-method inventory should happen through a follow-up planning change, not implicitly during specs generation
