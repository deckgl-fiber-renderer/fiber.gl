# @deckgl-fiber-renderer/reconciler

> **This is an internal package.** Most users want [@deckgl-fiber-renderer/dom](../dom) instead.

React reconciler implementation for deck.gl. This package powers the JSX-to-deck.gl bridge but is rarely used directly.

## Installation

```bash
pnpm add @deckgl-fiber-renderer/reconciler
```

This package is automatically installed as a dependency of `@deckgl-fiber-renderer/dom`. You only need to install it directly if you're building custom renderers or contributing to the project.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Key Concepts](#key-concepts)
- [Development Mode Features](#development-mode-features)
- [v2 Changes](#v2-changes)
- [Implementation Details](#implementation-details)
- [Related Packages](#related-packages)

## Architecture Overview

### What is a React Reconciler?

React's reconciler is the algorithm that diffs React element trees and determines what changed. React provides `react-reconciler` as a package that lets you build custom renderers for non-DOM targets.

The reconciler bridges React's component lifecycle to deck.gl's layer system:

```
React JSX tree → Reconciler → Flattened deck.gl layers/views → Deck instance
```

### Persistence Mode vs Mutation Mode

React reconcilers can operate in two modes:

- **Mutation mode** - Updates existing objects in place
- **Persistence mode** - Creates new objects for every change

This reconciler uses **persistence mode** because deck.gl layers are designed to be replaced, not mutated. From the deck.gl documentation:

> "Layers are descriptor objects that are very cheap to instantiate. The philosophy is to create a new set of layers every render cycle."

deck.gl handles the diffing internally by matching layers by ID and determining which props changed.

### Reconciler Pipeline

```
1. JSX elements → createInstance()
2. Build instance tree → commitMount()
3. Flatten tree → layers/views arrays
4. Pass to Deck instance
5. deck.gl diffs by ID
```

On updates:

```
1. Props change → commitUpdate()
2. Rebuild affected nodes
3. Re-flatten tree
4. Pass new arrays to Deck
5. deck.gl efficient diff
```

## Key Concepts

### Instance Nodes

The reconciler creates internal "instance nodes" for each JSX element:

```tsx
type InstanceNode = {
  type: 'layer' | 'view' | 'root';
  props: object;
  payload: Layer | View | null;
  parent: InstanceNode | null;
  children: InstanceNode[];
};
```

Each node wraps a deck.gl Layer or View instance and tracks its position in the React tree.

### Tree Flattening

deck.gl expects flat arrays of layers and views, but React trees are nested. The reconciler flattens the tree before passing to deck.gl:

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

This flattening happens automatically. Layers can be nested arbitrarily deep in React components, and the reconciler will find them.

### ID-Based Diffing

deck.gl uses layer IDs for efficient diffing. When the reconciler passes a new layers array to deck.gl:

1. deck.gl matches layers by ID
2. For matching IDs, it diffs props
3. Only changed props trigger updates
4. Missing IDs break this algorithm

**With IDs (efficient):**

```tsx
// Render 1
<layer layer={new ScatterplotLayer({ id: 'points', data: data1 })} />

// Render 2 - deck.gl diffs props, reuses GPU resources
<layer layer={new ScatterplotLayer({ id: 'points', data: data2 })} />
```

**Without IDs (expensive):**

```tsx
// Render 1
<layer layer={new ScatterplotLayer({ data: data1 })} />

// Render 2 - deck.gl sees different random ID, destroys and recreates
<layer layer={new ScatterplotLayer({ data: data2 })} />
```

This is why the reconciler validates IDs in development mode.

## Development Mode Features

### Validation System

The reconciler includes development-mode checks that catch common mistakes:

#### Missing ID Warning

When a layer lacks an explicit `id` prop:

```
⚠️ Layer missing explicit "id" prop. This causes expensive reinitialization on every render.
```

The reconciler detects layers with missing or default IDs (`"unknown"`) and warns during render.

#### Duplicate ID Error

When multiple layers share the same ID:

```
❌ Duplicate layer IDs detected: points, lines
```

The reconciler tracks all layer IDs in the current render and errors if duplicates are found. Duplicate IDs cause deck.gl's diffing to break - props from one layer might get applied to a different layer.

#### Production Behavior

All validation code is wrapped in `if (process.env.NODE_ENV === 'development')` checks. Bundlers like Vite, webpack, and Turbopack eliminate this code in production builds through dead code elimination. Zero runtime overhead in production.

## v2 Changes

### Pass-Through Architecture

v2 changed how the reconciler handles layer creation:

**v1 approach:**

- Reconciler maintained a catalog of layer types
- JSX element type (e.g., `<scatterplotLayer>`) mapped to a constructor
- Reconciler called `new LayerClass(props)`

**v2 approach:**

- Reconciler extracts `props.layer`
- JSX just passes through the instance
- No catalog, no registration needed

Benefits:

- Automatic code-splitting - only import what you use
- TypeScript generics work naturally
- Custom layers need no setup

### Universal Elements

v2 introduced `<layer>` and `<view>` elements that accept any instance:

```tsx
<layer layer={new ScatterplotLayer({ id: 'points' })} />
<layer layer={new CustomLayer({ id: 'custom' })} />
<view view={new MapView({ id: 'main' })} />
```

The reconciler just extracts the instance - it doesn't care about the specific type.

### Deprecated APIs

#### Side-Effects Import

v1 required importing side-effects to register built-in layers:

```tsx
import '@deckgl-fiber-renderer/reconciler/side-effects';
```

This is now a no-op that shows a deprecation warning. It will be removed in v3.

#### extend() Function

v1 required registering custom layers:

```tsx
import { extend } from '@deckgl-fiber-renderer/reconciler';
extend({ MyCustomLayer });
```

This still works in v2 but is deprecated. Custom layers now work directly with `<layer>`. It will be removed in v3.

## Implementation Details

### Reconciler Configuration

The reconciler is configured with `react-reconciler`:

```tsx
const reconciler = Reconciler({
  supportsMutation: false,
  supportsPersistence: true,
  supportsHydration: false,

  createInstance(type, props) {
    // Create instance node wrapping layer/view
  },

  commitUpdate(instance, updatePayload, type, prevProps, nextProps) {
    // Rebuild instance node with new props
  },

  // ... other lifecycle methods
});
```

### Suspense Support

The reconciler supports React Suspense through `supportsMutation: false` and proper implementation of persistence mode methods. This makes it concurrent-mode ready.

### Refs Behavior

Refs expose the actual deck.gl Layer or View instance, not the internal instance node:

```tsx
const layerRef = useRef<ScatterplotLayer>(null);

<layer ref={layerRef} layer={new ScatterplotLayer({ id: 'points' })} />;

// layerRef.current is the ScatterplotLayer instance
```

This gives you access to all deck.gl APIs on the layer.

## Related Packages

- **[@deckgl-fiber-renderer/dom](../dom)** - The main package users install
- **[@deckgl-fiber-renderer/types](../types)** - TypeScript definitions for JSX elements

## References

- [React Reconciler Documentation](https://github.com/facebook/react/tree/main/packages/react-reconciler)
- [Building a Custom React Renderer](https://agent-hunt.medium.com/hello-world-custom-react-renderer-9a95b7cd04bc)
- [deck.gl Layer Lifecycle](https://deck.gl/docs/developer-guide/custom-layers/layer-lifecycle)
- [deck.gl Performance Optimization](https://deck.gl/docs/developer-guide/performance)
