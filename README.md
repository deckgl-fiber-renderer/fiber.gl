![Deckgl Fiber Renderer](assets/banner.jpg)

# Deckgl Fiber Renderer

A React renderer for [deck.gl](https://deck.gl/).

> [!IMPORTANT]
> Requires `react` `>=19` and `@deck.gl/*` `>=v9.1`

[See documentation here](./packages/dom/README.md)

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

Out of the box all layers and views from `@deck.gl/core`, `@deck.gl/geo-layers`, `@deck.gl/layers`, and `@deck.gl/mesh-layers` are available right away with no additional setup.

## 💡 Contributing

Read the [contributing](CONTRIBUTING.md) guidelines file if you are interested in contributing.

## ✨ Versioning

A traditional [Semver](https://semver.org/) is followed for versioning of packages.

## 🔍 License

Licensed under the [MIT License](https://opensource.org/license/mit). Read the [license instructions](LICENSE) if you are interested in contributing or using any of the packages.

## 🚀 Special Thanks

A special thanks to the following projects:

- [deck.gl](https://github.com/visgl/deck.gl)
- [react-three-fiber](https://github.com/pmndrs/react-three-fiber)
- [react-pdf](https://github.com/diegomura/react-pdf)
