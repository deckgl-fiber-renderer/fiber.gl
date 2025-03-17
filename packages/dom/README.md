![Deckgl Fiber Renderer](../../assets/banner.jpg)

# Deckgl Fiber Renderer

A React renderer for [deck.gl](https://deck.gl/).

> [!IMPORTANT]
> Requires `react` `>=19` and `@deck.gl/*` `>=v9.1`

### Getting Started

Install `@deckgl-fiber-renderer`:

```bash
npm i @deckgl-fiber-renderer/dom
```

Install peer dependencies:

```bash
npm i react react-dom @deck.gl/core @deck.gl/layers @deck.gl/geo-layers @deck.gl/mesh-layers @deck.gl/mapbox
```

Create a standalone map:

```jsx
import { Deckgl } from '@deckgl-fiber-renderer/dom';

export function ExampleMap() {
  return (
    <Deckgl 
      controller 
      initialViewState={{
        longitude: -77.0369,
        latitude: 38.9072,
        zoom: 4,
      }}>
        <geoJsonLayer
          id="basemap"
          data="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_land.geojson"
          stroked={false}
          filled
          opacity={0.1}
          getFillColor={[30, 80, 120]}
        />
    </Deckgl>
  )
}

createRoot(document.getElementById('root')).render(<ExampleMap />);
```

Out of the box all layers and views from `@deck.gl/core`, `@deck.gl/geo-layers`, `@deck.gl/layers`, and `@deck.gl/mesh-layers` are available right away with no additional setup.

---

### Examples

- [Standalone](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/standalone)
- [Custom Layer](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/custom-layer)
- [Nextjs](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/nextjs)
- [Remix/React Router](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/remix)
- [Rsbuild](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/rsbuild)
- [Vite](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/vite)

---

### Features

- You can just think in React, all best practices you would apply normally in your code are applicable with `@deckgl-fiber-renderer`
- No performance penalties, it is the same as using `deck.gl` directly
- No limitations with regards to `children` composition or structure
- Render layers at any depth of the `@deckgl-fiber-renderer` tree
- Leverage hooks in components that render layers
- Hot module reload support
- Render Views as components
- Custom layers are supported
- Automatic resource cleanup when `<Deckgl />` unmounts from tree
- Overlaid and Interleaved support for Mapbox/Maplibre
- Full TypeScript support for JSX elements

### Limitations

- Interleaving DOM based elements like `<div />` inside of the `<Deckgl />` context tree is not supported
- The `Map` component in `react-map-gl/*` as a child inside of the `<Deckgl />` context tree is not supported
  - Recommended approach is to apply the `interleaved` prop to the `<Deckgl />` component and setup your MapLibre or Mapbox instances directly. See our [examples/nextjs](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/nextjs) for an example.

---

### Accessing the Deck.gl Instance

You can utilize the `useDeckgl` hook in any host context, meaning that it is not restricted to just the children of `<Deckgl />`. You can leverage inside of regular `react-dom` areas of your application as well.

```jsx
import { useDeckgl } from '@deckgl-fiber-renderer/dom';

function MyComponent() {
  // Will automatically update once Deckgl is initialized
  const deckglInstance = useDeckgl();

  useEffect(() => {
    // Recommended to always check to make sure it exists before using
    if (deckglInstance) {
      ...
    }
  }, []);

  return ...
}
```

---

### MapLibre Integration

> [!CAUTION]
> `react-map-gl` cannot be used as child of `<Deckgl />` so you will need to create your MapLibre/Mapbox instances manually. `@deck.gl/mapbox` overlay is implicitly included in `@react-fiber-renderer/dom` and will work out of the box if you pass an `interleave` prop to `<Deckgl />`. 

First create a function that accepts a deckgl instance and then instantiates and sets up your MapLibre instance:

```ts
// maplibre.ts
import { Map as MapLibre } from 'maplibre-gl';

const INITIAL_VIEW_STATE = {
  longitude: -77.0369,
  latitude: 38.9072,
  zoom: 4,
};

const MAP_STYLE =
  'https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export function connect(deckgl) {
  const map = new MapLibre({
    container: 'maplibre',
    style: MAP_STYLE,
    center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
    zoom: INITIAL_VIEW_STATE.zoom,
  });

  map.once('style.load', () => {
    map.setProjection({ type: 'globe' });
  });

  map.once('load', () => {
    map.addControl(deckgl);
  });

  // Return a cleanup function to be called inside a `useEffect` return function
  return () => {
    map.removeControl(deckgl);
    map.remove();
  };
}
```

Next setup your React components:

```tsx
// deckgl.tsx
import { useEffect } from 'react';
import { Deckgl, useDeckgl } from '@deckgl-fiber-renderer/dom';
import { connect } from './maplibre';

function MyMap(props) {
  const { children } = props;
  const deckglInstance = useDeckgl();

  useEffect(() => {
    if (deckglInstance) {
      const removeMapLibre = connect(deckglInstance);

      return () => removeMapLibre();
    }
  }, []);

  return (
    <Deckgl interleaved ... >
      {children}
    </Deckgl>
  )
}
```

---

### Different Views

> [!IMPORTANT]
> There is no automatic layer filtering applied based on what View it is nested under in the tree. However, this is something we may add in the future as an opt-in feature.

All of the baked in Views are supported:

```jsx
<Deckgl ... >
  <mapView id="main" ... >
    <scatterplotLayer id="thing" ... />
  </mapView>
</Deckgl>
```

```jsx
<Deckgl ... >
  <orthographicView id="main" ... >
    <scatterplotLayer id="thing" ... />
  </orthographicView>
</Deckgl>
```

---

### Custom Layers

> [!NOTE]
> This code is included in the [examples/custom-layer](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/custom-layer) example.

Adding custom layers to `@deckg-fiber-renderer` is straightforward. First create a file that contains the custom layer:

```ts
// custom-layer.ts
import { CompositeLayer, type DefaultProps } from '@deck.gl/core';
import { ScatterplotLayer, type ScatterplotLayerProps } from '@deck.gl/layers';

export type CustomLayerProps = ScatterplotLayerProps & {
  scaler: number;
};

export class CustomLayer extends CompositeLayer<CustomLayerProps> {
  static layerName = 'CustomLayer';
  static defaultProps: DefaultProps<CustomLayerProps> = {
    scaler: 1.0,
  };

  renderLayers() {
    const props = this.props;

    return [
      new ScatterplotLayer(
        this.getSubLayerProps({
          ...props,
          id: 'scaled',
          data: props.data,
          radiusScale: props.scaler,
          opacity: 0.25,
        }),
      ),
      new ScatterplotLayer(
        this.getSubLayerProps({
          ...props,
          data: props.data,
          id: 'not-scaled',
        }),
      ),
    ];
  }
}
```

If you are using TypeScript add the following at the bottom of the file to make TypeScript & React aware of this custom JSX element:

```ts
// Make TypeScript & React aware of this custom JSX element
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

Next create a file in your app that will act as the central hub for adding additional layers to the reconciler. This file needs to imported in a root level file that is always executed (like a Nextjs page/layout). More optimally you can import it nearest to the root of where you are rendering `<Deckgl />`:

```ts
// side-effects.ts
import { extend } from '@deckgl-fiber-renderer/dom';
import { CustomLayer } from './path/to/my-custom-layer';

// Add custom layer(s) to reconciler
extend({
  // jsx elements are transformed to PascalCase behind the scenes
  // so `<customLayer />` becomes `new CustomLayer()`
  CustomLayer, 
});
```

Now you can use this layer anywhere in your JSX:

```jsx
<Deckgl ... >
  <customLayer ... />
</Deckgl>
```

If you included the TypeScript snippet, it will also have full intellisense support and type safety.


