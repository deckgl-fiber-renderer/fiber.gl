## 1. Type Definitions

- [ ] 1.1 Add `SuspendedState` interface to `packages/reconciler/src/types.ts` with `pendingCount: number` property
- [ ] 1.2 Export `SuspendedState` type from types.ts

## 2. Suspense Lifecycle Functions

- [ ] 2.1 Implement `startSuspendingCommit()` in config.ts returning `{ pendingCount: 0 }`
- [ ] 2.2 Add JSDoc for `startSuspendingCommit()` with @returns and @see tags linking to React Noop Renderer
- [ ] 2.3 Implement `suspendInstance(state, instance, type, props)` as no-op void function
- [ ] 2.4 Add JSDoc for `suspendInstance()` explaining deck.gl layers never suspend
- [ ] 2.5 Implement `waitForCommitToBeReady(state, timeoutMs)` returning null
- [ ] 2.6 Add JSDoc for `waitForCommitToBeReady()` with return type explanation

## 3. Suspense Predicate Functions

- [ ] 3.1 Implement `maySuspendCommitOnUpdate(type, oldProps, newProps)` returning false
- [ ] 3.2 Add JSDoc for `maySuspendCommitOnUpdate()` following existing patterns
- [ ] 3.3 Implement `maySuspendCommitInSyncRender(type, props)` returning false
- [ ] 3.4 Add JSDoc for `maySuspendCommitInSyncRender()` following existing patterns
- [ ] 3.5 Implement `preloadInstance(type, props)` returning true
- [ ] 3.6 Add JSDoc for `preloadInstance()` explaining layers are always ready

## 4. Diagnostic and Callback Functions

- [ ] 4.1 Implement `getSuspendedCommitReason(state, rootContainer)` returning null
- [ ] 4.2 Add JSDoc for `getSuspendedCommitReason()` with React reconciler reference
- [ ] 4.3 Implement `requestPostPaintCallback(callback)` using requestAnimationFrame + setTimeout pattern
- [ ] 4.4 Add JSDoc for `requestPostPaintCallback()` explaining post-paint timing

## 5. Testing - Suspense Lifecycle

- [ ] 5.1 Update `packages/reconciler/src/__tests__/suspense.test.ts` to verify new functions exist and are callable
- [ ] 5.2 Verify `suspense-query.test.tsx` passes without unhandled errors (currently failing with TypeError)
- [ ] 5.3 Add test case for `startSuspendingCommit()` returns correct state shape
- [ ] 5.4 Add test case for `waitForCommitToBeReady()` returns null for no-op behavior

## 6. Testing - Suspense Integration

- [ ] 6.1 Verify "should handle component that suspends while rendering a layer" test passes
- [ ] 6.2 Verify "should handle React 19 use() hook pattern" test passes
- [ ] 6.3 Verify "should handle nested Suspense boundaries" test passes
- [ ] 6.4 Verify no unhandled errors occur during async commit phase

## 7. Testing - Post-Paint Callback

- [ ] 7.1 Add test for `requestPostPaintCallback()` verifies callback is called
- [ ] 7.2 Add test verifying callback fires after requestAnimationFrame
- [ ] 7.3 Add test verifying callback receives performance.now() timestamp

## 8. Verification and Documentation

- [ ] 8.1 Run full test suite and verify all 133+ tests pass
- [ ] 8.2 Verify test coverage remains above 99%
- [ ] 8.3 Run Ultracite lint and format checks (pnpm dlx ultracite check)
- [ ] 8.4 Verify TypeScript compilation passes with no errors
- [ ] 8.5 Test in Next.js App Router example with useSuspenseQuery pattern (manual verification)
- [ ] 8.6 Create changeset with patch version bump (bugfix, not breaking change)
