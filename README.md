![Deckgl Fiber Renderer](assets/banner.jpg)

# Deckgl Fiber Renderer

A React renderer for [deck.gl](https://deck.gl) that brings full React integration to geospatial visualization. Use deck.gl layers as React components with hooks, context, and composition.

## Why This Exists

The official deck.gl React bindings have limitations. This renderer removes them.

| Feature             | Official Bindings | deckgl-fiber-renderer  |
| ------------------- | ----------------- | ---------------------- |
| Component nesting   | ❌ Direct only    | ✅ Nest anywhere       |
| Hooks support       | ❌ No hooks       | ✅ Full hooks          |
| TypeScript generics | ❌ No inference   | ✅ Type-safe accessors |
| Custom layers       | ⚠️ Registration   | ✅ Works immediately   |
| Code splitting      | ❌ Bundles all    | ✅ Tree-shaking        |

## Quick Look

```tsx
import { Deckgl } from "@deckgl-fiber-renderer/dom";
import { ScatterplotLayer } from "@deck.gl/layers";

function MyMap() {
  const [radius, setRadius] = useState(100);

  return (
    <Deckgl initialViewState={{ longitude: -122.4, latitude: 37.8, zoom: 12 }}>
      <layer
        layer={
          new ScatterplotLayer({
            id: "points",
            data: myData,
            getPosition: (d) => d.coordinates,
            getRadius: radius,
          })
        }
      />
    </Deckgl>
  );
}
```

[→ Get Started](./packages/dom#tutorial)

## Packages

- **[@deckgl-fiber-renderer/dom](./packages/dom)** - Main package with `<Deckgl>` component and hooks
- **[@deckgl-fiber-renderer/reconciler](./packages/reconciler)** - React reconciler implementation (internal)
- **[@deckgl-fiber-renderer/types](./packages/types)** - TypeScript definitions (auto-included)
- **[@deckgl-fiber-renderer/shared](./packages/shared)** - Internal utilities (not for direct use)

## Requirements

- React `>=19`
- deck.gl `>=9.1`
- Modern bundler with tree-shaking (Vite, Next.js, Webpack 5+, Rsbuild)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT License](LICENSE)

## Acknowledgments

Built on [deck.gl](https://github.com/visgl/deck.gl) by Vis.gl. Inspired by [react-three-fiber](https://github.com/pmndrs/react-three-fiber) and [react-pdf](https://github.com/diegomura/react-pdf).
