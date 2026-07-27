## 1. Establish the compat implementation contract

- [ ] 1.1 Reconcile `proposal.md`, `design.md`, `questions.md`, `answers.md`, and `specs/*` into a single implementation checklist for this change, confirming the supported `/compat` surface, the migration promise, and that widgets remain out of scope. Verify by reviewing the updated artifact set for internal consistency.
- [ ] 1.2 Produce the final wrapper/export matrix for `@deckgl-fiber-renderer/compat`, keeping `DeckGL`, shared types/context/ref types, and 5 view wrappers at the package root while exporting layer wrappers from `/layers`, `/geo-layers`, `/aggregation-layers`, and `/mesh-layers`; confirm `/aggregation-layers` is limited to `ScreenGridLayer`, `HexagonLayer`, `ContourLayer`, `GridLayer`, and `HeatmapLayer`, with non-layer aggregation exports excluded-for-review. Verify by checking the matrix against `packages/types/src/jsx.ts`, upstream package exports, and the compat specs.
- [ ] 1.3 Produce the final compat ref-method inventory for this change, limited to `deck`, `pickObject`, `pickObjects`, `pickMultipleObjects`, `pickObjectAsync`, and `pickObjectsAsync`, and confirm it matches the approved design/specs and supported deck.gl version range. Verify by cross-checking the design/spec artifacts and the workspace version evidence.
- [ ] 1.4 Define the compatibility matrix for supported, excluded-for-review, unsupported, and deferred official `@deck.gl/react` patterns, including explicit rows for unsupported official `Render callbacks`, deferred widget JSX/wrappers, deferred `useWidget`, partial context parity, native interleaved-mode caveats, omitted props/methods/context fields, and any unsupported aggregation-layer wrappers. Verify by checking that every non-goal or limitation named in the design/specs appears in the matrix.

## 2. Deliver a vertical slice for the compat DeckGL package entrypoint

- [ ] 2.1 Add the dedicated compat package and export wiring so `@deckgl-fiber-renderer/compat` is the supported React migration entrypoint for this change, using `tsdown` package export generation for the approved subpaths. Verify with package-level export tests or build checks targeted to `@deckgl-fiber-renderer/compat`.
- [ ] 2.2 Implement the compat `DeckGL` wrapper around the native `Deckgl` component with the approved official-shaped prop boundary, keeping low-level `gl`, `canvas`, `parent`, and `_customRender` out of the supported compat API. Verify with focused component tests covering supported prop forwarding and unsupported-prop behavior.
- [ ] 2.3 Implement the compat ref surface on `DeckGL`, exposing exactly the approved picking methods and `deck` handle for supported migration flows. Verify with unit or integration tests that cover each supported ref method.
- [ ] 2.4 Add validation coverage for the entrypoint slice, including supported root import behavior, supported migration claims, explicit unsupported/deferred paths for `Render callbacks`, widget React components, and `useWidget`, plus development-only warnings for detectable unsupported usage. Verify with Vitest assertions and any needed type-level checks.
- [ ] 2.5 Run `pnpm exec turbo test --filter=@deckgl-fiber-renderer/compat`, plus relevant lint/format checks for the touched package, and record that the compat entrypoint slice passes package-level validation.

## 3. Deliver a vertical slice for compat JSX layer wrappers

- [ ] 3.1 Implement the compat JSX layer wrapper set under the approved compat family subpaths for the declared `@deck.gl/layers`, `@deck.gl/geo-layers`, `@deck.gl/aggregation-layers`, and `@deck.gl/mesh-layers` contract, with aggregation-layer coverage limited to `ScreenGridLayer`, `HexagonLayer`, `ContourLayer`, `GridLayer`, and `HeatmapLayer`. Verify wrapper coverage against the approved matrix and ensure non-layer aggregation exports are explicitly excluded-for-review rather than implied.
- [ ] 3.2 Ensure the layer-wrapper slice preserves the supported migration story: official-style JSX layer composition works through compat wrappers, stable layer IDs remain explicit in examples/tests, and official deck.gl class imports can remain unchanged for consumers using the compat `DeckGL` entrypoint. Verify with integration tests and type checks.
- [ ] 3.3 Add explicit compatibility coverage for the documented alias mappings so `mVTLayer`/`mvtLayer` map to `MVTLayer` and `wMSLayer`/`wmsLayer` map to `WMSLayer` without expanding the canonical wrapper inventory. Verify with targeted tests or export assertions.
- [ ] 3.4 Add negative coverage showing the layer compat surface does not claim blanket parity beyond the approved wrapper matrix. Verify with spec-aligned tests or type assertions for unsupported wrappers.
- [ ] 3.5 Run `pnpm exec turbo test --filter=@deckgl-fiber-renderer/compat`, any required package type checks, and relevant lint/format checks for the touched compat layer files.

## 4. Deliver a vertical slice for compat JSX view wrappers

- [ ] 4.1 Implement the compat JSX view wrapper set at the compat package root for exactly `MapView`, `OrthographicView`, `OrbitView`, `FirstPersonView`, and `GlobeView`. Verify wrapper coverage against the approved matrix.
- [ ] 4.2 Ensure the view-wrapper slice supports official-style JSX view composition, including nested compat layer wrappers, explicit view IDs, and native renderer organization of views plus layers. Verify with integration tests covering end-to-end composition behavior.
- [ ] 4.3 Add coverage that compat view behavior does not over-promise beyond current renderer constraints, especially the documented native interleaved-mode caveats around views. Verify with tests or assertions aligned to the compat specs.
- [ ] 4.4 Run `pnpm exec turbo test --filter=@deckgl-fiber-renderer/compat`, any required package type checks, and relevant lint/format checks for the touched compat view files.

## 5. Deliver a vertical slice for compat context and public types

- [ ] 5.1 Define and export compat public shared types from `@deckgl-fiber-renderer/compat`, including `DeckGLProps`, `DeckGLRef`, and `DeckGLContextValue`, aligned to the approved compat prop boundary, ref inventory, and partial context parity, while keeping family-specific wrapper exports aligned to their compat subpaths. Verify with type tests in the relevant package.
- [ ] 5.2 Implement the compat context surface with `deck` as the required supported field and only the additional official-style context fields whose presence and update semantics can be explicitly supported by this change. Verify with focused context tests.
- [ ] 5.3 Support `ContextProvider` participation without implying full official context parity, and add negative coverage for unsupported over-claims around `viewport`, `container`, `eventManager`, `onViewStateChange`, and widgets where not explicitly implemented. Verify with tests and public type assertions.
- [ ] 5.4 Ensure the compat type surface and context surface do not include widget APIs such as `useWidget` or widget wrapper types. Verify by checking exports and type coverage.
- [ ] 5.5 Run `pnpm exec turbo test --filter=@deckgl-fiber-renderer/compat`, relevant type-test commands, and lint/format checks for the touched compat type/context files.

## 6. Finish migration documentation and package validation

- [ ] 6.1 Update package-level documentation for `/compat` with a migration guide centered on replacing the official `DeckGL` import, keeping official deck.gl class imports where supported, and calling out the compatibility matrix for supported, unsupported, and deferred patterns. Verify by reviewing docs against the approved proposal/design/spec language.
- [ ] 6.2 Document the final wrapper/export matrix, ref-method inventory, partial context parity, unsupported official `Render callbacks`, deferred widgets, and any interleaved-mode caveats so the migration contract is explicit and testable. Verify that the docs match the approved artifacts exactly.
- [ ] 6.3 Run final package validation for the touched scope: targeted build/test/typecheck commands for `@deckgl-fiber-renderer/compat`, plus any required dependency-package validation, lint, and format checks appropriate to the changed files. Verify all targeted checks pass before marking the change implementation tasks complete.
- [ ] 6.4 If the implementation affects published package surface, generate the required changeset and verify the release note reflects the additive `@deckgl-fiber-renderer/compat` package and approved subpaths without claiming widget support or full `@deck.gl/react` parity.

## Parallelization Strategy

### Dependencies (Must Complete First)

- **Section 1** must complete first because it establishes the approved implementation contract, wrapper/export matrix, ref-method inventory, compatibility matrix, and scope guardrails for the rest of the change.

**Independent tasks (can run in parallel):**
- **Section 3** (compat JSX layer wrappers) and **Section 4** (compat JSX view wrappers) can run in parallel after Section 2 because they implement separate wrapper inventories on top of the same approved compat entrypoint.
- **Section 5** (compat context and public types) can run in parallel with **Section 3** or **Section 4** after Section 2 because it focuses on the public type/context surface rather than wrapper-family implementation.

**Sequential dependencies:**
- **Section 2** must complete before Sections 3, 4, and 5 because the compat entrypoint and `DeckGL` wrapper define the public surface those slices attach to.
- **Section 6** should run after Sections 2 through 5 because documentation and final validation need the implemented compat surface, wrapper matrices, and compatibility matrix to be stable.

**Critical path:**
Section 1 → Section 2 → Section 6

**Recommended implementation order:**
1. Implement **Section 1** first to lock the contract, wrapper/export matrix, ref-method inventory, and compatibility matrix.
2. Implement **Section 2** next to establish the compat entrypoint and `DeckGL` wrapper.
3. Implement **Sections 3, 4, and 5** in parallel where staffing allows.
4. Implement **Section 6** last to finalize docs, validation, and release metadata.
