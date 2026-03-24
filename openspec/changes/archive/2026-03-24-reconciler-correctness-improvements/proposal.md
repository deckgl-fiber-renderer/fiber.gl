## Why

The current React reconciler implementation has several correctness and robustness issues that prevent key React features from working properly and can cause runtime bugs. These issues stem from incomplete implementation of the persistence mode API and missing validation that would prevent common deck.gl integration mistakes.

**Critical Issues:**

1. **Broken refs**: `getPublicInstance` returns internal wrapper instead of deck.gl Layer/View, making refs unusable
2. **Missing update handling**: No `appendChildToSet` method breaks parent-child relationship updates in persistence mode
3. **Suspense crashes**: Missing required Suspense methods will crash the renderer when Suspense boundaries are used
4. **Silent layer bugs**: Duplicate layer IDs and missing IDs cause expensive re-initialization and incorrect updates due to deck.gl's ID-based diffing

**Developer Experience Issues:**

- No validation for the most common footgun (missing layer IDs)
- No detection of duplicate layer IDs that break deck.gl's diffing
- Generic error messages that don't help users fix issues
- Missing host context tracking prevents useful validation

These issues affect reliability, debugging experience, and prevent adoption of React features like Suspense, refs, and concurrent rendering.

## What Changes

- **CRITICAL**: Fix `getPublicInstance` to expose actual deck.gl Layer/View instances for refs
- **CRITICAL**: Add `appendChildToSet` to properly handle parent-child updates in persistence mode
- **CRITICAL**: Implement Suspense support methods (`cloneHiddenInstance`, `unhideInstance`, etc.)
- Add development-mode validation for missing and duplicate layer IDs
- Implement host context tracking for View nesting
- Add tree structure validation in `finalizeContainerChildren`
- Improve error messages with actionable suggestions
- Clean up resources in `detachDeletedInstance`
- Enhance `getCurrentEventPriority` with additional event types
- Improve type safety by replacing `unknown` with proper deck.gl types
- Fix `cloneInstance` to respect `keepChildren` parameter
- Clarify root management logic in `renderer.ts`
- **NEW**: Add comprehensive JSDoc documentation to all reconciler functions with React source references

## Capabilities

### New Capabilities

- `suspense-support`: Full React Suspense support with proper hidden instance cloning and restoration
- `layer-id-validation`: Development-mode validation preventing missing/duplicate layer IDs
- `view-context-tracking`: Host context tracking for View nesting and validation
- `enhanced-error-messages`: Actionable error messages with suggestions and available options
- `comprehensive-jsdoc`: Complete JSDoc documentation for all reconciler functions with React source references and examples

### Modified Capabilities

- `ref-support`: Fix existing refs to expose actual deck.gl instances instead of internal wrappers
- `persistence-mode-updates`: Complete persistence mode implementation with proper child set handling

## Impact

**Affected Packages:**

- `@deckgl-fiber-renderer/reconciler`: All changes are in this package
  - `src/config.ts`: Core reconciler host config methods (8 methods modified, 6 added)
  - `src/renderer.ts`: Root management clarification
  - `src/types.ts`: Enhanced type safety, host context extension
  - `src/utils.ts`: Type safety improvements

**Breaking Changes:**

None. All changes are backward compatible additions and internal fixes.

**Migration Impact:**

No user-facing API changes. Users will immediately benefit from:

- Working refs
- Suspense support
- Better error messages
- Prevention of common bugs via validation

**External Dependencies:**

- React 19 compatibility maintained
- Deck.gl 9.1+ compatibility maintained
- No new dependencies required

**References:**

- [React Reconciler README](https://github.com/facebook/react/blob/main/packages/react-reconciler/README.md)
- [React Native Fabric Persistence Mode](https://github.com/facebook/react/blob/main/packages/react-native-renderer/src/ReactFiberConfigFabric.js)
- [Context7: React Reconciler](https://context7.com/facebook/react?topic=reconciler)
- [React Reconciler Source](https://github.com/facebook/react/tree/main/packages/react-reconciler)
