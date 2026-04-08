# @deckgl-fiber-renderer/types

> **Auto-included with [@deckgl-fiber-renderer/dom](../dom).** You don't need to install this package separately.

TypeScript definitions for deck.gl JSX elements. Type-safe layer creation with generic type parameters and IntelliSense support.

## Installation

```bash
pnpm add @deckgl-fiber-renderer/types
```

This package is automatically installed when you install `@deckgl-fiber-renderer/dom`. You only need to install it directly if you're using the reconciler standalone.

## Table of Contents

- [Overview](#overview)
- [Generic Type Parameters](#generic-type-parameters)
- [JSX Element Types](#jsx-element-types)
- [Custom Layer Typing](#custom-layer-typing)
- [v2 Type System](#v2-type-system)
- [TypeScript Configuration](#typescript-configuration)
- [Related Packages](#related-packages)

## Overview

This package provides TypeScript definitions for:

- `<layer>` and `<view>` JSX elements
- Generic type parameters for type-safe accessor functions
- Legacy layer-specific elements (deprecated but still typed)
- Custom layer integration with `JSX.IntrinsicElements`

When you import `@deckgl-fiber-renderer/dom`, these types are automatically available. No additional imports or configuration needed.

## Generic Type Parameters

v2's type system supports generic type parameters. Pass a data type to deck.gl layer constructors, and TypeScript will infer types for all accessor functions.

### Without Generics

```tsx
<layer
  layer={
    new ScatterplotLayer({
      id: 'points',
      data: myData,
      getPosition: (d) => d.coordinates, // d is 'any' - no autocomplete
      getRadius: (d) => d.value, // d is 'any' - no type safety
    })
  }
/>
```

### With Generics

```tsx
type DataPoint = {
  coordinates: [number, number];
  value: number;
  color: [number, number, number];
};

<layer
  layer={
    new ScatterplotLayer<DataPoint>({
      id: 'points',
      data: myData,
      getPosition: (d) => d.coordinates, // d is DataPoint - full autocomplete!
      getRadius: (d) => d.value, // TypeScript validates property access
      getFillColor: (d) => d.color, // Catches typos and wrong types
    })
  }
/>;
```

### Benefits

IntelliSense shows available properties. TypeScript catches typos and type mismatches. Rename refactors work across accessor functions. Types serve as inline documentation.

## JSX Element Types

### `<layer>` Element

The universal `<layer>` element accepts any deck.gl Layer instance:

```tsx
import { ScatterplotLayer, PathLayer } from '@deck.gl/layers';

<layer layer={new ScatterplotLayer({ id: 'points', data })} />
<layer layer={new PathLayer({ id: 'paths', data })} />
```

The `layer` prop is required and must be a deck.gl `Layer` instance. TypeScript validates this at compile time.

### `<view>` Element

The universal `<view>` element accepts any deck.gl View instance:

```tsx
import { MapView, OrthographicView } from '@deck.gl/core';

<view view={new MapView({ id: 'main' })} />
<view view={new OrthographicView({ id: 'minimap' })} />
```

The `view` prop is required and must be a deck.gl `View` instance.

### Type Definitions

```tsx
declare namespace JSX {
  interface IntrinsicElements {
    layer: {
      layer: Layer;
      key?: string;
      ref?: React.Ref<Layer>;
    };

    view: {
      view: View;
      key?: string;
      ref?: React.Ref<View>;
    };
  }
}
```

## Custom Layer Typing

### v2 Approach (No Declaration Needed)

Custom layers work with the universal `<layer>` element without type declarations:

```tsx
import { CompositeLayer } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';

class CustomLayer extends CompositeLayer<{ customRadius: number }> {
  renderLayers() {
    return new ScatterplotLayer({
      id: `${this.props.id}-scatter`,
      data: this.props.data,
      getRadius: this.props.customRadius,
    });
  }
}

// Just works - no type declaration needed
<layer layer={new CustomLayer({ id: 'custom', data, customRadius: 200 })} />;
```

### Adding Custom JSX Elements (Optional)

If you want a dedicated JSX element (not recommended in v2), extend `IntrinsicElements`:

```tsx
import type { CompositeLayer } from '@deck.gl/core';

type CustomLayerProps = {
  id: string;
  data: unknown[];
  customRadius: number;
};

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        customLayer: CustomLayerProps;
      }
    }
  }
}

// Now this works (but use <layer> instead)
<customLayer id="custom" data={data} customRadius={200} />;
```

## v2 Type System

### Universal Elements

v2 uses universal `<layer>` and `<view>` elements instead of layer-specific elements. This simplifies the type system:

**v1 types:**

- 50+ layer-specific element definitions
- Required side-effects import to register types
- No generic support

**v2 types:**

- 2 universal element definitions (`layer`, `view`)
- No registration needed
- Full generic support

### Deprecated Element Types

Layer-specific elements are still typed but marked `@deprecated`:

```tsx
declare namespace JSX {
  interface IntrinsicElements {
    /** @deprecated Use <layer layer={new ScatterplotLayer(...)} /> instead */
    scatterplotLayer: ScatterplotLayerProps;

    /** @deprecated Use <layer layer={new PathLayer(...)} /> instead */
    pathLayer: PathLayerProps;

    // ... other deprecated elements
  }
}
```

TypeScript will show deprecation warnings when you use these elements, encouraging migration to v2 syntax.

## TypeScript Configuration

### Required Compiler Options

Your `tsconfig.json` needs these options:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "types": ["@deckgl-fiber-renderer/types"]
  }
}
```

### Recommended Options

For the best experience:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

These options catch more type errors and make accessor function types more accurate.

## Related Packages

- **[@deckgl-fiber-renderer/dom](../dom)** - Main package (includes this package)
- **[@deckgl-fiber-renderer/reconciler](../reconciler)** - Reconciler implementation
