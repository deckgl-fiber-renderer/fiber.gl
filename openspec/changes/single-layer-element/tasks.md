## 1. Types Package Changes

- [ ] 1.1 Add single `layer` intrinsic element to `packages/types/src/jsx.ts` with `{ layer: Layer | View; children?: ReactNode }` type
- [ ] 1.2 Add JSDoc `@deprecated` tags to all existing layer-specific intrinsic elements (scatterplotLayer, geoJsonLayer, etc.)
- [ ] 1.3 Verify TypeScript compilation with strict mode passes
- [ ] 1.4 Run `pnpm run build` in types package to generate updated .d.ts files

## 2. Reconciler Core Implementation

- [ ] 2.1 Update `createDeckglObject()` in `packages/reconciler/src/config.ts` to handle `type === "layer"` case
- [ ] 2.2 Add error handling for missing `props.layer` in layer element
- [ ] 2.3 Add development-mode warning for layers missing explicit `id` props
- [ ] 2.4 Add development-mode deprecation warning for legacy layer-specific elements
- [ ] 2.5 Verify `cloneInstance()` correctly handles new layer elements (should already work via createDeckglObject)
- [ ] 2.6 Run Biome lint and format checks on modified reconciler files

## 3. Deprecation Warnings

- [ ] 3.1 Update `packages/reconciler/src/side-effects.ts` to show deprecation console.warn and remove all layer imports
- [ ] 3.2 Add deprecation JSDoc comment to `extend()` function in `packages/reconciler/src/extend.ts`
- [ ] 3.3 Verify warnings only appear in development mode (check `process.env.NODE_ENV`)

## 4. Unit Tests

- [ ] 4.1 Create test file `packages/reconciler/src/__tests__/layer-element.test.ts` with Vitest
- [ ] 4.2 Add test: `<layer>` element creates instance from passed layer
- [ ] 4.3 Add test: Error thrown when `layer` prop is missing
- [ ] 4.4 Add test: Both Layer and View instances work correctly
- [ ] 4.5 Add test: Layer ID is preserved through reconciliation
- [ ] 4.6 Add test: Backwards compatibility - legacy elements still work
- [ ] 4.7 Add test: Both syntaxes can coexist in same tree
- [ ] 4.8 Add test: Deprecation warnings are shown in development mode
- [ ] 4.9 Run `pnpm test` in reconciler package to verify all tests pass

## 5. Example: Migration Comparison

- [ ] 5.1 Create new example directory `examples/migration/` with package.json and tsconfig
- [ ] 5.2 Create `examples/migration/src/old-syntax.tsx` showing legacy intrinsic elements
- [ ] 5.3 Create `examples/migration/src/new-syntax.tsx` showing new <layer> element pattern
- [ ] 5.4 Create `examples/migration/src/side-by-side.tsx` showing both syntaxes working together
- [ ] 5.5 Add example showing updateTriggers usage with state-dependent accessors
- [ ] 5.6 Ensure all examples include explicit layer `id` props
- [ ] 5.7 Verify examples build and run without errors

## 6. Update Existing Examples

- [ ] 6.1 Migrate `examples/views/app/globe/_deckgl.tsx` to new syntax with explicit IDs
- [ ] 6.2 Migrate `examples/views/app/orbit/_deckgl.tsx` to new syntax with explicit IDs
- [ ] 6.3 Migrate `examples/views/app/orthographic/_deckgl.tsx` to new syntax with explicit IDs
- [ ] 6.4 Migrate `examples/advanced/src/components/airports/layer/` to new syntax with explicit IDs
- [ ] 6.5 Migrate `examples/nextjs/` to new syntax with explicit IDs
- [ ] 6.6 Migrate `examples/remix/` to new syntax with explicit IDs
- [ ] 6.7 Migrate `examples/standalone/` to new syntax with explicit IDs
- [ ] 6.8 Migrate `examples/custom-layer/` to new syntax with explicit IDs
- [ ] 6.9 Verify all examples build without TypeScript errors
- [ ] 6.10 Test run at least 3 examples to verify rendering works correctly

## 7. Documentation: React Patterns

- [ ] 7.1 Create `docs/REACT_PATTERNS.md` with comprehensive React integration guide
- [ ] 7.2 Add section explaining stable layer ID requirement with visual examples
- [ ] 7.3 Add section on layer lifecycle pattern (creating instances each render)
- [ ] 7.4 Add section on updateTriggers with examples of state-dependent accessors
- [ ] 7.5 Add section on dynamic layer lists showing both React `key` and Deck.gl `id`
- [ ] 7.6 Add section comparing `visible` prop vs conditional rendering
- [ ] 7.7 Add anti-patterns section showing common mistakes (layers outside render, missing IDs, over-memoization)
- [ ] 7.8 Add code examples for each pattern with ✅ correct and ❌ incorrect versions

## 8. Documentation: Migration Guide

- [ ] 8.1 Create `docs/MIGRATION.md` with step-by-step v1 to v2 migration guide
- [ ] 8.2 Add "Why migrate?" section highlighting type safety and code-splitting benefits
- [ ] 8.3 Add syntax comparison showing old vs new patterns side-by-side
- [ ] 8.4 Add section on custom layers (no more extend() needed)
- [ ] 8.5 Add section on backwards compatibility and migration timeline (v2 → v3)
- [ ] 8.6 Add search-and-replace patterns for common layer types
- [ ] 8.7 Add troubleshooting section for common migration issues
- [ ] 8.8 Emphasize ID requirement throughout migration guide

## 9. Update Main Documentation

- [ ] 9.1 Update root `README.md` to show new <layer> syntax as primary example
- [ ] 9.2 Add quick start section showing new pattern with TypeScript generics
- [ ] 9.3 Add link to REACT_PATTERNS.md from README
- [ ] 9.4 Add link to MIGRATION.md from README
- [ ] 9.5 Update package READMEs (types, reconciler, dom) to reflect new API

## 10. Integration Testing

- [ ] 10.1 Build all packages with `pnpm run build`
- [ ] 10.2 Run all tests with `pnpm run test`
- [ ] 10.3 Run lint checks with `pnpm run lint`
- [ ] 10.4 Start and manually test at least 3 different examples
- [ ] 10.5 Verify deprecation warnings appear for old syntax in development
- [ ] 10.6 Verify missing ID warnings appear when IDs omitted in development
- [ ] 10.7 Test production build to ensure warnings are removed

## 11. Changeset and Release Preparation

- [ ] 11.1 Run `pnpm changeset` to create changeset file
- [ ] 11.2 Mark as minor version bump (backwards compatible in v2)
- [ ] 11.3 Write detailed changeset description covering new features and deprecations
- [ ] 11.4 Note in changeset that v3 will be breaking (removal of old syntax)
- [ ] 11.5 Review all package.json files to ensure versions are correct
- [ ] 11.6 Verify no unintended breaking changes in public API
