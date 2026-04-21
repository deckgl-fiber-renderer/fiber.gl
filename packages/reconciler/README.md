# @deckgl-fiber-renderer/reconciler

> **Internal package.** Most users want [@deckgl-fiber-renderer/dom](../dom) instead.

React reconciler implementation for deck.gl. Powers the JSX-to-deck.gl bridge but is rarely used directly.

## Installation

```bash
pnpm add @deckgl-fiber-renderer/reconciler
```

Automatically installed as a dependency of `@deckgl-fiber-renderer/dom`. Only install directly if building custom renderers or contributing.

---

## Architecture

### What is a React Reconciler?

React's reconciler diffs element trees and determines what changed. The `react-reconciler` package lets you build custom renderers for non-DOM targets.

```
React JSX → Reconciler → Flattened layers/views → Deck instance
```

### Persistence Mode

This reconciler uses **persistence mode** (creates new objects) instead of **mutation mode** (updates in place).

**Rationale:** deck.gl layers are immutable descriptors designed to be replaced:

> "Layers are descriptor objects that are very cheap to instantiate. Create a new set of layers every render cycle." - [deck.gl docs](https://deck.gl/docs/developer-guide/using-layers)

deck.gl diffs layers internally by matching IDs and comparing props. The reconciler creates new layer instances; deck.gl's algorithm handles efficient updates.

### Tree Flattening

deck.gl expects flat arrays, but React trees are nested. The reconciler flattens automatically:

**Input (JSX):**

```tsx
<Deckgl>
  <view view={mainView}>
    <layer layer={layer1} />
    <layer layer={layer2} />
  </view>
</Deckgl>
```

**Output (flattened):**

```js
{
  layers: [layer1, layer2],
  views: [mainView]
}
```

Layers can nest arbitrarily deep in React components. The reconciler collects them recursively.

### ID-Based Diffing

deck.gl matches layers by ID for efficient updates:

1. Match layers by ID
2. Diff props for matching IDs
3. Update only changed props

**Without IDs:** deck.gl generates random IDs. Each render looks like a new layer, triggering expensive re-initialization.

This is why the reconciler validates IDs in development mode.

**Learn more:** https://deck.gl/docs/developer-guide/using-layers#layer-identity-and-diffing

---

## Reference

### Exported APIs

#### `createRoot(container)`

Creates a reconciler root for a container element.

```tsx
import { createRoot } from "@deckgl-fiber-renderer/reconciler";

const root = createRoot(canvasElement);
root.configure({ initialViewState: { ... } });
root.render(<layer layer={...} />);
```

**Parameters:**

- `container` - DOM element (canvas or div) to render into

**Returns:** `ReconcilerRoot`

#### `unmountAtNode(container)`

Unmounts and cleans up a reconciler root.

```tsx
import { unmountAtNode } from "@deckgl-fiber-renderer/reconciler";

unmountAtNode(canvasElement);
```

**Parameters:**

- `container` - DOM element to unmount from

**Cleanup:** Unmounts React tree, destroys deck.gl instance, releases GPU resources, removes from `roots` registry.

#### `roots`

Map of active reconciler roots.

```tsx
import { roots } from "@deckgl-fiber-renderer/reconciler";

if (roots.has(canvasElement)) {
  const existingRoot = roots.get(canvasElement);
  // Work with existing root
}
```

**Type:** `Map<RootElement, ReconcilerRoot>`

**Usage:** Ensures root idempotency. Check before creating new roots to avoid duplicates.

#### `extend(objects)` (deprecated)

Registers layer/view constructors for v1 syntax.

```tsx
import { extend } from "@deckgl-fiber-renderer/reconciler";

extend({ MyCustomLayer });
```

**Deprecated:** Will be removed in v3. Use `<layer layer={new MyCustomLayer(...)} />` instead of registering.

#### `ReconcilerRoot`

Type for reconciler root instances.

```tsx
type ReconcilerRoot = {
  configure(props: DeckglProps): void;
  render(element: ReactNode): void;
  unmount(): void;
};
```

---

## Development Mode Features

### Validation System

The reconciler validates layers in development mode (`process.env.NODE_ENV === "development"`). Checks are stripped from production builds via dead code elimination.

#### Missing ID Warning

Triggered when a layer lacks an explicit `id` prop:

```
⚠️ Layer missing explicit "id" prop. This causes expensive reinitialization on every render.
```

**Detection:** Checks for missing or default IDs (`"unknown"`).

**Fix:** Add explicit `id` to layer constructor.

#### Duplicate ID Error

Triggered when multiple layers share the same ID:

```
❌ Duplicate layer IDs detected: points, lines
```

**Detection:** Tracks all layer IDs in current render.

**Impact:** Duplicate IDs break deck.gl's diffing. Props from one layer may apply to another.

**Fix:** Ensure each layer has a unique `id`.

#### Production Behavior

All validation wrapped in `if (process.env.NODE_ENV === 'development')` checks. Bundlers eliminate this code in production builds. Zero runtime overhead in production.

---

## Related Packages

- **[@deckgl-fiber-renderer/dom](../dom)** - Main package users install
- **[@deckgl-fiber-renderer/types](../types)** - TypeScript definitions

## Further Reading

- [React Reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler)
- [Building a Custom Renderer](https://agent-hunt.medium.com/hello-world-custom-react-renderer-9a95b7cd04bc)
- [deck.gl Layer Lifecycle](https://deck.gl/docs/developer-guide/custom-layers/layer-lifecycle)
