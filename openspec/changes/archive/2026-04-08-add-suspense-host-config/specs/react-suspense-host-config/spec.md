## ADDED Requirements

### Requirement: Suspense commit lifecycle functions

The reconciler host config SHALL export functions that React calls during Suspense-triggered commits. These functions form a coordinated API that React uses to track and manage suspended resources during the commit phase.

#### Scenario: startSuspendingCommit initializes state

- **WHEN** React begins a commit that may involve suspended components
- **THEN** `startSuspendingCommit()` SHALL return a state object that tracks pending suspensions

#### Scenario: suspendInstance registers suspended instances

- **WHEN** React encounters an instance that may suspend during commit
- **THEN** `suspendInstance(state, instance, type, props)` SHALL be called to register the instance with the suspended state

#### Scenario: waitForCommitToBeReady defers commit when needed

- **WHEN** React has visited all instances and checks if commit can proceed
- **THEN** `waitForCommitToBeReady(state, timeoutMs)` SHALL return null to proceed immediately (deck.gl layers are synchronous)

#### Scenario: getSuspendedCommitReason provides diagnostics

- **WHEN** React queries why a commit is suspended for DevTools
- **THEN** `getSuspendedCommitReason(state, container)` SHALL return null (no suspension occurs)

### Requirement: Suspense predicate functions

The reconciler host config SHALL export predicate functions that React calls to determine whether to enter the Suspense commit flow. These functions return boolean values indicating whether an instance might suspend.

#### Scenario: maySuspendCommit checks if instance can suspend

- **WHEN** React checks if a host instance might suspend during initial render
- **THEN** `maySuspendCommit(type, props)` SHALL return false (deck.gl layers never suspend)

#### Scenario: maySuspendCommitOnUpdate checks if update can suspend

- **WHEN** React checks if a host instance might suspend during update
- **THEN** `maySuspendCommitOnUpdate(type, oldProps, newProps)` SHALL return false (deck.gl layers never suspend)

#### Scenario: maySuspendCommitInSyncRender checks if sync render can suspend

- **WHEN** React checks if a host instance might suspend during synchronous render
- **THEN** `maySuspendCommitInSyncRender(type, props)` SHALL return false (deck.gl layers never suspend)

#### Scenario: preloadInstance checks if resources are ready

- **WHEN** React checks if an instance's resources are preloaded before commit
- **THEN** `preloadInstance(type, props)` SHALL return true (deck.gl layers are always ready)

### Requirement: Post-paint callback scheduling

The reconciler host config SHALL export a function that schedules callbacks to run after the browser has painted the current frame. This enables non-critical work to be deferred until after visual updates complete.

#### Scenario: requestPostPaintCallback schedules work after paint

- **WHEN** React needs to schedule work after browser paint
- **THEN** `requestPostPaintCallback(callback)` SHALL schedule the callback using requestAnimationFrame followed by setTimeout

### Requirement: TypeScript type definitions

The reconciler host config SHALL define TypeScript types for Suspense-related function signatures and state objects.

#### Scenario: SuspendedState type is defined

- **WHEN** developer imports reconciler config types
- **THEN** `SuspendedState` type SHALL be available representing the state object returned from `startSuspendingCommit()`

### Requirement: JSDoc documentation with source references

Each host config function SHALL include JSDoc comments that explain the function's purpose, parameters, return value, and include links to the React reconciler source code for reference.

#### Scenario: Function documentation includes reconciler references

- **WHEN** developer views function signature in IDE
- **THEN** JSDoc SHALL include `@see` tags linking to relevant React reconciler source files

#### Scenario: Function documentation follows existing patterns

- **WHEN** new Suspense functions are added
- **THEN** JSDoc SHALL follow the same format and style as existing host config functions in config.ts

### Requirement: Suspense boundaries work with async components

The reconciler SHALL support React Suspense boundaries wrapping components that suspend (throw promises), even when the deck.gl layers themselves are synchronous.

#### Scenario: Suspense fallback renders when child suspends

- **WHEN** a component inside a Suspense boundary throws a promise
- **THEN** the Suspense fallback SHALL render without errors
- **AND** no `TypeError: startSuspendingCommit is not a function` SHALL be thrown

#### Scenario: Suspense resolves and renders actual content

- **WHEN** the suspended promise resolves
- **THEN** React SHALL render the actual content (deck.gl layer)
- **AND** no unhandled errors SHALL occur during commit

#### Scenario: Nested Suspense boundaries work correctly

- **WHEN** multiple Suspense boundaries are nested in the tree
- **AND** components at different levels suspend
- **THEN** each Suspense boundary SHALL independently show its fallback
- **AND** no reconciler errors SHALL occur

### Requirement: React 19 compatibility

The reconciler SHALL remain compatible with React 19 and react-reconciler@0.31.0, which requires these Suspense functions to be present.

#### Scenario: No errors with React 19 Suspense

- **WHEN** using React 19 with react-reconciler@0.31.0
- **AND** Suspense boundaries wrap deck.gl layers
- **THEN** no TypeError about missing host config functions SHALL occur

#### Scenario: Works with useSuspenseQuery pattern

- **WHEN** using TanStack Query's useSuspenseQuery in a component
- **AND** that component renders a deck.gl layer
- **AND** the component is wrapped in a Suspense boundary
- **THEN** the fallback SHALL render while data loads
- **AND** the layer SHALL render after data resolves
- **AND** no reconciler errors SHALL occur

#### Scenario: Works with React 19 use() hook

- **WHEN** using React 19's use() hook to unwrap a promise
- **AND** the component renders a deck.gl layer
- **AND** the component is wrapped in a Suspense boundary
- **THEN** the fallback SHALL render while promise is pending
- **AND** the layer SHALL render after promise resolves
- **AND** no reconciler errors SHALL occur
