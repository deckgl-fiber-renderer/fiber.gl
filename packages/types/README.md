# @deckgl-fiber-renderer/types

> **Auto-included with [@deckgl-fiber-renderer/dom](../dom).** No separate installation needed.

TypeScript definitions for deck.gl JSX elements. Provides type-safe layer creation with generic type parameters and IntelliSense.

## Installation

```bash
pnpm add @deckgl-fiber-renderer/types
```

Automatically installed with `@deckgl-fiber-renderer/dom`. Only install directly if using the reconciler standalone.

---

## How-To: Type-Safe Accessor Functions

**Problem:** Accessor function parameters typed as `any` - no autocomplete, no type safety.

```tsx
<layer
  layer={
    new ScatterplotLayer({
      id: "points",
      data: myData,
      getPosition: (d) => d.coordinates, // d is 'any'
      getRadius: (d) => d.value, // d is 'any'
    })
  }
/>
```

**Solution:** Pass data type as generic parameter.

```tsx
type DataPoint = {
  coordinates: [number, number];
  value: number;
  color: [number, number, number];
};

<layer
  layer={
    new ScatterplotLayer<DataPoint>({
      id: "points",
      data: myData,
      getPosition: (d) => d.coordinates, // d is DataPoint ✅
      getRadius: (d) => d.value, // Full autocomplete ✅
      getFillColor: (d) => d.color, // Type errors on typos ✅
    })
  }
/>;
```

**Benefits:**

- IntelliSense shows available properties
- TypeScript catches typos and type mismatches
- Rename refactors work across accessor functions
- Types serve as inline documentation

---

## How-To: Type Custom Layers (Optional)

Custom layers work with `<layer>` without type declarations. Extend `IntrinsicElements` only if you want a dedicated JSX element.

**Recommended approach (no declaration):**

```tsx
import { CompositeLayer } from "@deck.gl/core";

class CustomLayer extends CompositeLayer<{ customRadius: number }> {
  renderLayers() {
    return new ScatterplotLayer({
      id: `${this.props.id}-scatter`,
      data: this.props.data,
      getRadius: this.props.customRadius,
    });
  }
}

// Just works
<layer layer={new CustomLayer({ id: "custom", data, customRadius: 200 })} />;
```

**Alternative approach (custom element):**

```tsx
type CustomLayerProps = {
  id: string;
  data: unknown[];
  customRadius: number;
};

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      customLayer: CustomLayerProps;
    }
  }
}

// Now type-checked (but <layer> is recommended)
<customLayer id="custom" data={data} customRadius={200} />;
```

---

## Reference: JSX Element Types

### `<layer>` Element

Universal layer element accepts any deck.gl Layer instance.

```tsx
import { ScatterplotLayer, PathLayer } from "@deck.gl/layers";

<layer layer={new ScatterplotLayer({ id: "points", data })} />;
<layer layer={new PathLayer({ id: "paths", data })} />;
```

**Type definition:**

```tsx
interface IntrinsicElements {
  layer: {
    layer: Layer;
    key?: string;
    ref?: React.Ref<Layer>;
  };
}
```

### `<view>` Element

Universal view element accepts any deck.gl View instance.

```tsx
import { MapView, OrthographicView } from "@deck.gl/core";

<view view={new MapView({ id: "main" })} />;
<view view={new OrthographicView({ id: "minimap" })} />;
```

**Type definition:**

```tsx
interface IntrinsicElements {
  view: {
    view: View;
    key?: string;
    ref?: React.Ref<View>;
  };
}
```

### Deprecated Layer Elements

Layer-specific elements (v1 syntax) are still typed but marked `@deprecated`:

```tsx
interface IntrinsicElements {
  /** @deprecated Use <layer layer={new ScatterplotLayer(...)} /> instead */
  scatterplotLayer: ScatterplotLayerProps;

  /** @deprecated Use <layer layer={new PathLayer(...)} /> instead */
  pathLayer: PathLayerProps;

  // ... other deprecated elements
}
```

TypeScript shows deprecation warnings when using these elements.

---

## TypeScript Configuration

### Required Compiler Options

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

For best experience:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

These catch more type errors and improve accessor function types.

---

## Related Packages

- **[@deckgl-fiber-renderer/dom](../dom)** - Main package (includes this package)
- **[@deckgl-fiber-renderer/reconciler](../reconciler)** - Reconciler implementation
