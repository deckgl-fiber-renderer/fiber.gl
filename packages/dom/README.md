# @deckgl-fiber-renderer/dom

A React renderer for deck.gl. Lets you build deck.gl visualizations using React components and hooks, with TypeScript support.

## Installation

```bash
# pnpm
pnpm add @deckgl-fiber-renderer/dom

# npm
npm install @deckgl-fiber-renderer/dom

# yarn
yarn add @deckgl-fiber-renderer/dom
```

### Requirements

- **React 19.0.0** or later
- **deck.gl ^9.1.0** or later

You'll also need to install deck.gl packages for the layers you want to use:

```bash
pnpm add @deck.gl/core @deck.gl/layers
```

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
  - [The Deckgl Component](#the-deckgl-component)
  - [The layer Element](#the-layer-element)
  - [The view Element](#the-view-element)
  - [Development Mode Validation](#development-mode-validation)
- [API Reference](#api-reference)
  - [Deckgl Props](#deckgl-props)
  - [useDeckgl Hook](#usedeck gl-hook)
  - [layer and view Props](#layer-and-view-props)
- [Common Patterns](#common-patterns)
  - [Basemap Integration](#basemap-integration)
  - [Multiple Views](#multiple-views)
  - [Custom Layers](#custom-layers)
- [Migration from v1](#migration-from-v1)
- [Backwards Compatibility](#backwards-compatibility)
- [Examples](#examples)

## Quick Start

Here's a minimal example to get you started:

```tsx
import { ScatterplotLayer } from "@deck.gl/layers";
import { Deckgl } from "@deckgl-fiber-renderer/dom";

function App() {
  const data = [
    { position: [-122.45, 37.8], size: 100 },
    { position: [-122.46, 37.81], size: 200 },
  ];

  return (
    <Deckgl
      initialViewState={{
        longitude: -122.45,
        latitude: 37.8,
        zoom: 12,
      }}
      width="100%"
      height="100vh"
    >
      <layer
        layer={
          new ScatterplotLayer({
            id: "scatterplot",
            data,
            getPosition: (d) => d.position,
            getRadius: (d) => d.size,
            getFillColor: [255, 140, 0],
          })
        }
      />
    </Deckgl>
  );
}
```

For more examples and patterns, see the [examples directory](../../examples/).

## Core Concepts

### The Deckgl Component

The `<Deckgl>` component is the root container for your deck.gl visualization. It creates the deck.gl instance and provides context to child layers and views.

```tsx
<Deckgl
  initialViewState={{
    longitude: -122.45,
    latitude: 37.8,
    zoom: 12,
  }}
  width="100%"
  height="100vh"
>
  {/* layers and views go here */}
</Deckgl>
```

#### The interleaved Prop

When integrating with a basemap (like MapLibre or Mapbox), use the `interleaved` prop to enable interleaved rendering. This allows deck.gl layers to render between basemap layers:

```tsx
<Deckgl interleaved>
  {/* Your basemap integration component */}
  <layer layer={...} />
</Deckgl>
```

#### Common Props

- `initialViewState` - Sets the initial camera position
- `width` / `height` - Container dimensions (supports CSS values like "100%")
- `parameters` - WebGL parameters to pass to deck.gl
- `interleaved` - Enable interleaved rendering for basemap integration
- `onLoad` - Callback when deck.gl is initialized
- `onViewStateChange` - Callback when the view state changes

### The layer Element

The universal `<layer>` element is the core of v2. Instead of creating a JSX element for each layer type, you pass a layer instance to the `layer` prop:

```tsx
import { ScatterplotLayer } from "@deck.gl/layers";

<layer
  layer={
    new ScatterplotLayer({
      id: "my-layer",
      data: myData,
      getPosition: (d) => d.coordinates,
      getRadius: 100,
    })
  }
/>;
```

#### Why This Syntax?

The v2 syntax solves several problems:

- **No registration needed** - Import and use any layer immediately
- **Automatic code-splitting** - Only bundle the layers you import
- **Full TypeScript support** - Generic type parameters provide type-safe accessor functions
- **Works with custom layers** - No setup required

#### Layer IDs Are Critical

**Always provide explicit `id` props.** deck.gl uses layer IDs for efficient diffing. Missing or non-stable IDs cause expensive re-initialization on every render:

```tsx
// ✅ Good - explicit, stable ID
<layer
  layer={
    new ScatterplotLayer({
      id: 'points',
      data,
      getPosition: (d) => d.coordinates,
    })
  }
/>

// ❌ Bad - missing ID
<layer
  layer={
    new ScatterplotLayer({
      data,
      getPosition: (d) => d.coordinates,
    })
  }
/>

// ❌ Bad - non-stable ID (changes every render)
<layer
  layer={
    new ScatterplotLayer({
      id: Math.random().toString(),
      data,
      getPosition: (d) => d.coordinates,
    })
  }
/>
```

#### What Happens When IDs Are Missing

Without an explicit ID:

- deck.gl generates a random ID on each render
- The layer is treated as "new" every time
- All GPU resources are destroyed and recreated
- Performance degrades significantly with complex data

Development mode will warn you about missing IDs.

### The view Element

The `<view>` element lets you render multiple views with different cameras and viewports. Like `<layer>`, you pass a view instance to the `view` prop:

```tsx
import { MapView, OrthographicView } from '@deck.gl/core';

<Deckgl>
  <view
    view={
      new MapView({
        id: 'main',
        width: '50%',
        height: '100%',
      })
    }
  >
    <layer layer={...} />
  </view>

  <view
    view={
      new OrthographicView({
        id: 'minimap',
        x: '50%',
        width: '50%',
        height: '100%',
      })
    }
  >
    <layer layer={...} />
  </view>
</Deckgl>
```

**Note:** There is no automatic layer filtering based on view hierarchy. All layers render in all views unless you manually filter using the `visible` prop or conditional rendering.

### Development Mode Validation

The reconciler validates layers in development mode to catch common mistakes. These checks run when `process.env.NODE_ENV === "development"` and are stripped from production builds.

#### Missing ID Warning

When a layer lacks an explicit ID, you'll see:

```
⚠️  Layer missing explicit "id" prop. This causes expensive
reinitialization on every render.
```

This warning appears because deck.gl uses IDs for efficient diffing. Without a stable ID, the layer reinitializes on every render, destroying and recreating GPU resources.

#### Duplicate ID Error

When multiple layers share the same ID:

```
❌ Duplicate layer IDs detected: points, lines
```

Duplicate IDs break deck.gl's diffing algorithm, causing incorrect prop updates and unpredictable rendering.

#### Production Behavior

All validation is automatically removed from production builds through dead code elimination. No runtime checks occur in production.

## API Reference

### Deckgl Props

| Prop                      | Type                     | Description                                                     |
| ------------------------- | ------------------------ | --------------------------------------------------------------- |
| `initialViewState`        | `object`                 | Initial camera position (`longitude`, `latitude`, `zoom`, etc.) |
| `width`                   | `string \| number`       | Container width (supports CSS values like "100%")               |
| `height`                  | `string \| number`       | Container height (supports CSS values like "100vh")             |
| `interleaved`             | `boolean`                | Enable interleaved rendering for basemap integration            |
| `parameters`              | `object`                 | WebGL parameters to pass to deck.gl                             |
| `onLoad`                  | `(deck: Deck) => void`   | Callback when deck.gl instance is initialized                   |
| `onViewStateChange`       | `(params) => void`       | Callback when view state changes                                |
| `onResize`                | `(size) => void`         | Callback when canvas resizes                                    |
| `getCursor`               | `(state) => string`      | Custom cursor based on interaction state                        |
| `gl`                      | `WebGL2RenderingContext` | Custom WebGL context (advanced)                                 |
| `glOptions`               | `object`                 | WebGL context creation options                                  |
| `_typedArrayManagerProps` | `object`                 | Advanced: typed array manager configuration                     |

For complete prop documentation, see the [deck.gl Deck class reference](https://deck.gl/docs/api-reference/core/deck).

### useDeckgl Hook

The `useDeckgl()` hook provides access to the deck.gl instance from anywhere in your React tree (not just children of `<Deckgl>`):

```tsx
import { useDeckgl } from "@deckgl-fiber-renderer/dom";

function MyComponent() {
  const deckInstance = useDeckgl();

  useEffect(() => {
    // Always check for null - instance is not available until Deckgl mounts
    if (deckInstance) {
      console.log("Current view state:", deckInstance.viewState);
    }
  }, [deckInstance]);

  return <div>...</div>;
}
```

**Important:** The hook returns `null` until the `<Deckgl>` component is mounted and initialized. Always check before using the instance.

### layer and view Props

#### `<layer>` Element

| Prop    | Type     | Required | Description                       |
| ------- | -------- | -------- | --------------------------------- |
| `layer` | `Layer`  | Yes      | A deck.gl Layer instance          |
| `key`   | `string` | No       | React key for list reconciliation |

```tsx
<layer
  layer={
    new ScatterplotLayer({
      id: "points",
      data: myData,
      getPosition: (d) => d.coordinates,
    })
  }
/>
```

#### `<view>` Element

| Prop   | Type     | Required | Description                       |
| ------ | -------- | -------- | --------------------------------- |
| `view` | `View`   | Yes      | A deck.gl View instance           |
| `key`  | `string` | No       | React key for list reconciliation |

```tsx
<view
  view={
    new MapView({
      id: "main",
      width: "100%",
      height: "100%",
    })
  }
/>
```

#### TypeScript Generic Support

For type-safe accessor functions, use TypeScript generics:

```tsx
type DataPoint = { coordinates: [number, number]; value: number };

<layer
  layer={
    new ScatterplotLayer<DataPoint>({
      id: "points",
      data: myData,
      getPosition: (d) => d.coordinates, // d is typed as DataPoint
      getRadius: (d) => d.value * 10, // Full autocomplete support
    })
  }
/>;
```

## Common Patterns

### Basemap Integration

To integrate with a basemap like MapLibre or Mapbox, wrap the `<Deckgl>` component with your map component and use the `interleaved` prop:

```tsx
import { Map, useControl } from "react-map-gl/maplibre";
import { Deckgl, useDeckgl } from "@deckgl-fiber-renderer/dom";

function DeckglOverlay() {
  const deck = useDeckgl();
  useControl(() => deck);
  return null;
}

function App() {
  return (
    <Map
      initialViewState={{ longitude: -122.4, latitude: 37.8, zoom: 12 }}
      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    >
      <Deckgl interleaved>
        <DeckglOverlay />
        <layer layer={new ScatterplotLayer({ id: "points", data })} />
      </Deckgl>
    </Map>
  );
}
```

**Important:** The `<Map>` component must wrap `<Deckgl>`, not vice versa. The `interleaved` prop enables deck.gl layers to render between basemap layers.

See the [react-map-gl example](../../examples/react-map-gl) for a complete implementation.

### Multiple Views

Render multiple views with different cameras using the `<view>` element:

```tsx
import { MapView, OrthographicView } from "@deck.gl/core";
import { Deckgl } from "@deckgl-fiber-renderer/dom";

function App() {
  return (
    <Deckgl>
      <view
        view={
          new MapView({
            id: "main",
            x: 0,
            y: 0,
            width: "70%",
            height: "100%",
          })
        }
      >
        <layer layer={new ScatterplotLayer({ id: "main-points", data })} />
      </view>

      <view
        view={
          new OrthographicView({
            id: "minimap",
            x: "70%",
            y: 0,
            width: "30%",
            height: "100%",
          })
        }
      >
        <layer layer={new ScatterplotLayer({ id: "mini-points", data })} />
      </view>
    </Deckgl>
  );
}
```

See the [views example](../../examples/views) for more patterns.

### Custom Layers

#### v2 Approach (Recommended)

Custom layers work with no setup using the universal `<layer>` element:

```tsx
import { CompositeLayer } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";

class CustomLayer extends CompositeLayer {
  static layerName = "CustomLayer";

  renderLayers() {
    return new ScatterplotLayer({
      id: `${this.props.id}-scatter`,
      data: this.props.data,
      getPosition: (d) => d.coordinates,
      getRadius: this.props.customRadius || 100,
    });
  }
}

// Use immediately - no registration needed
<layer layer={new CustomLayer({ id: "custom", data, customRadius: 200 })} />;
```

#### TypeScript Support

For TypeScript intellisense with custom layers, extend the `IntrinsicElements` interface:

```tsx
import type { CustomLayerProps } from "./CustomLayer";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        customLayer: CustomLayerProps;
      }
    }
  }
}
```

With this declaration, you get full type safety and autocomplete for custom layer props.

#### v1 Approach (Deprecated)

The v1 `extend()` function still works but is deprecated:

```tsx
import { extend } from "@deckgl-fiber-renderer/dom";
import { CustomLayer } from "./CustomLayer";

extend({ CustomLayer });

// Now you can use <customLayer /> (lowercase element)
```

This approach will be removed in v3. Migrate to the v2 pattern using `<layer layer={new CustomLayer(...)} />`.

See the [custom-layer example](../../examples/custom-layer) for a complete implementation.

## Migration from v1

### Why Migrate?

v2 improves on v1 in three ways:

- **Full TypeScript generics** - Type-safe accessor functions with autocomplete
- **Automatic code-splitting** - Only bundle the layers you import
- **No registration** - Custom layers work immediately without setup

### Syntax Comparison

| Feature         | v1 Syntax                                      | v2 Syntax                                                        |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| Basic layer     | `<scatterplotLayer id="points" data={data} />` | `<layer layer={new ScatterplotLayer({ id: 'points', data })} />` |
| With TypeScript | No generic support                             | `new ScatterplotLayer<DataType>({ ... })`                        |
| Custom layers   | Requires `extend()` call                       | No registration needed                                           |
| Views           | `<mapView id="main">`                          | `<view view={new MapView({ id: 'main' })}>`                      |

### Migration Steps

1. **Install v2:**

```bash
pnpm add @deckgl-fiber-renderer/dom@latest
```

2. **Update imports:**

```tsx
// Old
import "@deckgl-fiber-renderer/reconciler/side-effects";

// New
import { ScatterplotLayer } from "@deck.gl/layers";
```

3. **Replace element syntax:**

```tsx
// Old
<scatterplotLayer
  id="points"
  data={data}
  getPosition={(d) => d.coordinates}
/>

// New
<layer
  layer={
    new ScatterplotLayer({
      id: 'points',
      data,
      getPosition: (d) => d.coordinates,
    })
  }
/>
```

4. **Remove `extend()` calls** for custom layers - they now work directly with `<layer>`

### Key Changes

- **Universal elements:** Use `<layer>` and `<view>` instead of layer-specific elements
- **No registration:** Import and use layers directly - no `extend()` or side-effects import needed
- **Explicit instances:** Pass layer/view instances instead of props

### Deprecations

- Layer-specific JSX elements (`<scatterplotLayer>`, `<pathLayer>`, etc.) - Still work but deprecated
- `extend()` function - Still works but deprecated
- Side-effects import (`@deckgl-fiber-renderer/reconciler/side-effects`) - No longer needed

These deprecated APIs will be removed in v3.

## Backwards Compatibility

**v1 syntax is deprecated but still works in v2.** To ease migration, layer-specific JSX elements continue to function:

```tsx
// This still works but is deprecated
<scatterplotLayer id="points" data={data} getPosition={(d) => d.coordinates} />
```

Migrate to v2 syntax for several reasons:

- v1 syntax will be **removed in v3**
- v2 syntax provides better TypeScript support
- v2 enables automatic code-splitting
- v2 works with custom layers without registration

### Deprecation Timeline

- **v2 (current):** v1 syntax works but shows deprecation warnings
- **v3 (future):** v1 syntax will be removed

Start migrating now to avoid breaking changes in v3.

## Examples

The [examples directory](../../examples/) contains full working applications:

- **[react-map-gl](../../examples/react-map-gl)** - MapLibre/Mapbox integration with interleaved rendering
- **[custom-layer](../../examples/custom-layer)** - Creating and using custom layers
- **[views](../../examples/views)** - Multiple views with different cameras
- **[standalone](../../examples/standalone)** - Basic standalone map without basemap
- **[migration](../../examples/migration)** - Side-by-side v1 vs v2 comparison
- **[nextjs](../../examples/nextjs)** - Next.js integration
- **[remix](../../examples/remix)** - Remix integration
- **[vite](../../examples/vite)** - Vite setup
- **[rsbuild](../../examples/rsbuild)** - Rsbuild setup

Each example includes a README with setup instructions and can be run with:

```bash
pnpm --filter <example-name> run dev
```
