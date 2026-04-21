## 1. Load Testing Skills

- [x] 1.1 Load accelint-ts-testing skill for comprehensive vitest testing guidance
- [x] 1.2 Load accelint-react-testing skill for React Testing Library best practices

## 2. Infrastructure Setup

- [x] 2.1 Install @testing-library/react as devDependency in packages/dom
- [x] 2.2 Install @deck.gl/test-utils as devDependency in packages/reconciler
- [x] 2.3 Create vitest.config.ts in packages/reconciler with global mock cleanup and coverage thresholds (follow accelint-ts-testing config patterns)
- [x] 2.4 Create vitest.config.ts in packages/shared with global mock cleanup and coverage thresholds
- [x] 2.5 Create vitest.config.ts in packages/types with global mock cleanup
- [x] 2.6 Create vitest.config.ts in packages/dom with global mock cleanup and coverage thresholds
- [x] 2.7 Create packages/reconciler/src/**tests**/setup.ts with globalThis.reportError mock
- [x] 2.8 Update root vitest.config.ts with coverage thresholds and global mock cleanup

## 3. Reconciler Test Fixtures

- [x] 3.1 Create packages/reconciler/src/**fixtures**/layers.ts with createTestLayer helper (consult accelint-ts-testing for fixture organization)
- [x] 3.2 Add fixtures.scatterplotLayer factory to layers.ts
- [x] 3.3 Add fixtures.pathLayer factory to layers.ts
- [x] 3.4 Add fixtures.mapView factory to layers.ts
- [x] 3.5 Create packages/reconciler/src/**fixtures**/mock-deck-instance.ts with createMockDeckInstance
- [x] 3.6 Add createMockContainer helper to mock-deck-instance.ts
- [x] 3.7 Add createMockHostContext helper to mock-deck-instance.ts

## 4. Reconciler Integration Tests

- [x] 4.1 Create packages/reconciler/src/**tests**/integration.test.tsx (use accelint-ts-testing for AAA pattern and test structure)
- [x] 4.2 Add test: render single ScatterplotLayer via React
- [x] 4.3 Add test: render multiple layers in hierarchy
- [x] 4.4 Add test: update layer props triggers new instance
- [x] 4.5 Add test: update preserves layer ID
- [x] 4.6 Add test: unmount removes all layers
- [x] 4.7 Add test: unmount with nested layers
- [x] 4.8 Run Ultracite lint/format check on integration tests

## 5. Reconciler Persistence Mode Tests

- [x] 5.1 Create packages/reconciler/src/**tests**/persistence-mode.test.ts (use accelint-ts-testing for test doubles and assertions)
- [x] 5.2 Add test: cloned instance is new object
- [x] 5.3 Add test: cloned instance has updated props
- [x] 5.4 Add test: create empty ChildSet
- [x] 5.5 Add test: append children to ChildSet
- [x] 5.6 Add test: replace with new layer set
- [x] 5.7 Add test: replace with empty set clears container
- [x] 5.8 Run Ultracite lint/format check on persistence mode tests

## 6. Reconciler Deck.gl Lifecycle Tests

- [x] 6.1 Create packages/reconciler/src/**tests**/deckgl-lifecycle.test.ts (use accelint-ts-testing for test organization)
- [x] 6.2 Add test: layer ID preserved on creation
- [x] 6.3 Add test: layer ID preserved through updates
- [x] 6.4 Add test: View sets child host context
- [x] 6.5 Add test: layer inherits parent View context
- [x] 6.6 Add test: mixed list organized correctly (views/layers)
- [x] 6.7 Add test: all layers list has no views
- [x] 6.8 Add test: flatten three-level hierarchy
- [x] 6.9 Add test: flatten handles empty children
- [x] 6.10 Run Ultracite lint/format check on lifecycle tests

## 7. Reconciler React Compatibility Tests

- [x] 7.1 Create packages/reconciler/src/**tests**/react-compat.test.ts (use accelint-ts-testing for strict assertions)
- [x] 7.2 Add test: supportsPersistence is true
- [x] 7.3 Add test: supportsMutation is false
- [x] 7.4 Add test: event priority is valid (DiscreteEventPriority, ContinuousEventPriority, or DefaultEventPriority)
- [x] 7.5 Add test: core methods exist (createInstance, cloneInstance, etc.)
- [x] 7.6 Add test: persistence methods exist (cloneInstance, createContainerChildSet, etc.)
- [x] 7.7 Add test: suspense methods exist (cloneHiddenInstance, unhideInstance)
- [x] 7.8 Add test: createInstance accepts correct parameters
- [x] 7.9 Add test: cloneInstance accepts correct parameters
- [x] 7.10 Run Ultracite lint/format check on compatibility tests

## 8. Reconciler Snapshot Tests

- [x] 8.1 Create packages/reconciler/src/**tests**/layer-tree-snapshots.test.ts (consult accelint-ts-testing for snapshot best practices)
- [x] 8.2 Add test: render complex layer hierarchy with snapshot
- [x] 8.3 Add test: snapshot with property matchers for dynamic values
- [x] 8.4 Run Ultracite lint/format check on snapshot tests

## 9. Types Package Type Tests

- [x] 9.1 Create packages/types/src/**tests**/jsx-types.test-d.ts (use accelint-ts-testing for type testing guidance with expectTypeOf)
- [x] 9.2 Add test: layer element accepts Layer instance
- [x] 9.3 Add test: invalid element types rejected (@ts-expect-error)
- [x] 9.4 Create packages/types/src/**tests**/props-types.test-d.ts
- [x] 9.5 Add test: DeckglProps accepts initialViewState
- [x] 9.6 Add test: DeckglProps accepts layers array
- [x] 9.7 Add test: DeckglProps accepts views array
- [x] 9.8 Add test: DeckglProps accepts children (ReactNode)
- [x] 9.9 Add test: ScatterplotLayer preserves data generic type
- [x] 9.10 Add test: ReactElement type compatible across React versions
- [x] 9.11 Add test: ReactNode type compatible across React versions

## 10. Shared Package Utility Tests

- [x] 10.1 Create packages/shared/src/**tests**/utils.test.ts (use accelint-ts-testing for pure function testing, consider property-based testing)
- [x] 10.2 Add test: isDefined returns false for undefined
- [x] 10.3 Add test: isDefined returns true for null
- [x] 10.4 Add test: isDefined returns true for falsy values (0, "", false)
- [x] 10.5 Add test: isFn returns true for functions
- [x] 10.6 Add test: isFn returns false for non-functions
- [x] 10.7 Add test: toPascal capitalizes first letter
- [x] 10.8 Add test: toPascal handles empty string
- [x] 10.9 Add test: toPascal preserves rest of string
- [x] 10.10 Add test: isBrowserEnvironment returns false in Node test environment
- [x] 10.11 Run Ultracite lint/format check on utility tests

## 11. Shared Package Store Tests

- [x] 11.1 Create packages/shared/src/**tests**/store.test.ts (use accelint-ts-testing for state management testing patterns)
- [x] 11.2 Add test: initial state is correct (deckgl undefined, \_passedLayers empty)
- [x] 11.3 Add test: setDeckgl updates state
- [x] 11.4 Add test: selectors.deckgl returns correct value
- [x] 11.5 Add test: selectors.setDeckgl returns correct value
- [x] 11.6 Add test: store can be created multiple times with independent state
- [x] 11.7 Run Ultracite lint/format check on store tests

## 12. Dom Package Component Tests

- [x] 12.1 Create packages/dom/src/**tests**/deckgl-component.test.tsx (use accelint-react-testing for Testing Library patterns and query priority)
- [x] 12.2 Add mock for @deckgl-fiber-renderer/reconciler module
- [x] 12.3 Add test: creates reconciler root on mount
- [x] 12.4 Add test: passes props to root.configure
- [x] 12.5 Add test: renders canvas in standalone mode (follow accelint-react-testing query priority: getByRole > getByLabelText > getByText)
- [x] 12.6 Add test: renders hidden div in interleaved mode
- [x] 12.7 Add test: unmounts cleanly
- [x] 12.8 Run Ultracite lint/format check on component tests

## 13. Dom Package Hook Tests

- [x] 13.1 Create packages/dom/src/**tests**/hooks.test.tsx (use accelint-react-testing for hook testing patterns)
- [x] 13.2 Add test: useDeckgl returns deckgl instance from store
- [x] 13.3 Add test: useDeckgl updates when store changes
- [x] 13.4 Add test: useIsomorphicLayoutEffect uses useEffect in Node environment
- [x] 13.5 Run Ultracite lint/format check on hook tests

## 14. CI Matrix Testing Setup

- [x] 14.1 Create .github/workflows/test-matrix.yml
- [x] 14.2 Configure matrix strategy for React 18.3.1 and 19.0.0
- [x] 14.3 Configure matrix strategy for react-reconciler 0.29.2 and 0.30.0
- [x] 14.4 Add matrix exclusions (React 18 + reconciler 0.30, React 19 + reconciler 0.29)
- [x] 14.5 Add pnpm install step
- [x] 14.6 Add override React versions step
- [x] 14.7 Add run tests step (pnpm test)
- [x] 14.8 Add type check step (pnpm exec tsc --noEmit)

## 15. Local Testing Scripts

- [x] 15.1 Add test:react-18 script to root package.json
- [x] 15.2 Add test:react-19 script to root package.json
- [x] 15.3 Add test:set-version script to root package.json
- [x] 15.4 Add test:all-versions script to root package.json

## 16. Documentation and Verification

- [x] 16.1 Run all tests locally: pnpm test
- [x] 16.2 Verify coverage thresholds met (80%+ for reconciler/shared/dom)
- [x] 16.3 Run type checking across all packages: pnpm exec tsc --noEmit
- [x] 16.4 Test React 18 compatibility locally: pnpm test:react-18
- [x] 16.5 Test React 19 compatibility locally: pnpm test:react-19
- [x] 16.6 Run Ultracite lint/format check on all new test files
- [x] 16.7 Generate changeset for testing infrastructure addition
- [x] 16.8 Commit all changes with descriptive commit message
