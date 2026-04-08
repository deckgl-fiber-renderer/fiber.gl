## Why

React 19's reconciler (0.31.0) requires Suspense-related host config functions even when host components don't themselves suspend. When any component in the tree suspends (e.g., `useSuspenseQuery`), React calls `startSuspendingCommit()` during the commit phase, causing `TypeError: startSuspendingCommit is not a function`. This breaks Suspense boundaries wrapping deck.gl layers (GitHub issue #15).

## What Changes

- Add 7 Suspense-related host config functions to `packages/reconciler/src/config.ts`:
  - `startSuspendingCommit()` - Initialize suspended commit state tracking
  - `suspendInstance()` - Register instances that may suspend
  - `waitForCommitToBeReady()` - Defer commit until resources load
  - `preloadInstance()` - Check if resources are ready before commit
  - `maySuspendCommitOnUpdate()` - Check if updates might suspend
  - `maySuspendCommitInSyncRender()` - Check if sync renders might suspend
  - `getSuspendedCommitReason()` - Provide diagnostic string for suspended commits
- Add `requestPostPaintCallback()` host config function for scheduling work after browser paint
- Add TypeScript type definitions for `SuspendedState` and related types
- Add comprehensive JSDoc documentation with React reconciler source references
- Update `suspense-query.test.tsx` to verify Suspense boundaries work correctly

## Capabilities

### New Capabilities

- `react-suspense-host-config`: Host config functions required for React 19 Suspense compatibility

### Modified Capabilities

- `reconciler-react-compat-testing`: Extend test coverage to include Suspense boundary scenarios with async components

## Impact

**Packages affected:**

- `@deckgl-fiber-renderer/reconciler`: Core changes to host config

**APIs modified:**

- Host config exports (internal API, no breaking changes to public API)

**Dependencies:**

- No new dependencies
- Works with existing react-reconciler@0.31.0

**User impact:**

- Fixes: Suspense boundaries now work correctly when wrapping deck.gl layers
- Enables: Patterns like Next.js App Router server components with `useSuspenseQuery`
- No breaking changes to existing user code
