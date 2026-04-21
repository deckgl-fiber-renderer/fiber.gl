## Why

The custom React renderer currently lacks comprehensive test coverage, creating risk when upgrading `react` and `react-reconciler` dependencies. Without tests validating host config implementation, persistence mode behavior, and type safety across React versions, breaking changes can slip through undetected.

## What Changes

- Add integration tests for reconciler package validating React component rendering through the custom renderer
- Add persistence mode tests ensuring immutable layer updates and atomic tree replacement
- Add Deck.gl-specific lifecycle tests for layer ID preservation, view nesting context, and tree organization
- Add React compatibility tests ensuring host config methods align with react-reconciler API surface
- Add TypeScript type tests using `expectTypeOf` to catch type regressions across React versions
- Add unit tests for shared utilities and Zustand store (excluding logger)
- Add React component tests for dom package using @testing-library/react
- Create test fixtures and mock utilities for reusable test setup
- Configure vitest with global mock cleanup and coverage thresholds (80%+ for reconciler/shared/dom, 100% for types)
- Add GitHub Actions matrix testing for React 18.x and 19.x compatibility
- Document testing patterns following accelint-ts-testing standards (AAA pattern, fixtures, snapshots)

## Capabilities

### New Capabilities

- `reconciler-integration-testing`: Integration tests validating React component rendering, layer updates, and unmounting through the custom renderer
- `reconciler-persistence-mode-testing`: Tests ensuring persistence mode behavior (immutable updates, atomic tree replacement, ChildSet operations)
- `reconciler-deckgl-lifecycle-testing`: Tests validating Deck.gl-specific behavior (layer ID preservation, view context, tree flattening/organization)
- `reconciler-react-compat-testing`: Tests ensuring host config API compatibility with react-reconciler across versions
- `type-safety-testing`: TypeScript type tests using expectTypeOf to catch type regressions
- `shared-utilities-testing`: Unit tests for utility functions and Zustand store
- `dom-component-testing`: React component tests for Deckgl component and hooks
- `test-infrastructure`: Shared fixtures, mock utilities, vitest configuration, and CI matrix setup

### Modified Capabilities

<!-- No existing capabilities are being modified - this is net-new testing infrastructure -->

## Impact

**Affected Packages:**

- `@deckgl-fiber-renderer/reconciler`: New test suites and fixtures (8 existing tests expanded significantly)
- `@deckgl-fiber-renderer/shared`: New test coverage for utils and store
- `@deckgl-fiber-renderer/types`: New type testing with expectTypeOf
- `@deckgl-fiber-renderer/dom`: New component testing with @testing-library/react

**Dependencies:**

- Add `@testing-library/react` for component testing
- Add `@deck.gl/test-utils` for mocking Deck.gl instances
- Vitest already present as dev dependency

**CI/CD:**

- New GitHub Actions workflow for matrix testing across React 18.x and 19.x
- Coverage reporting and thresholds enforcement

**Development Workflow:**

- Developers gain confidence when upgrading React/react-reconciler
- Breaking changes detected automatically via failing tests
- Type regressions caught at compile-time via type tests
