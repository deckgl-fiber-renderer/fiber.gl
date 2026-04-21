## ADDED Requirements

### Requirement: Provide reusable test fixtures

The test suite SHALL provide reusable fixtures for creating test layers, views, and mock instances.

#### Scenario: createTestLayer creates wrapped instance

- **WHEN** calling createTestLayer(new ScatterplotLayer({...}))
- **THEN** returns Instance object with { node: layer, children: [] }

#### Scenario: Fixtures provide common layers

- **WHEN** accessing fixtures.scatterplotLayer()
- **THEN** returns pre-configured ScatterplotLayer with test data

#### Scenario: Fixtures provide common views

- **WHEN** accessing fixtures.mapView()
- **THEN** returns pre-configured MapView instance

### Requirement: Provide mock utilities

The test suite SHALL provide mock utilities for Deck.gl instances and containers.

#### Scenario: createMockDeckInstance creates testable mock

- **WHEN** calling createMockDeckInstance()
- **THEN** returns mock object with layers array and setProps method

#### Scenario: createMockContainer creates reconciler container

- **WHEN** calling createMockContainer()
- **THEN** returns Container object with layers array and store

#### Scenario: createMockHostContext creates host context

- **WHEN** calling createMockHostContext()
- **THEN** returns HostContext object with view: null

### Requirement: Configure vitest globally

The test suite SHALL configure vitest with global mock cleanup and coverage thresholds.

#### Scenario: Global mock cleanup enabled

- **WHEN** checking vitest.config.ts
- **THEN** clearMocks, mockReset, and restoreMocks are all true

#### Scenario: Coverage thresholds configured

- **WHEN** checking vitest.config.ts coverage settings
- **THEN** thresholds are set to 80% for lines, functions, branches, statements

#### Scenario: Setup files configured

- **WHEN** checking vitest.config.ts for reconciler package
- **THEN** setupFiles points to src/**tests**/setup.ts

### Requirement: Provide CI matrix testing

The test suite SHALL provide GitHub Actions workflow for testing across React versions.

#### Scenario: Test React 18.x compatibility

- **WHEN** CI workflow runs
- **THEN** tests execute with React 18.3.1 and react-reconciler 0.29.2

#### Scenario: Test React 19.x compatibility

- **WHEN** CI workflow runs
- **THEN** tests execute with React 19.0.0 and react-reconciler 0.30.0

#### Scenario: Matrix excludes invalid combinations

- **WHEN** CI workflow runs
- **THEN** React 18 with reconciler 0.30 is excluded, React 19 with reconciler 0.29 is excluded

### Requirement: Use accelint-ts-testing skill during implementation

The implementation SHALL use the accelint-ts-testing skill for comprehensive guidance when writing all vitest tests.

#### Scenario: Load skill before writing tests

- **WHEN** starting to write any test file
- **THEN** accelint-ts-testing skill is loaded and consulted for patterns (AAA, assertions, test doubles, async testing, performance, snapshots, property-based testing)

#### Scenario: Follow skill guidance for test organization

- **WHEN** structuring test files
- **THEN** tests follow accelint-ts-testing organization patterns (co-location, one file per module, shared utilities in test-utils)

#### Scenario: Follow skill guidance for assertions

- **WHEN** writing test assertions
- **THEN** use strict assertions (toEqual, toBe, toStrictEqual) avoiding loose assertions (toBeTruthy, toBeDefined)

#### Scenario: Follow skill guidance for test doubles

- **WHEN** mocking dependencies
- **THEN** follow test doubles hierarchy (prefer fakes > stubs > spies > mocks) per accelint-ts-testing

#### Scenario: Consult skill for property-based testing opportunities

- **WHEN** testing pure functions, validators, or encode/decode pairs
- **THEN** evaluate property-based testing with fast-check per accelint-ts-testing guidance

### Requirement: Follow accelint-ts-testing patterns

The test suite SHALL follow accelint-ts-testing patterns for test organization and structure.

#### Scenario: Tests use AAA pattern

- **WHEN** reviewing test files
- **THEN** tests follow Arrange-Act-Assert pattern with blank line separation

#### Scenario: Tests co-located with implementation

- **WHEN** checking test file locations
- **THEN** test files are in **tests** directories next to source files

#### Scenario: Fixtures extracted to **fixtures**

- **WHEN** checking test organization
- **THEN** shared fixtures are in **fixtures** directories, not inline in tests

#### Scenario: Snapshots used for complex structures

- **WHEN** testing layer tree output
- **THEN** snapshots capture complex layer hierarchies with property matchers for dynamic values
