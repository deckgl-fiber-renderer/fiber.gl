---
change: deckgl-react-compat
specs_touched: [compat-deckgl-component, compat-jsx-layers, compat-jsx-views, compat-context, compat-ref-methods, compat-types]
decisions:
  - id: D1
    choice: Keep the existing change slug and `@deckgl-fiber-renderer/dom/compat` entrypoint while narrowing scope.
    rationale: The work still targets React compatibility migration, and the needed reset is scope rather than identity.
    alternatives: [Create a new change slug, Preserve the prior broader scope]
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
    choice: Use broader inventory-backed wrapper coverage under one `/compat` entrypoint.
    rationale: The prior curated 15-20 layer plan was too narrow, and the existing `packages/types/src/jsx.ts` inventory provides a stronger evidence base without requiring mirrored family entrypoints.
    alternatives: [Keep curated manual coverage, Add mirrored `/compat/layers`-style entrypoints]
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

## Goals / Non-Goals

**Goals:**
- Define a compat surface that materially reduces migration work for existing `@deck.gl/react` users
- Add a `DeckGL` wrapper that aligns with the official root-package API shape where fiber.gl can support it honestly
- Reuse fiber.gl's existing `<layer>` and `<view>` primitives to support official-style JSX layer/view composition
- Provide compat typings, context, and ref methods that match the supported runtime surface
- State unsupported and deferred patterns in official terms users will recognize

**Non-Goals:**
- 100% behavioral compatibility with official `@deck.gl/react`
- Widget wrappers or `useWidget`
- Changing fiber.gl's native instance-first API direction
- Introducing new example apps in this planning pass
- Supporting official `Render callbacks` in this change
- Exposing low-level `gl`, `canvas`, `parent`, or `_customRender` through the compat API

## Decisions

### Decision 1: Keep the existing change slug and compat entrypoint, but narrow the active scope

**Chosen:** Continue using `openspec/changes/deckgl-react-compat` and the planned `@deckgl-fiber-renderer/dom/compat` entrypoint.

**Rationale:**
- The active work still targets React-compatibility for deck.gl migration.
- The key reset is scope, not identity: this pass removes widget scope and tightens the migration claims.
- Keeping the slug avoids churn while the artifacts are being refreshed in place.

**Consequence:**
- The artifacts must stop promising all previously listed compat features.
- Future widget work should happen in a separate change rather than being left as partially planned work here.

### Decision 2: Model compat around the official package root, not imagined `@deck.gl/react` subpaths

**Chosen:** Treat the official package root as the compatibility anchor.

**Rationale:**
- Official `@deck.gl/react` exports from the package root rather than from subpaths like `/layers`.
- Official usage keeps JSX layer classes sourced from packages such as `@deck.gl/layers`.
- The compat surface should therefore focus first on the `DeckGL` root import story and the child/ref/context behavior around it.

**Consequence:**
- The design should not claim parity with nonexistent `@deck.gl/react/layers`-style imports.
- Separate compat subpath exports that mirror deck.gl layer families are not part of this change and are not required for reflecting the official React package shape.

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

### Decision 9: Choose broader inventory-backed wrapper coverage, but keep exports under one `/compat` entrypoint

**Chosen:** Do not use a small curated manual wrapper set as the contract. Use a broader wrapper inventory derived from existing evidence, but keep `/compat` as the only official entrypoint in this change.

**What this resolves:**
- between the reviewed options, the contract is closer to a broader inventory than to a hand-picked 15-20 wrapper set
- do not add mirrored official-family entrypoints such as `/compat/layers` or `/compat/geo-layers` in this change
- wrapper breadth should be defined from the existing layer/view inventory already encoded in `packages/types/src/jsx.ts`, not from an ad hoc popularity list

**Final wrapper/export matrix for specs generation:**
- export wrappers only from `@deckgl-fiber-renderer/dom/compat`
- include 5 view wrappers backed by the current `@deck.gl/core` inventory:
  - `MapView`
  - `OrthographicView`
  - `OrbitView`
  - `FirstPersonView`
  - `GlobeView`
- include 13 layer wrappers backed by the current `@deck.gl/layers` inventory:
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
- include 12 canonical layer wrappers backed by the current `@deck.gl/geo-layers` inventory:
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
- include 2 layer wrappers backed by the current `@deck.gl/mesh-layers` inventory:
  - `ScenegraphLayer`
  - `SimpleMeshLayer`
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
- This change stays scoped to one official compat entrypoint: `@deckgl-fiber-renderer/dom/compat`.
- Whether wrappers are hand-authored or generated remains an implementation detail, not a planning commitment.

## Compatibility Matrix

| Pattern | Status in this change | Notes |
| --- | --- | --- |
| `import { DeckGL } from '@deck.gl/react'` → `import { DeckGL } from '@deckgl-fiber-renderer/dom/compat'` | Supported | `/compat` is the only official compat entrypoint in this change. |
| Official deck.gl class imports from packages such as `@deck.gl/layers`, `@deck.gl/geo-layers`, and `@deck.gl/mesh-layers` | Supported | Consumers keep importing classes from official deck.gl packages; compat wrappers lower onto fiber.gl primitives. |
| JSX layer composition through the approved wrapper matrix | Supported | Limited to the inventory-backed wrappers declared in this change. Stable layer IDs remain explicit. |
| JSX view composition through the approved wrapper matrix | Supported | Limited to `MapView`, `OrthographicView`, `OrbitView`, `FirstPersonView`, and `GlobeView`. |
| Compat imperative refs: `deck`, `pickObject`, `pickObjects`, `pickMultipleObjects`, `pickObjectAsync`, `pickObjectsAsync` | Supported | Exact inventory is fixed for the supported upstream deck.gl range already targeted by the repo. |
| `ContextProvider` participation | Supported with limits | Supported only within the partial compat context surface defined in this change. |
| Compat context parity for `deck` | Supported | `deck` is the required supported parity field. |
| Compat context parity for `viewport`, `container`, `eventManager`, `onViewStateChange`, `widgets` | Unsupported unless explicitly verified later in implementation | This change does not promise full official context field or timing parity. |
| Official `Render callbacks` (`children` as a function, such as `{({viewport}) => ...}`) | Unsupported | Use official terminology and document the syntax explicitly. |
| Widget React wrappers such as `<ZoomWidget />` | Deferred | Not part of this change; leave widget compatibility to a future dedicated change. |
| Interleaved mode view behavior beyond existing native constraints | Limited | Compat wrappers do not remove the current native interleaved-mode caveats around views. |
| Family entrypoints such as `/compat/layers`, `/compat/geo-layers`, `/compat/mesh-layers` | Unsupported | This change keeps one flat `/compat` entrypoint. |
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

This remains an additive change. Users would opt in via `@deckgl-fiber-renderer/dom/compat`.

The refreshed planning direction is:
1. match the official root-level `DeckGL` story first
2. support official-style JSX layer/view migration on top of native `<layer>` / `<view>` primitives
3. document unsupported/deferred official patterns clearly
4. keep widget migration out of this change

## Design Review Checkpoint

The next planning phase should treat the following as resolved for scope and wording:

1. wrapper coverage should be inventory-backed and broader than the old curated `15-20` plan
2. this change keeps a single official compat entrypoint: `@deckgl-fiber-renderer/dom/compat`
3. context parity is partial for now and must not promise full official update semantics beyond verified fields
4. the migration promise must be phrased as supported-pattern rewrite reduction, with targeted rewrites only for documented incompatibilities
5. the compatibility matrix must include explicit rows for:
   - deferred widget JSX/wrapper support
   - unsupported official `Render callbacks` (`children` as a function, e.g. `{({viewport}) => ...}`)
   - partial context parity, including `deck` as supported and broader official fields as unverified unless later proven in implementation
   - interleaved-mode caveats that remain inherited from the native renderer

Residual open issues:
- no blocking planning gaps remain for specs generation on wrapper/export coverage or compat ref methods
- any future expansion beyond the declared wrapper/export matrix or ref-method inventory should happen through a follow-up planning change, not implicitly during specs generation
