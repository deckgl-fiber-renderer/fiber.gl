## ADDED Requirements

### Requirement: Test Suspense boundary integration

The test suite SHALL validate that React Suspense boundaries work correctly when wrapping components that render deck.gl layers, including scenarios where child components suspend.

#### Scenario: Component suspension with layer rendering

- **WHEN** a component throws a promise (suspends) and renders a deck.gl layer after resolution
- **AND** the component is wrapped in a Suspense boundary
- **THEN** the test SHALL verify no `TypeError: startSuspendingCommit is not a function` occurs
- **AND** the fallback SHALL render during suspension
- **AND** the layer SHALL render after promise resolves

#### Scenario: useSuspenseQuery pattern

- **WHEN** a component uses TanStack Query's useSuspenseQuery pattern
- **AND** the component renders a deck.gl layer with the fetched data
- **AND** the component is wrapped in a Suspense boundary
- **THEN** the test SHALL verify the fallback renders while loading
- **AND** the layer renders with data after resolution
- **AND** no unhandled errors occur during the async commit phase

#### Scenario: React 19 use() hook pattern

- **WHEN** a component uses React 19's use() hook to unwrap a promise
- **AND** the component renders a deck.gl layer
- **AND** the component is wrapped in a Suspense boundary
- **THEN** the test SHALL verify the fallback renders while promise is pending
- **AND** the layer renders after promise resolves
- **AND** no reconciler errors occur

#### Scenario: Nested Suspense boundaries

- **WHEN** multiple Suspense boundaries are nested in the component tree
- **AND** components at different levels suspend independently
- **THEN** the test SHALL verify each boundary shows its own fallback
- **AND** each boundary resolves independently
- **AND** no reconciler errors occur

#### Scenario: Non-suspending content in Suspense

- **WHEN** a Suspense boundary wraps static deck.gl layers that don't suspend
- **THEN** the test SHALL verify the layers render immediately
- **AND** the fallback is never shown
- **AND** no reconciler errors occur
