# @deckgl-fiber-renderer/types

TypeScript type definitions for `@deckgl-fiber-renderer`.

## Installation

```bash
npm install @deckgl-fiber-renderer/types
```

This package is automatically installed as a dependency of `@deckgl-fiber-renderer/dom`.

## What's New in v2

The types package now includes the universal `<layer>` JSX element:

```tsx
import { ScatterplotLayer } from '@deck.gl/layers';

interface DataPoint {
  coordinates: [number, number];
  value: number;
}

// ✅ Full TypeScript generic support
<layer
  layer={
    new ScatterplotLayer<DataPoint>({
      id: 'points',
      data: myData,
      getPosition: (d) => d.coordinates, // d is typed as DataPoint
      getRadius: (d) => d.value,
    })
  }
/>;
```

### Key Features

- **Generic type parameters** - Pass type parameters to layer constructors for type-safe accessor functions
- **JSX.IntrinsicElements** - Defines the `layer` element and legacy layer-specific elements (deprecated)
- **Full autocomplete** - Get IntelliSense for all Deck.gl layer props

### Deprecated Types

Legacy layer-specific elements (`scatterplotLayer`, `geoJsonLayer`, etc.) are marked as `@deprecated` in v2 and will be removed in v3. Use the universal `<layer>` element instead.

## Documentation

- [React Integration Patterns](../../docs/REACT_PATTERNS.md)
- [Migration Guide](../../docs/MIGRATION.md)
- [Main Documentation](../dom/README.md)
