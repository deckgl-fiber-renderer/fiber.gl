# @deckgl-fiber-renderer/dom

React renderer for deck.gl. Build geospatial visualizations using React components and hooks with full TypeScript support.

## Installation

```bash
pnpm add @deckgl-fiber-renderer/dom
```

### Peer Dependencies

```bash
pnpm add react react-dom @deck.gl/core @deck.gl/layers
```

**Requirements:** React `19.0.0+`, deck.gl `^9.1.0`

---

## Tutorial

### Your First Map

Build a working scatterplot visualization in 3 steps.

**1. Create the component**

```tsx
import { Deckgl } from "@deckgl-fiber-renderer/dom";
import { ScatterplotLayer } from "@deck.gl/layers";

function App() {
  const data = [
    { position: [-122.45, 37.8], size: 100, name: "Point A" },
    { position: [-122.46, 37.81], size: 200, name: "Point B" },
  ];

  return (
    <Deckgl
      initialViewState={{
        longitude: -122.45,
        latitude: 37.8,
        zoom: 12,
      }}
      style={{ width: "100%", height: "100vh" }}
    >
      <layer
        layer={
          new ScatterplotLayer({
            id: "points",
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

**2. Add interactivity**

```tsx
import { useState } from "react";

function App() {
  const [hovered, setHovered] = useState(null);

  return (
    <Deckgl
      initialViewState={{ longitude: -122.45, latitude: 37.8, zoom: 12 }}
      onHover={(info) => setHovered(info.object)}
      getCursor={() => (hovered ? "pointer" : "grab")}
    >
      <layer
        layer={
          new ScatterplotLayer({
            id: "points",
            data,
            getPosition: (d) => d.position,
            getRadius: (d) => d.size,
            getFillColor: hovered ? [255, 200, 0] : [255, 140, 0],
            pickable: true,
          })
        }
      />
      {hovered && <div className="tooltip">{hovered.name}</div>}
    </Deckgl>
  );
}
```

**3. Success criteria**

- ✅ You see orange points on the map
- ✅ Cursor changes on hover
- ✅ Tooltip shows point name

**Learn more about deck.gl layers:** https://deck.gl/docs/api-reference/layers

---

## How-To Guides

### Integrate with MapLibre/Mapbox

Use interleaved rendering to combine deck.gl with basemap layers.

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

**Key points:**

- `<Map>` wraps `<Deckgl>`, not vice versa
- `interleaved` prop enables layer interleaving
- `useDeckgl()` provides deck instance to `useControl()`

**Learn more:** https://deck.gl/docs/api-reference/mapbox/overview

### Render Multiple Views

Split screen or minimap with different cameras.

```tsx
import { MapView, OrthographicView } from "@deck.gl/core";

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

**Note:** Layer filtering by view requires manual control via props. All layers render in all views by default.

**Learn more:** https://deck.gl/docs/api-reference/core/deck#views

### Use Custom Layers

Custom layers work immediately without registration.

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

**TypeScript typing (optional):**

```tsx
type CustomLayerProps = {
  id: string;
  data: unknown[];
  customRadius?: number;
};

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      customLayer: CustomLayerProps;
    }
  }
}

// Now <customLayer> has type checking (but <layer> is recommended)
```

**Learn more:** https://deck.gl/docs/developer-guide/custom-layers

---

## Reference

### API: `<Deckgl>`

Root container for deck.gl visualization.

```tsx
<Deckgl
  initialViewState={{ longitude: -122.4, latitude: 37.8, zoom: 12 }}
  width="100%"
  height="100vh"
  onLoad={(deck) => console.log("Ready", deck)}
>
  {children}
</Deckgl>
```

**Props:**

| Prop                | Type                    | Description                                               |
| ------------------- | ----------------------- | --------------------------------------------------------- |
| `initialViewState`  | `object`                | Initial camera position (longitude, latitude, zoom, etc.) |
| `width`             | `string \| number`      | Container width (CSS values supported)                    |
| `height`            | `string \| number`      | Container height (CSS values supported)                   |
| `interleaved`       | `boolean`               | Enable interleaved rendering for basemap integration      |
| `onLoad`            | `(deck: Deck) => void`  | Callback when deck.gl initializes                         |
| `onViewStateChange` | `(params) => void`      | Callback when view state changes                          |
| `onHover`           | `(info, event) => void` | Callback on hover                                         |
| `onClick`           | `(info, event) => void` | Callback on click                                         |
| `getCursor`         | `(state) => string`     | Custom cursor based on state                              |
| `debug`             | `boolean`               | Enable logging (development mode only)                    |

**Inherited props:** All props from deck.gl's [`DeckProps`](https://deck.gl/docs/api-reference/core/deck#properties) and [`MapboxOverlayProps`](https://deck.gl/docs/api-reference/mapbox/mapbox-overlay#properties) are supported.

### API: `useDeckgl()`

Hook to access the deck.gl instance.

```tsx
import { useDeckgl } from "@deckgl-fiber-renderer/dom";

function MyComponent() {
  const deck = useDeckgl();

  useEffect(() => {
    if (deck) {
      console.log("Current view state:", deck.viewState);
    }
  }, [deck]);

  return null;
}
```

**Returns:** `Deck | null`

**Note:** Returns `null` until `<Deckgl>` mounts. Always check before use.

### API: `<layer>` and `<view>`

Universal elements for layers and views (v2 syntax).

**`<layer>` element:**

```tsx
<layer layer={new ScatterplotLayer({ id: "points", data })} key="optional-react-key" />
```

| Prop    | Type     | Required | Description                  |
| ------- | -------- | -------- | ---------------------------- |
| `layer` | `Layer`  | Yes      | deck.gl Layer instance       |
| `key`   | `string` | No       | React key for list rendering |

**`<view>` element:**

```tsx
<view view={new MapView({ id: "main" })} key="optional-react-key" />
```

| Prop   | Type     | Required | Description                  |
| ------ | -------- | -------- | ---------------------------- |
| `view` | `View`   | Yes      | deck.gl View instance        |
| `key`  | `string` | No       | React key for list rendering |

**TypeScript generics:**

```tsx
type DataPoint = { coordinates: [number, number]; value: number };

<layer
  layer={
    new ScatterplotLayer<DataPoint>({
      id: "points",
      data,
      getPosition: (d) => d.coordinates, // d typed as DataPoint
      getRadius: (d) => d.value, // Full autocomplete
    })
  }
/>;
```

### API: `extend()` (deprecated)

```tsx
import { extend } from "@deckgl-fiber-renderer/dom";
import { MyCustomLayer } from "./my-custom-layer";

extend({ MyCustomLayer });

// Deprecated - use <layer> instead
<myCustomLayer id="custom" data={data} />;
```

**Deprecation:** This function is deprecated and will be removed in v3. Use `<layer layer={new MyCustomLayer(...)} />` instead.

---

## Explanation

### Why a React Reconciler?

The official deck.gl React bindings wrap the imperative deck.gl API. This limits composition - layers must be direct children, hooks don't work, and TypeScript generics are unsupported.

A React reconciler integrates deck.gl at a lower level. It teaches React how to render to deck.gl, making layers first-class React components. This enables:

- **Nesting** - Layers can be anywhere in your component tree
- **Hooks** - useState, useContext, custom hooks all work
- **Generics** - Full TypeScript type inference in accessor functions
- **Composition** - Build reusable layer components

**Tradeoff:** Slightly larger bundle (~15KB) for reconciler infrastructure. Worth it for teams building complex visualizations.

### Persistence Mode Design

React reconcilers can mutate nodes (DOM) or replace them (primitives like strings). This reconciler uses **persistence mode** - it replaces layers instead of mutating them.

**Why?** deck.gl layers are designed as immutable descriptors:

> "Layers are descriptor objects that are very cheap to instantiate. Create a new set of layers every render cycle." - [deck.gl docs](https://deck.gl/docs/developer-guide/using-layers)

deck.gl handles efficient updates internally by:

1. Matching layers by ID
2. Diffing props
3. Reusing GPU resources

The reconciler creates new layer instances on prop changes. deck.gl's diffing algorithm detects what actually changed and updates only affected state.

**Performance:** No overhead. Creating layer instances is cheap - they're plain objects until deck.gl processes them.

### Layer IDs and Diffing

**Rule:** Always provide explicit, stable `id` props.

```tsx
// ✅ Good - explicit, stable ID
<layer layer={new ScatterplotLayer({ id: "points", data })} />

// ❌ Bad - missing ID (auto-generated, changes every render)
<layer layer={new ScatterplotLayer({ data })} />

// ❌ Bad - non-stable ID (changes every render)
<layer layer={new ScatterplotLayer({ id: Math.random().toString(), data })} />
```

**Why?** deck.gl uses IDs for diffing. Without stable IDs:

- Layer treated as new on every render
- GPU resources destroyed and recreated
- Animations reset
- Performance degrades

**Development mode validation:** Missing or duplicate IDs trigger warnings. These checks are stripped from production builds.

**Learn more:** https://deck.gl/docs/developer-guide/using-layers#layer-identity-and-diffing

### v1 vs v2 Syntax

#### Understanding v1 Auto-Registration

In v1, importing the side-effects module automatically registered all deck.gl layers:

```tsx
// v1 side-effects import (no longer works in v2)
import "@deckgl-fiber-renderer/reconciler/side-effects";
```

This single import executed code that called `extend()` with 30+ layer constructors:

```tsx
// What the v1 side-effects import did internally:
extend({
  // Views
  MapView,
  OrthographicView,
  OrbitView,
  FirstPersonView,
  GlobeView,

  // @deck.gl/layers (13 layers)
  ArcLayer,
  BitmapLayer,
  IconLayer,
  LineLayer,
  PointCloudLayer,
  ScatterplotLayer,
  ColumnLayer,
  GridCellLayer,
  PathLayer,
  PolygonLayer,
  GeoJsonLayer,
  TextLayer,
  SolidPolygonLayer,

  // @deck.gl/geo-layers (14 layers)
  S2Layer,
  QuadkeyLayer,
  TileLayer,
  TripsLayer,
  H3ClusterLayer,
  H3HexagonLayer,
  Tile3DLayer,
  TerrainLayer,
  MVTLayer,
  GeohashLayer,
  GreatCircleLayer,
  WMSLayer,

  // @deck.gl/mesh-layers (2 layers)
  ScenegraphLayer,
  SimpleMeshLayer,
});
```

After this registration, you could use layer-specific JSX elements:

```tsx
<scatterplotLayer id="points" data={data} getPosition={(d) => d.coordinates} />
<pathLayer id="routes" data={routes} getPath={(d) => d.path} />
```

#### ⚠️ The Migration Footgun

**JSX elements still have TypeScript types in v2, but they won't work at runtime without proper registration.**

This is the most common migration error:

```tsx
// No registration - JSX types exist but runtime catalog is empty
<scatterplotLayer id="points" data={data} getPosition={(d) => d.coordinates} />
//              ^^^^^^^^^ TypeScript: ✅  Runtime: ❌ "Unknown element type: scatterplotLayer"
```

**Why this happens:**

1. **TypeScript types exist:** `@deckgl-fiber-renderer/types` declares JSX elements for all layers for backwards compatibility
2. **Runtime registry is empty:** Without manual `extend()` calls, the reconciler doesn't know how to instantiate `scatterplotLayer`
3. **Side-effects import is a no-op in v2:** It only shows a deprecation warning - it doesn't register layers anymore
4. **TypeScript can't catch this:** Type definitions don't guarantee runtime behavior

**What breaks:**

- Your app renders nothing or shows errors
- No layers appear on the map
- Console shows "Unknown element type" errors

#### Migration Strategies

**Option 1: Migrate to v2 syntax (Recommended)**

Replace layer-specific elements with the universal `<layer>` element:

```tsx
// ✅ v2 - No registration needed
import { ScatterplotLayer } from "@deck.gl/layers";

<layer
  layer={
    new ScatterplotLayer({
      id: "points",
      data,
      getPosition: (d) => d.coordinates,
    })
  }
/>;
```

**Benefits:**

- ✅ No registration required - works immediately
- ✅ Full TypeScript generics with type inference
- ✅ Automatic code-splitting (only bundle imported layers)
- ✅ Custom layers work without setup
- ✅ Future-proof (v1 syntax removed in v3)

**Option 2: Stay on v1 syntax (Not recommended)**

If you must stay on v1 syntax temporarily, you need to manually register layers using `extend()`.

**For complete v1 behavior** (all default layers):

```tsx
// Recreate v1 side-effects behavior manually
import { extend } from "@deckgl-fiber-renderer/dom";
import {
  FirstPersonView,
  _GlobeView as GlobeView,
  MapView,
  OrbitView,
  OrthographicView,
} from "@deck.gl/core";
import {
  GeohashLayer,
  GreatCircleLayer,
  H3ClusterLayer,
  H3HexagonLayer,
  MVTLayer,
  QuadkeyLayer,
  S2Layer,
  TerrainLayer,
  Tile3DLayer,
  TileLayer,
  TripsLayer,
  _WMSLayer as WMSLayer,
} from "@deck.gl/geo-layers";
import {
  ArcLayer,
  BitmapLayer,
  ColumnLayer,
  GeoJsonLayer,
  GridCellLayer,
  IconLayer,
  LineLayer,
  PathLayer,
  PointCloudLayer,
  PolygonLayer,
  ScatterplotLayer,
  SolidPolygonLayer,
  TextLayer,
} from "@deck.gl/layers";
import { ScenegraphLayer, SimpleMeshLayer } from "@deck.gl/mesh-layers";

// Register all layers
extend({
  // Views
  MapView,
  OrthographicView,
  OrbitView,
  FirstPersonView,
  GlobeView,
  // @deck.gl/layers
  ArcLayer,
  BitmapLayer,
  IconLayer,
  LineLayer,
  PointCloudLayer,
  ScatterplotLayer,
  ColumnLayer,
  GridCellLayer,
  PathLayer,
  PolygonLayer,
  GeoJsonLayer,
  TextLayer,
  SolidPolygonLayer,
  // @deck.gl/geo-layers
  S2Layer,
  QuadkeyLayer,
  TileLayer,
  TripsLayer,
  H3ClusterLayer,
  H3HexagonLayer,
  Tile3DLayer,
  TerrainLayer,
  MVTLayer,
  MvtLayer: MVTLayer,
  WMSLayer,
  WmsLayer: WMSLayer,
  GeohashLayer,
  GreatCircleLayer,
  // @deck.gl/mesh-layers
  ScenegraphLayer,
  SimpleMeshLayer,
});

// Now v1 syntax works
<scatterplotLayer id="points" data={data} />;
```

**For minimal registration** (only layers you need):

```tsx
// Register only what you use
import { extend } from "@deckgl-fiber-renderer/dom";
import { ScatterplotLayer, PathLayer } from "@deck.gl/layers";

extend({ ScatterplotLayer, PathLayer });

// Now these specific layers work
<scatterplotLayer id="points" data={data} />
<pathLayer id="routes" data={routes} />
```

**Downsides of staying on v1:**

- ⚠️ Shows deprecation warnings in development mode
- ⚠️ Will break in v3 (complete removal)
- ⚠️ No TypeScript generics support
- ⚠️ Bundles all layers if you use complete registration
- ⚠️ Easy to forget registering a layer (runtime errors)

#### Migration Checklist

Migrating from v1 to v2:

1. **Remove the side-effects import** (it's a no-op in v2):

   ```tsx
   // ❌ Remove this - doesn't work anymore
   import "@deckgl-fiber-renderer/reconciler/side-effects";
   ```

2. **Import layer constructors:**

   ```tsx
   // ✅ Add explicit imports
   import { ScatterplotLayer, PathLayer } from "@deck.gl/layers";
   ```

3. **Replace layer elements:**

   ```tsx
   // ❌ Old
   <scatterplotLayer id="points" data={data} getPosition={(d) => d.coordinates} />

   // ✅ New
   <layer layer={new ScatterplotLayer({ id: "points", data, getPosition: (d) => d.coordinates })} />
   ```

4. **Remove `extend()` calls** (no longer needed)

5. **Add TypeScript generics** (optional but recommended):

   ```tsx
   type DataPoint = { coordinates: [number, number]; value: number };

   <layer
     layer={
       new ScatterplotLayer<DataPoint>({
         id: "points",
         data,
         getPosition: (d) => d.coordinates, // d typed as DataPoint
       })
     }
   />;
   ```

---

## Additional Resources

- **deck.gl Documentation:** https://deck.gl/docs
- **deck.gl Examples:** https://deck.gl/examples
- **React Reconciler:** https://github.com/facebook/react/tree/main/packages/react-reconciler
- **Source Code:** https://github.com/deckgl-fiber-renderer/fiber.gl
