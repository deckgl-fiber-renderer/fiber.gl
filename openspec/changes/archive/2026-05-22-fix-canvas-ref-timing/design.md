## Context

The `DeckglComponent` in `packages/dom/src/components.tsx` uses React refs to create DOM elements (canvas and wrapper) and passes them to the Deck.gl constructor. However, there's a timing mismatch:

**Current flow:**
1. Render phase: `useMemo` executes → refs are `null`
2. Commit phase: React assigns refs → `canvas.current` and `wrapper.current` are set
3. Layout effect: `root.configure()` called with stale config from step 1
4. Deck.gl sees no canvas → creates its own canvas element

**Deck.gl expectations:**
- If `props.canvas` is provided during construction → use it
- If `props.canvas` is `null`/`undefined` → auto-create canvas and append to `props.parent` or `document.body`
- Canvas cannot be changed after construction (not supported by Deck.gl's `setProps`)

**Key constraint:** Deck.gl's canvas is set during device initialization in the constructor and is immutable thereafter. The canvas must be available when `new Deck(props)` is called.

## Goals / Non-Goals

**Goals:**
- Fix double canvas creation by ensuring refs are available when Deck.gl is initialized
- Maintain performance - avoid recreating the config object on every render
- Keep the change minimal and surgical - only touch the ref timing issue
- Preserve all existing functionality and API surface

**Non-Goals:**
- Change the public API of the `<Deckgl>` component
- Modify how Deck.gl handles canvas internally
- Refactor the reconciler or broader component architecture
- Add new features or capabilities

## Decisions

### Decision 1: Move ref spreading from useMemo to useIsomorphicLayoutEffect

**Choice:** Keep props in `useMemo` (without canvas/parent refs) and spread refs in the layout effect where `configure()` is called.

**Rationale:**
- `useIsomorphicLayoutEffect` runs after the commit phase when refs are guaranteed to be populated
- Maintains memoization performance - config updates only when props change, not on every render
- Minimal code change - remove refs from `useMemo`, add them in the layout effect

**Implementation pattern:**
```tsx
// Before (broken):
const config = useMemo(() => ({
  ...props,
  ...(canvas.current && { canvas: canvas.current }),  // null on first render
  ...(wrapper.current && { parent: wrapper.current }), // null on first render
}), [props]);

useIsomorphicLayoutEffect(() => {
  root.configure(config); // config has null refs
}, [config]);

// After (fixed):
const config = useMemo(() => props, [props]); // No refs

useIsomorphicLayoutEffect(() => {
  root.configure({
    ...config,
    // Only set refs if not explicitly provided in props
    ...(!config.canvas && canvas.current && { canvas: canvas.current }),
    ...(!config.parent && wrapper.current && { parent: wrapper.current }),
  });
}, [config]);
```

**Alternatives considered:**
1. **Use `useIsomorphicLayoutEffect` for entire config creation** - Rejected because it would recreate the config object on every render, hurting performance
2. **Call `setProps({ canvas })` after construction** - Rejected because Deck.gl doesn't support changing canvas after initialization (verified by examining deck.gl source code: canvas is set in `_createCanvas()` during constructor → `_createDevice()` → `luma.createDevice()` chain)
3. **Use `useEffect` instead of layout effect** - Rejected because regular effects run after paint, introducing a flash of the wrong canvas

### Decision 2: Keep the `configured` flag in the reconciler

**Choice:** No changes to the reconciler's `configure()` function - it already has a guard to prevent recreation.

**Rationale:**
- The `configured` flag (line 232 in renderer.ts) ensures Deck.gl is only instantiated once
- The fix ensures the *first* call has the correct refs - no subsequent calls are needed
- Cleaner separation of concerns: DOM component handles timing, reconciler handles Deck.gl lifecycle

## Risks / Trade-offs

**Risk:** Refs could theoretically still be null in the layout effect
→ **Mitigation:** The existing null check (`if (node)`) handles cases where refs aren't set.

**Risk:** Config object might be stale if props change between render and layout effect
→ **Mitigation:** The dependency array `[children, config, Bridge]` ensures the effect re-runs when config changes.

**Trade-off:** Creates config object inline in the layout effect instead of using a pure memoized value
→ **Acceptable:** The object spread is cheap and only happens when deps change.

**Implementation detail:** We check `!config.canvas` and `!config.parent` before applying refs to respect explicit props
→ **Rationale:** If the user provides an explicit canvas or parent element via props, we shouldn't override it with our internal refs. This supports advanced use cases like external canvas management.
