## 1. Types Package: Add View Element

- [x] 1.1 Add `view` intrinsic element to `packages/types/src/jsx.ts` with `{ view: View; children?: ReactNode }` type
- [x] 1.2 Update `layer` intrinsic element to remove `| View` union - make it `{ layer: Layer; children?: ReactNode }`
- [x] 1.3 Update JSDoc `@deprecated` tags on all view-specific elements (mapView, orbitView, etc.) to point to `<view>` instead of `<layer>`
- [x] 1.4 Verify TypeScript compilation with strict mode passes
- [x] 1.5 Run `turbo build --filter=@deckgl-fiber-renderer/types` to generate updated .d.ts files

## 2. Types Package: Type Tests

- [x] 2.1 Create test file `packages/types/src/__tests__/view-element-types.test-d.ts` with Vitest's expectTypeOf
- [x] 2.2 Add test: `<view view={new MapView()}>` compiles without errors
- [x] 2.3 Add test: `<view view={new OrbitView()}>` compiles without errors
- [x] 2.4 Add test: `<view view={new ScatterplotLayer()}>` produces TypeScript error
- [x] 2.5 Add test: `<layer layer={new ScatterplotLayer()}>` compiles without errors
- [x] 2.6 Add test: `<layer layer={new MapView()}>` produces TypeScript error
- [x] 2.7 Run `turbo test --filter=@deckgl-fiber-renderer/types` to verify type tests pass

## 3. Reconciler: Add View Element Support

- [x] 3.1 Add `type === 'view'` branch in `createDeckglObject()` in `packages/reconciler/src/config.ts`
- [x] 3.2 Add error handling for missing `props.view` in view element
- [x] 3.3 Add View ID validation in development mode (similar to Layer ID validation)
- [x] 3.4 Add development-mode error if View instance passed to `<layer>` element
- [x] 3.5 Verify `cloneInstance()` correctly handles view elements (should already work via createDeckglObject)
- [x] 3.6 Run `pnpm dlx ultracite fix` on modified reconciler files

## 4. Reconciler: Update Deprecation Warnings

- [x] 4.1 Update deprecation warnings in `createDeckglObject()` for legacy view elements (mapView, orbitView, etc.)
- [x] 4.2 Change warning messages to reference `<view view={...} />` instead of `<layer layer={...} />`
- [x] 4.3 Ensure warnings only appear in development mode (check `process.env.NODE_ENV`)
- [x] 4.4 Add helper function to detect if element type is a view type

## 5. Reconciler: Unit Tests for View Element

- [x] 5.1 Create test file `packages/reconciler/src/__tests__/view-element.test.ts` with Vitest
- [x] 5.2 Add test: `<view>` element creates instance from passed view
- [x] 5.3 Add test: Error thrown when `view` prop is missing
- [x] 5.4 Add test: View instances work correctly (MapView, OrbitView, etc.)
- [x] 5.5 Add test: View ID is preserved through reconciliation
- [x] 5.6 Add test: Warning shown when view is missing explicit ID in development
- [x] 5.7 Add test: No warning when view has explicit ID in development
- [x] 5.8 Add test: No warnings in production mode
- [x] 5.9 Run `turbo test --filter=@deckgl-fiber-renderer/reconciler` to verify tests pass

## 6. Reconciler: Update Layer Element Tests

- [x] 6.1 Update existing `packages/reconciler/src/__tests__/layer-element.test.ts`
- [x] 6.2 Remove tests for View instances passed to `<layer>` (now TypeScript error)
- [x] 6.3 Add test: Error/warning shown if View passed to `<layer>` in development (runtime check)
- [x] 6.4 Update test: Verify both `<view>` and `<layer>` elements work in same tree
- [x] 6.5 Run tests to verify updated behavior

## 7. Reconciler: Integration Tests

- [x] 7.1 Add integration test in `packages/reconciler/src/__tests__/integration.test.tsx`
- [x] 7.2 Add test: `<view>` with children flattens correctly
- [x] 7.3 Add test: Multiple `<view>` elements produce correct views array
- [x] 7.4 Add test: Hierarchy is organizational only - all layers render in all views
- [x] 7.5 Add test: `deck.setProps` receives correct `{ views: [...], layers: [...] }` shape
- [x] 7.6 Run integration tests to verify end-to-end behavior

## 8. Update Deprecated View Element JSDoc

- [x] 8.1 Update JSDoc in `packages/types/src/jsx.ts` for `mapView`
- [x] 8.2 Update JSDoc for `orthographicView`
- [x] 8.3 Update JSDoc for `orbitView`
- [x] 8.4 Update JSDoc for `firstPersonView`
- [x] 8.5 Update JSDoc for `globeView`
- [x] 8.6 Verify all JSDoc references `<view view={new ViewClass({...})} />`

## 9. Update Examples: Basic View Usage

- [x] 9.1 Find all View usage in examples: `grep -r "layer={new.*View" examples/`
- [x] 9.2 Update `examples/views/app/globe/_deckgl.tsx` to use `<view>`
- [x] 9.3 Update `examples/views/app/orbit/_deckgl.tsx` to use `<view>`
- [x] 9.4 Update `examples/views/app/orthographic/_deckgl.tsx` to use `<view>`
- [x] 9.5 Verify examples build: `turbo build --filter=./examples/*`
- [x] 9.6 Test run at least one example to verify rendering works

## 10. Update Examples: Advanced Applications

- [x] 10.1 Update `examples/advanced/` to use `<view>` for View instances
- [x] 10.2 Update `examples/nextjs/` to use `<view>` for View instances
- [x] 10.3 Update `examples/remix/` to use `<view>` for View instances
- [x] 10.4 Update `examples/standalone/` to use `<view>` for View instances
- [x] 10.5 Verify all examples build without TypeScript errors
- [x] 10.6 Test run at least 2 examples to verify rendering works

## 11. Documentation: API Reference

- [x] 11.1 Create or update `docs/API.md` with `<view>` element documentation
- [x] 11.2 Add section explaining Layer vs View distinction
- [x] 11.3 Add code examples showing `<view>` usage for single and multiple views
- [x] 11.4 Add minimap example showing multiple `<view>` elements
- [x] 11.5 Document that hierarchy is organizational only (future hierarchical filtering noted)
- [x] 11.6 Add section on View ID requirement (parallel to Layer ID requirement)

## 12. Documentation: Migration Guide

- [x] 12.1 Add section to `docs/MIGRATION.md` for View/Layer separation
- [x] 12.2 Explain why `<layer>` no longer accepts Views
- [x] 12.3 Add search-and-replace patterns for View migration
- [x] 12.4 Show before/after examples for common View types
- [x] 12.5 Note TypeScript will catch incorrect usage at compile time
- [x] 12.6 Document updated deprecation messages for view elements

## 13. Package Updates

- [x] 13.1 Run `turbo build` to verify all packages build
- [x] 13.2 Run `turbo test` to verify all tests pass
- [x] 13.3 Run `turbo lint` to verify code quality
- [x] 13.4 Run `pnpm dlx ultracite check` to verify formatting

## 14. Changesets

- [x] 14.1 Create changeset for `@deckgl-fiber-renderer/types` (major - breaking type change)
- [x] 14.2 Create changeset for `@deckgl-fiber-renderer/reconciler` (major - breaking API change)
- [x] 14.3 Note breaking change: `<layer>` no longer accepts View instances
- [x] 14.4 Note new feature: `<view>` element for View instances
- [x] 14.5 Include migration instructions in changeset summaries

## 15. Final Verification

- [x] 15.1 Review all TypeScript errors in IDE - should only be expected View/Layer mismatches
- [x] 15.2 Run full build: `turbo build`
- [x] 15.3 Run full test suite: `turbo test`
- [x] 15.4 Manually test at least 3 examples with different View types
- [x] 15.5 Verify deprecation warnings appear for legacy view elements
- [x] 15.6 Verify no warnings for new `<view>` and `<layer>` elements with explicit IDs
