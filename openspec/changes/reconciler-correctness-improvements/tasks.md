## 1. Critical Fixes - Correctness

### 1.1 Fix getPublicInstance for refs

- [ ] 1.1.1 Update `getPublicInstance()` in `packages/reconciler/src/config.ts` to return `instance.node` instead of `instance`
- [ ] 1.1.2 Update return type from `Instance` to `Instance["node"]`
- [ ] 1.1.3 Create test file `packages/reconciler/src/__tests__/refs.test.ts`
- [ ] 1.1.4 Add test: ref.current returns actual Layer instance with deck.gl methods
- [ ] 1.1.5 Add test: ref.current returns actual View instance
- [ ] 1.1.6 Verify refs work in example app

### 1.2 Add appendChildToSet for persistence mode

- [ ] 1.2.1 Add `appendChildToSet()` method to `packages/reconciler/src/config.ts`
- [ ] 1.2.2 Implement immutable child array return: `[...childSet, child]`
- [ ] 1.2.3 Add debug logging with metadata
- [ ] 1.2.4 Create test file `packages/reconciler/src/__tests__/persistence-mode.test.ts`
- [ ] 1.2.5 Add test: appendChildToSet returns new array reference
- [ ] 1.2.6 Add test: parent cloning with children preserves child order
- [ ] 1.2.7 Add test: parent updates trigger correct child set rebuilding

### 1.3 Implement Suspense support methods

- [ ] 1.3.1 Add `cloneHiddenInstance()` method to `packages/reconciler/src/config.ts`
- [ ] 1.3.2 Add `cloneHiddenTextInstance()` method with error throw
- [ ] 1.3.3 Add `unhideInstance()` method (no-op implementation)
- [ ] 1.3.4 Add `unhideTextInstance()` method with error throw
- [ ] 1.3.5 Add debug logging for all four methods
- [ ] 1.3.6 Create test file `packages/reconciler/src/__tests__/suspense.test.ts`
- [ ] 1.3.7 Add test: cloneHiddenInstance returns instance with same structure
- [ ] 1.3.8 Add test: unhideInstance doesn't throw
- [ ] 1.3.9 Add test: text instance methods throw with helpful error
- [ ] 1.3.10 Create example app with Suspense boundary to verify functionality

## 2. Validation & Developer Experience

### 2.1 Layer ID validation

- [ ] 2.1.1 Add layer ID validation check in `createDeckglObject()` after `type === "layer"` handling
- [ ] 2.1.2 Check if `props.layer.id` is missing or equals "unknown"
- [ ] 2.1.3 Gate validation with `process.env.NODE_ENV === "development"`
- [ ] 2.1.4 Add console.warn with formatted message including layer class name
- [ ] 2.1.5 Create test file `packages/reconciler/src/__tests__/validation.test.ts`
- [ ] 2.1.6 Add test: warning shown when layer has no ID
- [ ] 2.1.7 Add test: warning shown when layer ID is "unknown"
- [ ] 2.1.8 Add test: no warning when layer has valid ID
- [ ] 2.1.9 Add test: validation only runs in development mode

### 2.2 Duplicate ID detection

- [ ] 2.2.1 Update `finalizeContainerChildren()` in `packages/reconciler/src/config.ts`
- [ ] 2.2.2 Add development-mode check with tree flattening
- [ ] 2.2.3 Extract layer IDs and detect duplicates
- [ ] 2.2.4 Add console.error with formatted message listing duplicate IDs
- [ ] 2.2.5 Add test in `validation.test.ts`: duplicate IDs trigger error
- [ ] 2.2.6 Add test: unique IDs don't trigger error
- [ ] 2.2.7 Add test: validation only runs in development mode
- [ ] 2.2.8 Add test: Views are excluded from duplicate ID check

### 2.3 Enhanced error messages

- [ ] 2.3.1 Update error message in `createDeckglObject()` for unsupported element types
- [ ] 2.3.2 Add list of available elements from `Object.keys(catalogue)`
- [ ] 2.3.3 Add suggestion about missing side-effects import
- [ ] 2.3.4 Format error with newlines for readability
- [ ] 2.3.5 Add test in `validation.test.ts`: error message includes available elements
- [ ] 2.3.6 Add test: error message suggests side-effects import

## 3. Type Safety & Host Context

### 3.1 Update type definitions

- [ ] 3.1.1 Update `Instance` interface in `packages/reconciler/src/types.ts`
- [ ] 3.1.2 Change `node: Layer | unknown` to `node: Layer | View`
- [ ] 3.1.3 Add `insideView?: boolean` to `HostContext` interface
- [ ] 3.1.4 Run TypeScript compilation to verify no errors
- [ ] 3.1.5 Update `organizeList()` return type in `packages/reconciler/src/utils.ts` to use `View[]` instead of `unknown[]`
- [ ] 3.1.6 Remove type assertions where possible thanks to improved types

### 3.2 Host context tracking

- [ ] 3.2.1 Update `getChildHostContext()` in `packages/reconciler/src/config.ts`
- [ ] 3.2.2 Add logic to detect View types (check `type.toLowerCase().includes("view")`)
- [ ] 3.2.3 Return new context object with `insideView` flag propagated
- [ ] 3.2.4 Add TODO comment for runtime View detection after single-layer-element lands
- [ ] 3.2.5 Create test file `packages/reconciler/src/__tests__/host-context.test.ts`
- [ ] 3.2.6 Add test: insideView flag set to true when entering View
- [ ] 3.2.7 Add test: insideView flag propagates to nested children
- [ ] 3.2.8 Add test: insideView flag remains false for non-View elements

## 4. Instance Management Improvements

### 4.1 Fix cloneInstance parameter handling

- [ ] 4.1.1 Update `cloneInstance()` in `packages/reconciler/src/config.ts`
- [ ] 4.1.2 Add conditional: if `keepChildren` is true, use `instance.children`
- [ ] 4.1.3 Add conditional: if `keepChildren` is false, use `newChildSet ?? []`
- [ ] 4.1.4 Add test in `persistence-mode.test.ts`: keepChildren=true preserves children
- [ ] 4.1.5 Add test: keepChildren=false with newChildSet uses new children
- [ ] 4.1.6 Add test: keepChildren=false without newChildSet uses empty array

### 4.2 Resource cleanup

- [ ] 4.2.1 Update `detachDeletedInstance()` in `packages/reconciler/src/config.ts`
- [ ] 4.2.2 Clear `instance.children` array to help GC
- [ ] 4.2.3 Add test in `persistence-mode.test.ts`: detached instance has empty children

### 4.3 Root management clarity

- [ ] 4.3.1 Refactor `createRoot()` in `packages/reconciler/src/renderer.ts`
- [ ] 4.3.2 Add early return if existing root found
- [ ] 4.3.3 Simplify creation path to remove conditional `roots.set()`
- [ ] 4.3.4 Add test in `packages/reconciler/src/__tests__/renderer.test.ts`
- [ ] 4.3.5 Add test: calling createRoot twice on same node returns same root
- [ ] 4.3.6 Add test: root reuse preserves store and container

## 5. Event Priority Enhancements

### 5.1 Expand event type coverage

- [ ] 5.1.1 Update `getCurrentEventPriority()` in `packages/reconciler/src/config.ts`
- [ ] 5.1.2 Add keyboard events to DiscreteEventPriority: `keydown`, `keyup`
- [ ] 5.1.3 Add focus events to DiscreteEventPriority: `focusin`, `focusout`
- [ ] 5.1.4 Add touch events to ContinuousEventPriority: `touchmove`
- [ ] 5.1.5 Add drag events to ContinuousEventPriority: `drag`
- [ ] 5.1.6 Add scroll events to ContinuousEventPriority: `scroll`
- [ ] 5.1.7 Create test file `packages/reconciler/src/__tests__/event-priority.test.ts`
- [ ] 5.1.8 Add test: keyboard events return DiscreteEventPriority
- [ ] 5.1.9 Add test: touch/drag/scroll events return ContinuousEventPriority
- [ ] 5.1.10 Add test: unknown events return DefaultEventPriority

## 6. Testing & Quality Assurance

### 6.1 Unit test coverage

- [ ] 6.1.1 Run `pnpm test` in reconciler package
- [ ] 6.1.2 Verify all new tests pass
- [ ] 6.1.3 Check test coverage report for new code
- [ ] 6.1.4 Add missing test cases for edge cases
- [ ] 6.1.5 Ensure all development-mode validations have tests confirming they don't run in production

### 6.2 Integration testing

- [ ] 6.2.1 Build all packages with `pnpm run build`
- [ ] 6.2.2 Run full test suite with `pnpm test` from root
- [ ] 6.2.3 Start and test examples/standalone with refs
- [ ] 6.2.4 Create example demonstrating Suspense support
- [ ] 6.2.5 Verify validation warnings appear in development mode
- [ ] 6.2.6 Verify validation warnings don't appear in production build
- [ ] 6.2.7 Test with layers missing IDs to confirm warnings
- [ ] 6.2.8 Test with duplicate IDs to confirm error messages

### 6.3 Type checking

- [ ] 6.3.1 Run `pnpm run typecheck` from root
- [ ] 6.3.2 Verify no TypeScript errors in reconciler package
- [ ] 6.3.3 Verify improved types work in example apps
- [ ] 6.3.4 Check that View types are properly inferred

## 7. Documentation & Examples

### 7.1 Update reconciler README

- [ ] 7.1.1 Document that refs now expose actual deck.gl instances
- [ ] 7.1.2 Add Suspense support to feature list
- [ ] 7.1.3 Document layer ID validation behavior
- [ ] 7.1.4 Add examples showing ref usage
- [ ] 7.1.5 Add examples showing Suspense usage

### 7.2 Create validation guide

- [ ] 7.2.1 Create `docs/VALIDATION.md` documenting all validation rules
- [ ] 7.2.2 Add section on layer ID requirements
- [ ] 7.2.3 Add section on duplicate ID detection
- [ ] 7.2.4 Include code examples of correct and incorrect usage
- [ ] 7.2.5 Document how to interpret validation messages

### 7.3 Update examples

- [ ] 7.3.1 Add ref usage example to examples/standalone
- [ ] 7.3.2 Create examples/suspense demonstrating Suspense boundaries
- [ ] 7.3.3 Ensure all example layers have explicit IDs
- [ ] 7.3.4 Verify examples show best practices

## 8. Comprehensive JSDoc Documentation

### 8.1 Core persistence mode methods

- [ ] 8.1.1 Document `createInstance()` with full JSDoc including @param, @returns, @see, @example
- [ ] 8.1.2 Add render phase rules and constraints to `createInstance()` docs
- [ ] 8.1.3 Link to React source: `ReactFiberCompleteWork.js` and `ReactFiberConfigFabric.js#L150`
- [ ] 8.1.4 Document `cloneInstance()` with persistence mode behavior explanation
- [ ] 8.1.5 Explain `keepChildren` and `newChildSet` parameters in `cloneInstance()` docs
- [ ] 8.1.6 Link to React source: `ReactFiberCompleteWork.js` (persistence mode path)
- [ ] 8.1.7 Document `appendChildToSet()` with immutability requirements
- [ ] 8.1.8 Link to React source: `ReactFiberConfigFabric.js` reference implementation
- [ ] 8.1.9 Document `createContainerChildSet()` explaining ChildSet lifecycle
- [ ] 8.1.10 Document `appendChildToContainerChildSet()` with container vs parent difference
- [ ] 8.1.11 Document `finalizeContainerChildren()` explaining it's called before commit
- [ ] 8.1.12 Link to React source: `ReactFiberCommitWork.js`
- [ ] 8.1.13 Document `replaceContainerChildren()` with deck.gl integration details
- [ ] 8.1.14 Explain flattening and organizing logic in `replaceContainerChildren()` docs
- [ ] 8.1.15 Link to React source: `ReactFiberCommitWork.js` commit phase

### 8.2 Instance and tree management

- [ ] 8.2.1 Document `getPublicInstance()` explaining ref exposure behavior
- [ ] 8.2.2 Add note about returning `instance.node` vs `instance` wrapper
- [ ] 8.2.3 Link to React source: `ReactFiberReconciler.js`
- [ ] 8.2.4 Document `appendInitialChild()` with render phase constraints
- [ ] 8.2.5 Explain parent-child relationship building in `appendInitialChild()` docs
- [ ] 8.2.6 Document `finalizeInitialChildren()` explaining return value meaning
- [ ] 8.2.7 Add note about `commitMount` relationship to `finalizeInitialChildren()`
- [ ] 8.2.8 Document `detachDeletedInstance()` with cleanup responsibilities
- [ ] 8.2.9 Link to React source: `ReactFiberCommitWork.js` deletion phase

### 8.3 Context and root management

- [ ] 8.3.1 Document `getRootHostContext()` with context propagation explanation
- [ ] 8.3.2 Add example showing how container store is used as root context
- [ ] 8.3.3 Document `getChildHostContext()` explaining View nesting tracking
- [ ] 8.3.4 Add examples of context propagation (HTML vs SVG analogy)
- [ ] 8.3.5 Link to React source: `ReactFiberCompleteWork.js` context flow
- [ ] 8.3.6 Document `prepareForCommit()` explaining pre-commit hooks
- [ ] 8.3.7 Add example from DOM renderer (text selection preservation)
- [ ] 8.3.8 Document `resetAfterCommit()` as mirror to `prepareForCommit()`
- [ ] 8.3.9 Document `preparePortalMount()` with portal behavior notes

### 8.4 Text and content handling

- [ ] 8.4.1 Document `createTextInstance()` explaining why it throws
- [ ] 8.4.2 Add note that deck.gl doesn't support text content
- [ ] 8.4.3 Document `shouldSetTextContent()` with optimization context
- [ ] 8.4.4 Explain why it returns false for deck.gl use case
- [ ] 8.4.5 Link to React source: DOM renderer text optimization example

### 8.5 Update and diffing (mutation mode stubs)

- [ ] 8.5.1 Document `prepareUpdate()` explaining it's not called in persistence mode
- [ ] 8.5.2 Add note about mutation mode vs persistence mode differences
- [ ] 8.5.3 Link to React source: `ReactFiberCompleteWork.js` mutation path

### 8.6 Suspense support methods

- [ ] 8.6.1 Document `cloneHiddenInstance()` with Suspense fallback behavior
- [ ] 8.6.2 Explain deck.gl `visible` prop relationship to hidden state
- [ ] 8.6.3 Document `cloneHiddenTextInstance()` explaining why it throws
- [ ] 8.6.4 Document `unhideInstance()` with Suspense resolution behavior
- [ ] 8.6.5 Document `unhideTextInstance()` explaining why it throws
- [ ] 8.6.6 Link to React source: `ReactFiberCompleteWork.js` Suspense handling
- [ ] 8.6.7 Document `maySuspendCommit()` with async loading explanation

### 8.7 Event priority and scheduling

- [ ] 8.7.1 Document `getCurrentEventPriority()` with discrete/continuous/default explanations
- [ ] 8.7.2 Add table mapping event types to priorities
- [ ] 8.7.3 Explain why window.event is used (React doesn't pass event parameter)
- [ ] 8.7.4 Link to React source: Event priority constants
- [ ] 8.7.5 Document `setCurrentUpdatePriority()` with update batching context
- [ ] 8.7.6 Document `getCurrentUpdatePriority()` explaining priority querying
- [ ] 8.7.7 Document `resolveUpdatePriority()` with fallback logic
- [ ] 8.7.8 Link to PR introducing these methods: `https://github.com/facebook/react/pull/28751`

### 8.8 Scope and focus methods

- [ ] 8.8.1 Document `getInstanceFromNode()` explaining scope API usage
- [ ] 8.8.2 Add note that it returns null (not currently implemented)
- [ ] 8.8.3 Document `beforeActiveInstanceBlur()` with focus management context
- [ ] 8.8.4 Document `afterActiveInstanceBlur()` as blur lifecycle hook
- [ ] 8.8.5 Document `getInstanceFromScope()` explaining scope queries
- [ ] 8.8.6 Document `prepareScopeUpdate()` with scope update lifecycle
- [ ] 8.8.7 Add note that these are advanced/experimental features
- [ ] 8.8.8 Link to React source: Focus management implementation

### 8.9 Advanced features

- [ ] 8.9.1 Document `shouldAttemptEagerTransition()` with eager transition explanation
- [ ] 8.9.2 Link to PR: `https://github.com/facebook/react/pull/26025`
- [ ] 8.9.3 Add note about returning false (conservative approach)

### 8.10 Helper functions and utilities

- [ ] 8.10.1 Document `createDeckglObject()` as internal factory method
- [ ] 8.10.2 Explain catalogue pattern and layer instantiation
- [ ] 8.10.3 Add @param tags for type and props
- [ ] 8.10.4 Document return value structure (node + children wrapper)
- [ ] 8.10.5 Add note about future layer ID validation enhancement

### 8.11 Configuration constants

- [ ] 8.11.1 Document `supportsMutation` and `supportsPersistence` flags
- [ ] 8.11.2 Explain persistence mode choice for deck.gl use case
- [ ] 8.11.3 Link to React reconciler modes documentation
- [ ] 8.11.4 Document `supportsHydration` with SSR context
- [ ] 8.11.5 Document `supportsMicrotasks` with discrete event explanation
- [ ] 8.11.6 Document `isPrimaryRenderer` explaining false choice
- [ ] 8.11.7 Document `noTimeout` with scheduling context
- [ ] 8.11.8 Document timing function proxies (`scheduleTimeout`, `cancelTimeout`, `scheduleMicrotask`)

### 8.12 Documentation validation

- [ ] 8.12.1 Verify all exported functions have @example tags
- [ ] 8.12.2 Verify all @example tags use proper code fences with `typescript` language
- [ ] 8.12.3 Verify all function parameters have @param tags
- [ ] 8.12.4 Verify all non-void functions have @returns tags
- [ ] 8.12.5 Verify no void functions have @returns tags
- [ ] 8.12.6 Verify all @see links point to valid React source URLs
- [ ] 8.12.7 Run TypeScript compiler to ensure JSDoc syntax is valid
- [ ] 8.12.8 Verify IDE autocomplete shows comprehensive documentation

## 9. Code Quality

### 9.1 Linting and formatting

- [ ] 9.1.1 Run `pnpm dlx ultracite fix` in reconciler package
- [ ] 9.1.2 Run `pnpm dlx ultracite check` to verify no issues
- [ ] 9.1.3 Verify all debug logging follows existing patterns
- [ ] 9.1.4 Check that all new code has appropriate comments

### 9.2 Performance verification

- [ ] 9.2.1 Verify development-mode checks are properly gated
- [ ] 9.2.2 Confirm production build tree-shakes validation code
- [ ] 9.2.3 Check bundle size hasn't increased significantly
- [ ] 9.2.4 Profile layer creation performance (should be unchanged)

## 10. Changeset and Release Preparation

### 10.1 Create changeset

- [ ] 10.1.1 Run `pnpm changeset` to create changeset file
- [ ] 10.1.2 Mark as patch version (bug fixes and internal improvements)
- [ ] 10.1.3 Write detailed changeset description covering all fixes
- [ ] 10.1.4 List critical fixes separately from enhancements
- [ ] 10.1.5 Note that refs and Suspense now work correctly
- [ ] 10.1.6 Mention comprehensive JSDoc documentation additions

### 10.2 Final verification

- [ ] 10.2.1 Review all modified files for consistency
- [ ] 10.2.2 Verify no unintended breaking changes
- [ ] 10.2.3 Confirm all tests pass in CI
- [ ] 10.2.4 Check that documentation is complete and accurate
- [ ] 10.2.5 Verify examples build and run correctly
- [ ] 10.2.6 Verify JSDoc appears correctly in IDE autocomplete
