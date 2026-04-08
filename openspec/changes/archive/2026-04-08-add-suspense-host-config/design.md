## Context

React 19's reconciler (react-reconciler@0.31.0) calls Suspense-related host config functions during the commit phase when ANY component in the tree suspends, regardless of whether the host components themselves suspend. The reconciler expects these functions to exist and throws `TypeError: startSuspendingCommit is not a function` when they're missing.

**Current state:**

- `packages/reconciler/src/config.ts` exports 34 host config functions
- Has `maySuspendCommit()` returning `false` (deck.gl layers never suspend)
- Missing 7 other Suspense-related functions that React 19 requires
- Missing `requestPostPaintCallback()` for post-paint work scheduling

**Key constraint:**
Deck.gl layers are synchronous descriptor objects. They never suspend or load async resources during commit. Even when `layer.data` is a Promise (Pattern B from deck.gl docs), deck.gl manages loading internally - the Layer instance itself is synchronously created.

## Goals / Non-Goals

**Goals:**

- Fix `TypeError: startSuspendingCommit is not a function` in React 19 (issue #15)
- Enable Suspense boundaries to wrap components that render deck.gl layers
- Support Next.js App Router patterns (server components + `useSuspenseQuery`)
- Support React 19's `use()` hook for promises
- Add `requestPostPaintCallback()` for telemetry/analytics use cases
- Maintain 99%+ test coverage

**Non-Goals:**

- Making deck.gl layers themselves suspend (they remain synchronous)
- Integrating with deck.gl's `onDataLoad` callbacks or async data features
- Supporting View Transitions API (`suspendOnActiveViewTransition`)
- Implementing form reset hooks (`resetFormInstance`)
- Adding scheduler instrumentation (`trackSchedulerEvent`, etc.)

## Decisions

### Decision 1: Implement Suspense functions as no-ops

**Choice:** Return safe defaults that tell React "proceed immediately, nothing suspended"

**Rationale:**

- Deck.gl layers are synchronous descriptors that never suspend
- React still needs these functions to exist for API compatibility
- No-ops satisfy the contract without introducing false suspension behavior
- Aligns with existing `maySuspendCommit() → false` pattern

**Alternatives considered:**

1. **Throw errors**: Would break Suspense boundaries entirely
2. **Return undefined**: Would cause TypeScript errors and potential runtime issues
3. **Actually track suspension**: Unnecessary complexity since layers never suspend

**Implementation:**

```typescript
// Simple state object (no actual tracking needed)
export function startSuspendingCommit(): SuspendedState {
  return { pendingCount: 0 };
}

// No-op: nothing to register
export function suspendInstance(
  state: SuspendedState,
  instance: Instance,
  type: Type,
  props: Props
): void {
  // deck.gl layers are synchronous, nothing to suspend
}

// Null: proceed immediately
export function waitForCommitToBeReady(
  state: SuspendedState,
  timeoutMs: number
): ((commit: () => void) => () => void) | null {
  return null;
}

// Null: no suspension reason
export function getSuspendedCommitReason(
  state: SuspendedState,
  rootContainer: Container
): string | null {
  return null;
}
```

### Decision 2: Predicates return false/true for "never suspends"

**Choice:** All predicates return values indicating layers never suspend

**Rationale:**

- Consistent with existing `maySuspendCommit() → false`
- Tells React to skip calling the lifecycle functions (optimization)
- Accurately reflects deck.gl layer behavior

**Implementation:**

```typescript
// Already exists, keep as-is
export function maySuspendCommit(type: Type, props: Props): boolean {
  return false;
}

// New variants for specific scenarios
export function maySuspendCommitOnUpdate(
  type: Type,
  oldProps: Props,
  newProps: Props
): boolean {
  return false;
}

export function maySuspendCommitInSyncRender(
  type: Type,
  props: Props
): boolean {
  return false;
}

// True: always ready (inverse logic)
export function preloadInstance(type: Type, props: Props): boolean {
  return true;
}
```

### Decision 3: Real implementation for requestPostPaintCallback

**Choice:** Use `requestAnimationFrame` + `setTimeout(0)` pattern

**Rationale:**

- This function is independent of Suspense (different use case)
- Useful for telemetry, analytics, non-critical updates
- Well-established pattern for post-paint timing
- `requestAnimationFrame` fires before paint, `setTimeout(0)` fires after

**Alternatives considered:**

1. **No-op**: Loses telemetry capability
2. **Just setTimeout**: Doesn't guarantee paint has occurred
3. **Just requestAnimationFrame**: Fires before paint, not after

**Implementation:**

```typescript
export function requestPostPaintCallback(
  callback: (time: number) => void
): void {
  requestAnimationFrame(() => {
    setTimeout(() => callback(performance.now()), 0);
  });
}
```

### Decision 4: SuspendedState type as minimal interface

**Choice:** Define as `{ pendingCount: number }` to match React Noop Renderer pattern

**Rationale:**

- Simplest type that satisfies the contract
- Matches reference implementation (react-noop-renderer)
- No need for complex state since we never actually suspend

**Alternatives considered:**

1. **Use `unknown`**: Less type-safe, harder to understand intent
2. **Rich state object**: Unnecessary complexity for no-op functions

**Implementation:**

```typescript
export interface SuspendedState {
  pendingCount: number;
}
```

### Decision 5: JSDoc follows existing config.ts patterns

**Choice:** Comprehensive JSDoc with React reconciler line references

**Rationale:**

- Maintains consistency with existing functions in config.ts
- Helps future maintainers understand React's expectations
- Links to source code provide authoritative reference

**Pattern:**

```typescript
/**
 * Called at the start of a commit that may suspend.
 *
 * Returns a state object that tracks pending suspensions during the commit phase.
 * For deck.gl renderer, returns minimal state since layers never suspend.
 *
 * @returns SuspendedState object with pendingCount
 * @see {@link https://github.com/facebook/react/blob/main/packages/react-noop-renderer/src/createReactNoop.js#L363 React Noop Renderer implementation}
 */
export function startSuspendingCommit(): SuspendedState {
  return { pendingCount: 0 };
}
```

## Risks / Trade-offs

### Risk: Pattern B (async deck.gl data) won't work with Suspense

**Impact:** Users who pass Promises directly to `layer.data` won't get Suspense integration

**Mitigation:**

- Document "Pattern A" (React-level Suspense) as the recommended approach
- All examples use Pattern A already
- deck.gl handles async data loading internally regardless
- Can add Pattern B support in future if users request it

### Risk: Future React versions may change Suspense API

**Impact:** New required functions or changed signatures

**Mitigation:**

- Monitor react-reconciler updates
- Comprehensive test coverage will catch API changes
- Functions are isolated in config.ts (easy to update)

### Trade-off: No telemetry for deck.gl layer loading

**Impact:** Can't track when deck.gl finishes loading async resources

**Reasoning:**

- deck.gl manages loading internally via `onDataLoad` callbacks
- Suspense functions are about React's commit phase, not deck.gl's loading
- Users can use deck.gl's own callbacks if needed

### Trade-off: requestPostPaintCallback timing isn't guaranteed

**Impact:** Callback fires "approximately" after paint, not precisely

**Reasoning:**

- Browser event loop timing is inherently imprecise
- Good enough for analytics/telemetry use cases
- Alternative (ResizeObserver, MutationObserver) would be more complex

## Open Questions

None - design is ready for implementation.
