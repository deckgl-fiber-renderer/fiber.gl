## Why

When rendering a standalone `<Deckgl>` component without a 3rd party basemap overlay, the underlying Deck.gl instance creates its own canvas element in addition to the canvas created by the fiber.gl renderer. This results in two canvas elements in the DOM, with only one being used for rendering. The root cause is a React ref timing issue: the `useMemo` hook that builds the Deck.gl configuration runs during the render phase before refs are set, so `canvas.current` and `wrapper.current` are `null` when passed to the Deck constructor. Deck.gl interprets the missing canvas prop as a signal to auto-create its own canvas element.

## What Changes

- Move canvas and parent ref spreading from `useMemo` to `useIsomorphicLayoutEffect` in `packages/dom/src/components.tsx`
- Ensure refs are available during the layout effect when `root.configure()` is called, guaranteeing Deck.gl receives the fiber.gl canvas on first initialization
- Maintain performance by keeping stable props memoized separately from refs
- No API changes - purely an internal implementation fix

## Capabilities

### New Capabilities

None - this is a bug fix to existing functionality.

### Modified Capabilities

None - no spec-level behavior changes. The component should have always used a single canvas; this fixes the implementation to match the intended behavior.

## Impact

- **Affected code**: `packages/dom/src/components.tsx` (DeckglComponent function)
- **User impact**: Fixes issue #21 - users will no longer see duplicate canvas elements in the DOM when using standalone `<Deckgl>` components
- **Performance impact**: Neutral - maintains same memoization strategy, just moves ref spreading to the correct lifecycle phase
- **Breaking changes**: None - this is a bug fix that corrects behavior to match expectations
- **Dependencies**: No external dependency changes
