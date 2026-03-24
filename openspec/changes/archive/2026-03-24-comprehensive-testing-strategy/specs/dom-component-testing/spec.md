## ADDED Requirements

### Requirement: Use accelint-react-testing skill during implementation

The implementation SHALL use the accelint-react-testing skill for comprehensive guidance when writing React component and hook tests with Testing Library.

#### Scenario: Load skill before writing React tests

- **WHEN** starting to write React component or hook tests
- **THEN** accelint-react-testing skill is loaded and consulted for Testing Library best practices

#### Scenario: Follow skill guidance for query priority

- **WHEN** selecting elements in tests
- **THEN** use query priority (getByRole > getByLabelText > getByText > getByTestId) per accelint-react-testing

#### Scenario: Follow skill guidance for user-centric testing

- **WHEN** writing component tests
- **THEN** test user behavior and interactions, not implementation details, per accelint-react-testing

#### Scenario: Follow skill guidance for async utilities

- **WHEN** testing async behavior in components
- **THEN** use waitFor, findBy queries, and userEvent per accelint-react-testing

### Requirement: Test Deckgl component rendering

The test suite SHALL validate that Deckgl component creates reconciler roots and renders correctly using @testing-library/react.

#### Scenario: Creates reconciler root on mount

- **WHEN** rendering `<Deckgl>{null}</Deckgl>`
- **THEN** createRoot is called from reconciler package

#### Scenario: Passes props to root.configure

- **WHEN** rendering `<Deckgl initialViewState={{...}}>{null}</Deckgl>`
- **THEN** root.configure is called with initialViewState prop

#### Scenario: Renders canvas in standalone mode

- **WHEN** rendering `<Deckgl>{null}</Deckgl>` without interleaved prop
- **THEN** canvas element with id='deckgl-fiber-canvas' exists in DOM

#### Scenario: Renders hidden div in interleaved mode

- **WHEN** rendering `<Deckgl interleaved>{null}</Deckgl>`
- **THEN** div with id='deckgl-fiber-interleave' exists and has hidden attribute

#### Scenario: Unmounts cleanly

- **WHEN** rendering Deckgl component then calling unmount()
- **THEN** unmountAtNode is called from reconciler package

### Requirement: Test useDeckgl hook

The test suite SHALL validate that useDeckgl hook returns correct Deck.gl instance from store.

#### Scenario: Returns deckgl instance from store

- **WHEN** calling useDeckgl() hook
- **THEN** returns value from selectors.deckgl(store)

#### Scenario: Updates when store changes

- **WHEN** store updates with new deckgl instance
- **THEN** hook returns updated instance

### Requirement: Test useIsomorphicLayoutEffect hook

The test suite SHALL validate that useIsomorphicLayoutEffect uses correct effect based on environment.

#### Scenario: Uses useLayoutEffect in browser

- **WHEN** isBrowserEnvironment is true
- **THEN** useIsomorphicLayoutEffect uses useLayoutEffect

#### Scenario: Uses useEffect in SSR

- **WHEN** isBrowserEnvironment is false (Node test environment)
- **THEN** useIsomorphicLayoutEffect uses useEffect
