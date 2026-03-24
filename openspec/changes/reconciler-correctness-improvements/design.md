## Context

The reconciler implementation uses React's persistence mode, where existing nodes are never mutated and every change creates a new tree that replaces the previous one. This mode is appropriate for deck.gl because layers are "descriptor objects that are very cheap to instantiate" and are matched by ID for efficient diffing.

However, the current implementation has gaps in the persistence mode API that can cause bugs, and lacks validation that would prevent common deck.gl integration mistakes. These issues were discovered through systematic comparison with:

- React's official reconciler documentation
- React Native Fabric's persistence mode implementation (the reference implementation)
- Other production reconcilers (react-three-fiber, react-nil, pixi-react, react-pdf)
- The actual React reconciler source code

## Goals / Non-Goals

**Goals:**

- Fix all correctness issues that break React features (refs, Suspense, updates)
- Add development-mode validation to prevent common bugs
- Improve error messages for better debugging
- Maintain backward compatibility
- Follow React reconciler best practices from reference implementations

**Non-Goals:**

- Changing reconciler mode (stays persistence mode)
- Performance optimizations (save for future work)
- Adding new user-facing APIs
- Modifying deck.gl integration patterns

## Decisions

### Decision 1: Fix getPublicInstance to expose deck.gl instances

**Choice:** Return `instance.node` instead of `instance`.

**Rationale:**

- When users create refs with `useRef<ScatterplotLayer>()`, they expect the actual deck.gl layer
- Current implementation returns internal wrapper `{ node, children }`, which has no deck.gl methods
- This is the standard pattern in all custom reconcilers (react-three-fiber, etc.)

**Implementation:**

```ts
export function getPublicInstance(instance: Instance): Instance["node"] {
  return instance.node; // Expose the actual Layer/View
}
```

**Impact:** Existing refs will start working. No breaking changes since current refs were effectively broken.

---

### Decision 2: Add appendChildToSet for persistence mode updates

**Choice:** Implement `appendChildToSet` that returns a new immutable child array.

**Rationale:**

- React Native Fabric has this method and it's required for proper persistence mode updates
- When a parent is cloned due to prop changes, React needs to rebuild its children array
- Without this, parent-child relationship updates may fail silently
- Current implementation "gets away with it" because `replaceContainerChildren` rebuilds everything, but this is fragile

**Implementation:**

```ts
export function appendChildToSet(
  childSet: ChildSet,
  child: Instance
): ChildSet {
  log.withMetadata({ childSet, child }).debug("appendChildToSet");
  return [...childSet, child]; // Immutable update
}
```

**Reference:** React Native Fabric's implementation follows this exact pattern.

---

### Decision 3: Implement Suspense support methods

**Choice:** Add all four required Suspense methods, with appropriate handling for unsupported text nodes.

**Rationale:**

- React will call these methods when Suspense boundaries are present
- Without them, the renderer crashes with "method not found" errors
- Even if Suspense isn't used immediately, it's a core React feature users expect to work
- Implementation is straightforward for deck.gl's use case

**Implementation:**

```ts
export function cloneHiddenInstance(
  instance: Instance,
  type: Type,
  props: Props
): Instance {
  // Return same instance structure
  // Deck.gl handles visibility through its `visible` prop
  return {
    node: instance.node,
    children: instance.children,
  };
}

export function cloneHiddenTextInstance(instance: Instance): Instance {
  throw new Error("Text nodes are not supported");
}

export function unhideInstance(instance: Instance, props: Props): void {
  // No-op: deck.gl handles visibility through prop updates
}

export function unhideTextInstance(textInstance: Instance, text: string): void {
  throw new Error("Text nodes are not supported");
}
```

**Why this approach:** Deck.gl layers already have a `visible` prop. When Suspense hides content, the layer can stay in the tree as-is, and deck.gl's prop diffing will handle the rest.

---

### Decision 4: Add layer ID validation in development mode

**Choice:** Validate layer IDs in `createDeckglObject` with actionable warning messages.

**Rationale:**

- Missing IDs cause layers to reinitialize on every render (expensive)
- This is the #1 footgun for deck.gl users (mentioned in multiple docs)
- Cannot enforce at type level (deck.gl's types make ID optional)
- Development warnings are the standard React pattern for catching mistakes early

**Implementation:**

```ts
if (process.env.NODE_ENV === "development") {
  const layer = props.layer as Layer;
  if (!layer.id || layer.id === "unknown") {
    console.warn(
      `⚠️  Layer missing explicit "id" prop. This causes expensive ` +
        `reinitialization on every render.\n\n` +
        `Add a stable ID:\n` +
        `<layer layer={new ${layer.constructor.name}({ id: "my-layer", ... })} />\n`
    );
  }
}
```

**Timing:** This validation happens at instance creation, catching the issue immediately.

---

### Decision 5: Validate duplicate IDs in finalizeContainerChildren

**Choice:** Add duplicate ID detection before committing the tree.

**Rationale:**

- Deck.gl matches layers by ID for diffing
- Duplicate IDs cause silent bugs where the wrong layer gets updated
- `finalizeContainerChildren` is the last validation point before commit
- Development-only check, no production overhead

**Implementation:**

```ts
export function finalizeContainerChildren(
  container: Container,
  newChildren: ChildSet
): void {
  if (process.env.NODE_ENV === "development") {
    const flatList = flattenTree(newChildren);
    const ids = flatList
      .filter((node): node is Layer => !isView(node))
      .map((layer: Layer) => layer.id);

    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicates.length > 0) {
      console.error(
        `❌ Duplicate layer IDs detected: ${[...new Set(duplicates)].join(", ")}\n` +
          `Each layer must have a unique ID for deck.gl's diffing to work correctly.`
      );
    }
  }
}
```

---

### Decision 6: Track View nesting with host context

**Choice:** Extend `HostContext` to track whether we're inside a View, propagate through `getChildHostContext`.

**Rationale:**

- Enables future validation rules specific to Views
- Useful for debugging (can show context in error messages)
- Zero runtime overhead outside development
- Standard pattern in React reconcilers (DOM uses this for SVG context)

**Implementation:**

```ts
// types.ts
export interface HostContext {
  store: Store;
  insideView?: boolean;
}

// config.ts
export function getChildHostContext(
  parentHostContext: HostContext,
  type: Type
): HostContext {
  const isView =
    type === "layer"
      ? false // Runtime check needed after single-layer-element lands
      : type.toLowerCase().includes("view");

  return {
    ...parentHostContext,
    insideView: parentHostContext.insideView || isView,
  };
}
```

**Future use cases:** Can validate coordinate system props, warn about nested Views, etc.

---

### Decision 7: Fix cloneInstance to respect keepChildren

**Choice:** Honor the `keepChildren` parameter and use `newChildSet` when provided.

**Rationale:**

- React passes these parameters for a reason
- `keepChildren: true` means "reuse existing children array"
- `keepChildren: false` + `newChildSet` means "use this new children array"
- Current implementation ignores both, which works but is semantically incorrect

**Implementation:**

```ts
export function cloneInstance(
  instance: Instance,
  type: string,
  oldProps: Props,
  newProps: Props,
  keepChildren: boolean,
  newChildSet?: ChildSet
): Instance {
  const newNode = createDeckglObject(type, newProps);

  return {
    node: newNode.node,
    children: keepChildren ? instance.children : (newChildSet ?? []),
  };
}
```

**Note:** We still create a new deck.gl layer because they're cheap descriptors. The `keepChildren` logic only affects our wrapper's children array.

---

### Decision 8: Improve error messages with context

**Choice:** Add helpful context to error messages including available options and suggestions.

**Rationale:**

- Generic errors like "Unsupported element type: scaterplotLayer" don't help users fix typos
- Listing available elements helps users discover correct names
- Suggesting common fixes (like missing side-effects import) saves debugging time

**Implementation:**

```ts
const name = toPascal(type);

if (!catalogue[name]) {
  throw new Error(
    `Unsupported element type: "${type}"\n\n` +
      `Available elements: ${Object.keys(catalogue).join(", ")}\n\n` +
      `Did you forget to import "@deckgl-fiber-renderer/reconciler/side-effects"?`
  );
}
```

---

### Decision 9: Add more event types to getCurrentEventPriority

**Choice:** Add keyboard, touch, focus, drag, and scroll events to priority detection.

**Rationale:**

- Current implementation only handles pointer events
- Users may attach keyboard handlers (e.g., arrow keys to pan map)
- Touch events are common on mobile
- More complete event coverage improves concurrent rendering behavior

**Implementation:**

```ts
switch (globalScope.event?.type) {
  // Discrete events
  case "click":
  case "contextmenu":
  case "dblclick":
  case "pointercancel":
  case "pointerdown":
  case "pointerup":
  case "keydown":
  case "keyup":
  case "focusin":
  case "focusout":
    return DiscreteEventPriority;

  // Continuous events
  case "pointermove":
  case "pointerout":
  case "pointerover":
  case "pointerenter":
  case "pointerleave":
  case "wheel":
  case "touchmove":
  case "drag":
  case "scroll":
    return ContinuousEventPriority;

  default:
    return DefaultEventPriority;
}
```

---

### Decision 10: Improve type safety by removing `unknown`

**Choice:** Type `Instance.node` as `Layer | View` instead of `Layer | unknown`.

**Rationale:**

- Views are properly typed in `@deck.gl/core`
- Using `unknown` forces type assertions throughout the codebase
- Proper types enable better IntelliSense and catch errors at compile time

**Implementation:**

```ts
// types.ts
export interface Instance {
  node: Layer | View; // Not unknown
  children: Instance[];
}

// utils.ts
export function organizeList(list: Instance["node"][]) {
  return list.reduce<{ views: View[]; layers: Layer[] }>(
    (acc, curr) => {
      if (isView(curr)) {
        acc.views.push(curr as View);
      } else {
        acc.layers.push(curr as Layer);
      }
      return acc;
    },
    { layers: [], views: [] }
  );
}
```

---

### Decision 11: Clean up resources in detachDeletedInstance

**Choice:** Clear children array to help garbage collection.

**Rationale:**

- Instances may hold references that prevent GC
- Clearing children helps GC reclaim memory in long-running apps
- No-op if instances are already GC-eligible, but doesn't hurt

**Implementation:**

```ts
export function detachDeletedInstance(instance: Instance): void {
  log.withMetadata({ instance }).debug("detachDeletedInstance");
  instance.children = [];
}
```

---

### Decision 12: Clarify root management logic

**Choice:** Simplify `createRoot` by early-returning existing roots.

**Rationale:**

- Current code checks for existing root but always creates new functions
- Confusing control flow with conditional `roots.set` at the end
- Clearer to return early if root exists, then handle creation path

**Implementation:**

```ts
export function createRoot(node: RootElement): ReconcilerRoot {
  const existingRoot = roots.get(node);
  if (existingRoot) {
    log.debug("Reusing existing root");
    return existingRoot;
  }

  // Create new root (existing logic)
  const store = storeInstance;
  const container = renderer.createContainer(...);

  function configure(props: DeckglProps) { /* existing */ }
  function render(children: ReactNode) { /* existing */ }

  const root = { configure, container, render, store };
  roots.set(node, root);
  return root;
}
```

---

### Decision 13: Add comprehensive JSDoc documentation to all reconciler functions

**Choice:** Document all host config methods with detailed JSDoc comments following TypeScript documentation standards, including React source code references.

**Rationale:**

- Current documentation is sparse with many functions marked "No documentation"
- Existing comments don't explain when/why React calls these methods
- Missing information about render phase vs commit phase behavior
- No links to React source code for reference
- Developers need context about persistence mode semantics
- IDE autocomplete should show comprehensive information

**Documentation Requirements:**

Each reconciler function must include:

1. **Description**: Clear explanation of purpose and when React calls it
2. **Phase information**: Whether it's called in render phase or commit phase
3. **Behavior constraints**: What the function can/cannot do (e.g., "must not mutate other nodes")
4. **@param tags**: All parameters with detailed descriptions
5. **@returns tags**: Return value description (unless void)
6. **@throws tags**: Any errors that can be thrown (exported functions only)
7. **@example tags**: Usage examples (exported functions only)
8. **@see tags**: Links to React source code where the function is called/defined
9. **Context**: For persistence mode methods, explain immutability requirements

**React Source References:**

Each function should link to relevant React source files:

- `createInstance` → [ReactFiberCompleteWork.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCompleteWork.js)
- `cloneInstance` → [ReactFiberCompleteWork.js (persistence mode)](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCompleteWork.js)
- `getPublicInstance` → [ReactFiberReconciler.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberReconciler.js)
- `finalizeContainerChildren`, `replaceContainerChildren` → [ReactFiberCommitWork.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js)
- Reference implementation: [ReactFiberConfigFabric.js](https://github.com/facebook/react/blob/main/packages/react-native-renderer/src/ReactFiberConfigFabric.js)

**Example Comprehensive Documentation:**

````ts
/**
 * Creates a new deck.gl Layer or View instance during the render phase.
 *
 * React calls this when a new element is mounted to the tree. The instance is created
 * but not yet attached to the render output - attachment happens in the commit phase.
 *
 * **Render Phase Rules:**
 * - CAN mutate the newly created instance before returning it
 * - CANNOT modify any other nodes or attach event handlers to parent tree
 * - CANNOT perform side effects (instance may be GC'd if not committed)
 *
 * **Persistence Mode Behavior:**
 * Returns a wrapper containing the deck.gl node and empty children array. The deck.gl
 * layer is a cheap descriptor object that will be matched by ID during diffing.
 *
 * @param type - Element type (e.g., "scatterplotLayer", "layer")
 * @param props - Initial props for the instance
 * @param rootContainerInfo - Root container (contains Zustand store)
 * @param hostContext - Context propagated from parent (tracks View nesting)
 * @param fiber - React Fiber node for debugging
 * @returns Instance wrapper with deck.gl node and empty children array
 *
 * @see https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCompleteWork.js - Called during completeWork
 * @see https://github.com/facebook/react/blob/main/packages/react-native-renderer/src/ReactFiberConfigFabric.js#L150 - Reference implementation
 *
 * @example
 * ```typescript
 * // React calls this when rendering <scatterplotLayer data={...} />
 * const instance = createInstance(
 *   "scatterplotLayer",
 *   { data: points, getPosition: d => d.coords },
 *   rootContainer,
 *   hostContext,
 *   fiber
 * );
 * // Returns: { node: ScatterplotLayer, children: [] }
 * ```
 */
export function createInstance(
  type: Type,
  props: Props,
  rootContainerInfo: Container,
  hostContext: HostContext,
  fiber: Fiber
): Instance {
  // implementation
}
````

**Benefits:**

- Developers understand when/why each function is called
- IDE autocomplete shows actionable documentation
- Links to React source enable deep understanding
- Explicit phase/constraint information prevents bugs
- Examples demonstrate actual usage patterns
- Future maintainers have full context

---

## Risks / Trade-offs

### Risk: Validation performance overhead in development

**Impact:** Additional checks in `createDeckglObject` and `finalizeContainerChildren` add overhead.

**Mitigation:**

- All validation is `process.env.NODE_ENV === "development"` gated
- Tree shaking removes validation code in production builds
- Development performance is acceptable trade-off for catching bugs early

### Risk: Suspense API may evolve

**Impact:** React's Suspense implementation for custom renderers might change.

**Mitigation:**

- Current implementation follows React Native Fabric (stable reference)
- Methods are simple pass-throughs that delegate to deck.gl's `visible` prop
- Easy to update if React changes the API

### Risk: Host context tracking adds complexity

**Impact:** Additional state to track through tree traversal.

**Mitigation:**

- Context object is small and shallow-copied efficiently
- Only tracks one boolean flag (`insideView`)
- Can be extended later without breaking changes

---

## Open Questions

None - all design decisions are based on established patterns from React Native Fabric and official documentation.

---

## References

- [React Reconciler Official Docs](https://github.com/facebook/react/blob/main/packages/react-reconciler/README.md)
- [React Native Fabric Persistence Mode Implementation](https://github.com/facebook/react/blob/main/packages/react-native-renderer/src/ReactFiberConfigFabric.js)
- [Context7: React Reconciler Deep Dive](https://context7.com/facebook/react?topic=reconciler)
- [React Reconciler Source Code](https://github.com/facebook/react/tree/main/packages/react-reconciler)
- [Deck.gl Layer Lifecycle Documentation](https://deck.gl/docs/developer-guide/custom-layers/layer-lifecycle)
