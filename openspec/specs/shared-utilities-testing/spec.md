# shared-utilities-testing Specification

## Purpose

TBD - created by archiving change comprehensive-testing-strategy. Update Purpose after archive.

## Requirements

### Requirement: Use accelint-ts-testing skill for utility tests

The implementation SHALL use the accelint-ts-testing skill when writing unit tests for shared utilities and store.

#### Scenario: Load skill before writing utility tests

- **WHEN** starting to write utility test files
- **THEN** accelint-ts-testing skill is loaded for guidance on pure function testing patterns

#### Scenario: Apply skill guidance for unit test structure

- **WHEN** writing utility tests
- **THEN** tests follow simple AAA pattern appropriate for pure functions per accelint-ts-testing

#### Scenario: Apply skill guidance for assertions

- **WHEN** asserting utility function results
- **THEN** use strict assertions (toBe, toEqual) avoiding loose assertions per accelint-ts-testing

#### Scenario: Consider property-based testing for utilities

- **WHEN** testing pure utility functions
- **THEN** evaluate whether property-based testing with fast-check adds value per accelint-ts-testing

### Requirement: Test isDefined utility

The test suite SHALL validate that isDefined correctly identifies defined values.

#### Scenario: Returns false for undefined

- **WHEN** calling isDefined(undefined)
- **THEN** returns false

#### Scenario: Returns true for null

- **WHEN** calling isDefined(null)
- **THEN** returns true (null is defined, just not a value)

#### Scenario: Returns true for falsy values

- **WHEN** calling isDefined with 0, empty string, or false
- **THEN** returns true for all cases

### Requirement: Test isFn type guard

The test suite SHALL validate that isFn correctly identifies function types.

#### Scenario: Returns true for functions

- **WHEN** calling isFn with arrow function, named function, or class
- **THEN** returns true for all function types

#### Scenario: Returns false for non-functions

- **WHEN** calling isFn with objects, strings, or numbers
- **THEN** returns false

### Requirement: Test toPascal string transformation

The test suite SHALL validate that toPascal capitalizes first letter correctly.

#### Scenario: Capitalizes first letter

- **WHEN** calling toPascal('scatterplotLayer')
- **THEN** returns 'ScatterplotLayer'

#### Scenario: Handles empty string

- **WHEN** calling toPascal('')
- **THEN** returns ''

#### Scenario: Preserves rest of string

- **WHEN** calling toPascal('mapView')
- **THEN** returns 'MapView' (not 'Mapview')

### Requirement: Test isBrowserEnvironment detection

The test suite SHALL validate that isBrowserEnvironment correctly detects runtime environment.

#### Scenario: Returns false in Node test environment

- **WHEN** running tests in Node.js (vitest default)
- **THEN** isBrowserEnvironment is false

### Requirement: Test Zustand store

The test suite SHALL validate that useStore manages Deck.gl instance state correctly.

#### Scenario: Initial state is correct

- **WHEN** accessing store.getState()
- **THEN** deckgl is undefined and \_passedLayers is empty array

#### Scenario: setDeckgl updates state

- **WHEN** calling store.setDeckgl with mock Deck instance
- **THEN** useStore.getState().deckgl equals mock instance

#### Scenario: Selectors return correct values

- **WHEN** calling selectors.deckgl(state)
- **THEN** returns state.deckgl value

#### Scenario: Store can be created multiple times

- **WHEN** creating multiple store instances for different roots
- **THEN** each store maintains independent state
