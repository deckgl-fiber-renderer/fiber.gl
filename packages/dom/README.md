![Deckgl Fiber Renderer](../../assets/banner.jpg)

# Deckgl Fiber Renderer

A React renderer for [deck.gl](https://deck.gl/).

> [!IMPORTANT]
> Requires `react`: `19.0.0` and `@deck.gl/*`: `^9.1.0`

### Getting Started

Install `@deckgl-fiber-renderer`:

```bash
npm i @deckgl-fiber-renderer/dom
```

Install peer dependencies:

```bash
npm i react react-dom @deck.gl/core @deck.gl/layers @deck.gl/geo-layers @deck.gl/mesh-layers @deck.gl/mapbox react-map-gl
```

Create a standalone map:

```jsx
import { Deckgl, useDeckgl } from '@deckgl-fiber-renderer/dom';
import { Map, useControl } from 'react-map-gl/maplibre';

const INITIAL_VIEW_STATE = {
  longitude: -77.0369,
  latitude: 38.9072,
  zoom: 4,
};

const MAP_STYLE =
  'https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

function BasemapSync() {
  const deckglInstance = useDeckgl();
  useControl(() => deckglInstance);

  return null;
}

function DeckglMap() {
  return (
    <Deckgl interleaved>
      <BasemapSync />
      <scatterplotLayer id="example" ... />
    </Deckgl>
}

function Basemap({ children }) {
  return (
    <Map initialViewState={INITIAL_VIEW_STATE} mapStyle={MAP_STYLE}>
      {children}
    </Map>
  )
}

function App() {
  return (
    <Basemap>
      <DeckglMap />
    </Basemap>
  )
}

createRoot(document.getElementById('root')).render(<App />);
```

Out of the box all layers and views from `@deck.gl/core`, `@deck.gl/geo-layers`, `@deck.gl/layers`, and `@deck.gl/mesh-layers` are available right away with no additional setup and full intellisense.

---

### Examples

- [Standalone](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/standalone): `pnpm --filter examples-standalone run dev`
- [MapLibre via `react-map-gl`](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/react-map-gl): `pnpm --filter examples-react-map-gl run dev`
- [Custom Layer](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/custom-layer): `pnpm --filter examples-custom-layer run dev`
- [Advanced with RSC](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/advanced): `pnpm --filter examples-advanced run dev`
- [Nextjs](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/nextjs): `pnpm --filter examples-nextjs run dev`
- [Remix/React Router](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/remix): `pnpm --filter examples-remix run dev`
- [Rsbuild](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/rsbuild): `pnpm --filter examples-rsbuild run dev`
- [Vite](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/vite): `pnpm --filter examples-vite run dev`
- [Views](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/views): `pnpm --filter examples-views run dev`
- [Widgets](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/widgets): `pnpm --filter examples-widgets run dev`

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

- Interleaving DOM based elements like `<div />` inside of the `<Deckgl />` component tree is not supported.
- The `<Map />` component from `react-map-gl/*` cannot be rendered as a child inside of the `<Deckgl />` component tree. However, you can wrap the `<Deckgl />` component with the `<Map />` component. See below for examples.

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

### Basemap Integration

> [!CAUTION]
> The `<Map />` component from `react-map-gl/*` cannot be rendered as a child inside of the `<Deckgl />` component tree. However, you can wrap the `<Deckgl />` component with the `<Map />` component. The `@deck.gl/mapbox` overlay is implicitly included in `@react-fiber-renderer/dom` and will work out of the box if you pass an `interleave` prop to the `<Deckgl />` component. 

- [Example](../../examples/react-map-gl/) with `react-map-gl` component
- [Example](../../examples/vite/) with `maplibre-gl` standalone

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


