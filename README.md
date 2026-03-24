![Deckgl Fiber Renderer](assets/banner.jpg)

# Deckgl Fiber Renderer

A React renderer for [deck.gl](https://deck.gl/).

> [!IMPORTANT]
> Requires `react`: `19.0.0` and `@deck.gl/*`: `^9.1.0`

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

```tsx
import { ScatterplotLayer } from '@deck.gl/layers';
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
      <layer
        layer={
          new ScatterplotLayer({
            id: 'points',
            data: myData,
            getPosition: (d) => d.coordinates,
            getRadius: 100,
            getFillColor: [255, 140, 0],
          })
        }
      />
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

### Documentation

- **[React Integration Patterns](docs/REACT_PATTERNS.md)** - Learn best practices for using Deck.gl with React
- **[Migration Guide](docs/MIGRATION.md)** - Step-by-step guide for upgrading from v1 to v2
- **[Package Documentation](packages/dom/README.md)** - Detailed API reference

### Key Concepts

**New in v2:** The universal `<layer>` element replaces layer-specific elements, bringing:

- Full TypeScript generic support for type-safe accessor functions
- Automatic code-splitting - only bundle the layers you import
- Zero configuration - no registration required, even for custom layers
- Backwards compatible - v1 syntax still works during migration

**Important:** Always provide explicit `id` props on your layers for optimal performance.

```tsx
// ✅ Good - explicit ID
<layer layer={new ScatterplotLayer({ id: 'points', data })} />

// ❌ Bad - missing ID causes performance issues
<layer layer={new ScatterplotLayer({ data })} />
```

---

### Examples

- [Migration Examples](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/migration): Side-by-side v1 vs v2 syntax comparison - `pnpm --filter examples-migration run dev`
- [Standalone](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/standalone): `pnpm --filter examples-standalone run dev`
- [MapLibre via `react-map-gl`](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/react-map-gl): `pnpm --filter examples-react-map-gl run dev`
- [Custom Layer](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/custom-layer): No registration needed! `pnpm --filter examples-custom-layer run dev`
- [Advanced with RSC](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/advanced): `pnpm --filter examples-advanced run dev`
- [Nextjs](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/nextjs): `pnpm --filter examples-nextjs run dev`
- [Remix/React Router](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/remix): `pnpm --filter examples-remix run dev`
- [Rsbuild](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/rsbuild): `pnpm --filter examples-rsbuild run dev`
- [Vite](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/vite): `pnpm --filter examples-vite run dev`
- [Views](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/views): `pnpm --filter examples-views run dev`
- [Widgets](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main/examples/widgets): `pnpm --filter examples-widgets run dev`

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
