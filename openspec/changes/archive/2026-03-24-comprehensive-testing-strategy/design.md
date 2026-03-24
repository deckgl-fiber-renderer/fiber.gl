## Context

The custom React renderer lacks comprehensive test coverage, creating risk during React and react-reconciler upgrades. The renderer uses persistence mode (immutable updates) and relies heavily on Deck.gl layer ID stability. Without tests, breaking changes in React's reconciler API or regressions in our host config implementation can go undetected.

Current state:

- `packages/reconciler` has 8 basic unit tests for host config functions
- `packages/shared`, `packages/types`, and `packages/dom` have no tests
- No integration tests validating React component rendering through the renderer
- No type tests catching TypeScript regressions across React versions
- No CI matrix testing for React 18.x and 19.x compatibility

## Goals / Non-Goals

**Goals:**

- Achieve 80%+ code coverage for reconciler, shared, and dom packages
- Achieve 100% type coverage for types package (compile-time validation)
- Validate host config implementation adheres to react-reconciler API
- Detect breaking changes when upgrading React or react-reconciler
- Test persistence mode semantics (immutable updates, atomic tree replacement)
- Validate Deck.gl-specific behavior (layer ID preservation, view context)
- Establish testing patterns following accelint-ts-testing standards

**Non-Goals:**

- Testing React's reconciliation algorithm (already tested by React)
- Testing Deck.gl's WebGL rendering (already tested by Deck.gl)
- Visual regression testing (GPU-intensive, out of scope)
- Testing examples directory (demo code, not library code)
- Testing logger implementation (low value, noisy output)

## Decisions

### Decision 1: Mock Deck.gl instances rather than using real ones

**Choice:** Use `@deck.gl/test-utils` and custom mocks for Deck.gl instances

**Rationale:**

- Real Deck.gl instances require WebGL context (not available in Node test environment)
- Mocking focuses tests on reconciler behavior, not Deck.gl rendering
- `@deck.gl/test-utils` provides `testLayer` utility for mocking layers
- Faster test execution without GPU initialization

**Alternatives considered:**

- Real Deck.gl instances: Requires JSDOM + WebGL polyfills, slow, tests wrong layer
- Manual mocks: Reinventing wheel when test-utils exists

**Implementation:**

```typescript
// packages/reconciler/src/__fixtures__/mock-deck-instance.ts
export function createMockDeckInstance(): RootElement {
  const layers: any[] = [];
  return {
    layers,
    setProps: vi.fn((props) => {
      if (props.layers) {
        layers.splice(0, layers.length, ...props.layers);
      }
    }),
    finalize: vi.fn(),
  } as any;
}
```

### Decision 2: Use expectTypeOf for type testing, not tsd

**Choice:** Use vitest's built-in `expectTypeOf` for type tests

**Rationale:**

- Already using vitest, no additional tool needed
- Type tests co-located with runtime tests in same file structure
- Works with existing vitest configuration and CI setup
- Supports test.d.ts files for pure type testing

**Alternatives considered:**

- `tsd`: Separate CLI tool, requires separate config, less integrated with vitest

**Implementation:**

```typescript
// packages/types/src/__tests__/jsx-types.test-d.ts
import { expectTypeOf } from "vitest";
import { createElement } from "react";

it("layer element accepts Layer instance", () => {
  const element = createElement("layer", { layer: new ScatterplotLayer({...}) });
  expectTypeOf(element).toMatchTypeOf<ReactElement>();
});
```

### Decision 3: Extract fixtures to **fixtures** directories

**Choice:** Create `__fixtures__` directories for reusable test data and mocks

**Rationale:**

- Follows accelint-ts-testing pattern for fixture organization
- Reduces duplication across test files
- Makes it easy to find and update shared test data
- Clear separation between test logic and test data

**Structure:**

```
packages/reconciler/src/
  __tests__/
    integration.test.tsx
    persistence-mode.test.ts
  __fixtures__/
    layers.ts           # Layer fixtures
    views.ts            # View fixtures
    mock-deck-instance.ts
```

### Decision 4: GitHub Actions matrix for React version testing

**Choice:** Create CI workflow with matrix testing for React 18.x and 19.x

**Rationale:**

- Catches breaking changes when React or react-reconciler updates
- Matrix strategy tests all valid combinations
- Excludes invalid combinations (React 18 + reconciler 0.30, etc.)
- Runs on every push and PR

**Configuration:**

```yaml
strategy:
  matrix:
    react-version: ["18.3.1", "19.0.0"]
    react-reconciler-version: ["0.29.2", "0.30.0"]
    exclude:
      - react-version: "18.3.1"
        react-reconciler-version: "0.30.0"
      - react-version: "19.0.0"
        react-reconciler-version: "0.29.2"
```

### Decision 5: Global mock cleanup in vitest.config.ts

**Choice:** Configure `clearMocks`, `mockReset`, `restoreMocks` globally

**Rationale:**

- Eliminates entire class of test pollution bugs
- Follows accelint-ts-testing recommendation for configuration over repetition
- No manual cleanup needed in individual tests
- Prevents "action at a distance" failures from leaked mocks

**Configuration:**

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },
});
```

### Decision 6: AAA pattern with blank line separation

**Choice:** Follow Arrange-Act-Assert pattern per accelint-ts-testing

**Rationale:**

- Makes test structure instantly clear
- Easier to review and maintain
- Consistent across all test files
- Industry standard pattern

**Example:**

```typescript
it("should render ScatterplotLayer via React", () => {
  // Arrange
  const rootElement = createMockDeckInstance();
  const root = createRoot(rootElement);
  const layer = new ScatterplotLayer({ id: "test", data: [] });

  // Act
  root.render(createElement("layer", { layer }));

  // Assert
  expect(root.container.layers).toHaveLength(1);
  expect(root.container.layers[0]).toBeInstanceOf(ScatterplotLayer);
});
```

### Decision 7: Snapshot testing for layer tree structures

**Choice:** Use vitest snapshots for complex layer hierarchy outputs

**Rationale:**

- Layer trees have complex nested structure difficult to assert explicitly
- Snapshots catch unexpected changes in tree organization
- Property matchers handle dynamic values (IDs, timestamps)
- Follows accelint-ts-testing guidance for complex structures

**Example:**

```typescript
it("should render complex layer hierarchy", () => {
  root.render(/* nested layers */);

  expect(root.container.layers).toMatchSnapshot({
    0: expect.objectContaining({ id: "points" }),
    1: expect.objectContaining({ id: "paths" }),
  });
});
```

### Decision 8: Test @testing-library/react for dom package

**Choice:** Use @testing-library/react for component testing, not enzyme

**Rationale:**

- Industry standard for React component testing
- Works with React 18 and 19
- Encourages testing user behavior, not implementation details
- Well-maintained and widely adopted

**Implementation:**

```typescript
import { render } from "@testing-library/react";

it("should render canvas in standalone mode", () => {
  const { container } = render(<Deckgl>{null}</Deckgl>);
  expect(container.querySelector("canvas#deckgl-fiber-canvas")).toBeInTheDocument();
});
```

## Risks / Trade-offs

### Risk: Mocked Deck.gl instances may diverge from real behavior

**Mitigation:** Keep mocks minimal, only mocking what's necessary. Integration tests validate reconciler behavior, not Deck.gl rendering. Defer Deck.gl behavior testing to Deck.gl's own test suite.

### Risk: Type tests may not catch runtime issues

**Mitigation:** Combine type tests with runtime tests. Type tests catch compile-time regressions, runtime tests validate actual behavior. Both layers are necessary.

### Risk: Matrix testing increases CI time

**Mitigation:** Run matrix only on pushes to main and PRs, not every commit locally. Use Turbo caching to skip unchanged packages. Total CI time should remain under 5 minutes.

### Trade-off: 80% coverage threshold may allow gaps

**Mitigation:** Focus coverage on critical paths (reconciler host config, persistence mode operations). Some utility functions may have lower coverage if low-risk. Manual review during PR ensures critical code is tested.

### Risk: Vitest setup complexity for React testing

**Mitigation:** Create setup files (src/**tests**/setup.ts) with global configuration. Mock globalThis.reportError once for all tests. Document setup in test READMEs.

### Trade-off: Fixtures add indirection

**Mitigation:** Keep fixtures simple and well-named. Use factories (createTestLayer, fixtures.scatterplotLayer) with clear purpose. Inline simple test data, extract only when reused 3+ times.

## Migration Plan

**Phase 1: Infrastructure Setup**

1. Add vitest config files to each package
2. Install @testing-library/react and @deck.gl/test-utils
3. Create **fixtures** directories
4. Set up global mock cleanup

**Phase 2: Core Reconciler Tests**

1. Add integration tests (React rendering through reconciler)
2. Add persistence mode tests (immutable updates)
3. Add Deck.gl lifecycle tests (layer IDs, view context)
4. Add React compatibility tests (host config API)

**Phase 3: Supporting Package Tests**

1. Add type tests to types package
2. Add utility tests to shared package
3. Add component tests to dom package

**Phase 4: CI Setup**

1. Create GitHub Actions matrix workflow
2. Configure coverage reporting
3. Add coverage thresholds to CI checks

**Rollback Strategy:**

- Tests are additive (no breaking changes to existing code)
- If tests block CI, temporarily disable coverage thresholds
- Vitest can be removed cleanly (devDependency only)

## Open Questions

None - all technical decisions have been made based on research and established patterns.
