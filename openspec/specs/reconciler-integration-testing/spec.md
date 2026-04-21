# reconciler-integration-testing Specification

## Purpose

TBD - created by archiving change comprehensive-testing-strategy. Update Purpose after archive.

## Requirements

### Requirement: Use accelint-ts-testing skill for test implementation

The implementation SHALL use the accelint-ts-testing skill when writing all integration tests for the reconciler.

#### Scenario: Load skill before writing integration tests

- **WHEN** starting to write integration test files
- **THEN** accelint-ts-testing skill is loaded and consulted for AAA pattern, assertions, fixtures, and async testing patterns

#### Scenario: Apply skill guidance for test structure

- **WHEN** structuring integration tests
- **THEN** tests follow AAA pattern with blank line separation per accelint-ts-testing

#### Scenario: Apply skill guidance for mocking

- **WHEN** mocking Deck.gl instances for testing
- **THEN** use fakes/test doubles hierarchy per accelint-ts-testing (prefer fakes for Deck.gl instances)

### Requirement: Render React components through custom renderer

The test suite SHALL validate that React components render correctly through the custom reconciler, creating actual Deck.gl layer instances.

#### Scenario: Render single ScatterplotLayer via React

- **WHEN** rendering `<layer layer={new ScatterplotLayer({ id: 'test', data: [] })} />`
- **THEN** reconciler creates a root, renders the layer, and container contains one ScatterplotLayer instance

#### Scenario: Render multiple layers in hierarchy

- **WHEN** rendering multiple `<layer>` elements with different layer types
- **THEN** reconciler creates all layer instances and container contains all layers in correct order

### Requirement: Update layers when props change

The test suite SHALL validate that layer updates trigger reconciler's persistence mode behavior, creating new layer instances.

#### Scenario: Update layer props triggers new instance

- **WHEN** rendering a layer, then re-rendering with different props (e.g., radiusScale change)
- **THEN** reconciler creates a new layer instance (not mutating existing) with updated props

#### Scenario: Update preserves layer ID

- **WHEN** updating a layer's props while keeping the same ID
- **THEN** reconciler creates new instance but preserves the layer ID for Deck.gl diffing

### Requirement: Unmount and cleanup

The test suite SHALL validate that unmounting removes all layers and cleans up reconciler state.

#### Scenario: Unmount removes all layers

- **WHEN** rendering layers then calling root.unmount()
- **THEN** container.layers becomes empty array and reconciler state is cleaned up

#### Scenario: Unmount with nested layers

- **WHEN** rendering nested layer hierarchy with View parent, then unmounting
- **THEN** all layers and views are removed from container
