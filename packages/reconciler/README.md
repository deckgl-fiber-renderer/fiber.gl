# @deckgl-fiber-renderer/reconciler

React reconciler implementation for Deck.gl layers and views.

## Installation

```bash
npm install @deckgl-fiber-renderer/reconciler
```

This package is automatically installed as a dependency of `@deckgl-fiber-renderer/dom`.

## What's New in v2

The reconciler now supports the universal `<layer>` element pattern:

```tsx
import { ScatterplotLayer } from '@deck.gl/layers';

<layer
  layer={
    new ScatterplotLayer({
      id: 'points',
      data: myData,
      getPosition: (d) => d.coordinates,
      getRadius: 100,
    })
  }
/>;
```

### Key Changes

- **Pass-through architecture** - Reconciler extracts `props.layer` instead of constructing from a catalogue
- **No registration needed** - Custom layers work without `extend()` calls
- **Development warnings** - Warns about missing IDs and deprecated syntax in development mode
- **Backwards compatible** - Legacy layer-specific elements still work in v2

### Deprecated APIs

The following APIs are deprecated in v2 and will be removed in v3:

#### `side-effects` import

```tsx
// ❌ Deprecated - remove this import
import '@deckgl-fiber-renderer/reconciler/side-effects';
```

Layer registration is no longer needed. This import is now a no-op that shows a deprecation warning.

#### `extend()` function

```tsx
// ❌ Deprecated - no longer needed
import { extend } from '@deckgl-fiber-renderer/reconciler';
extend({ MyCustomLayer });
```

Custom layers now work directly without registration:

```tsx
// ✅ Just use them!
import { MyCustomLayer } from './my-custom-layer';

<layer layer={new MyCustomLayer({ id: 'custom' })} />;
```

## Features

### Refs Expose Deck.gl Instances

Refs now correctly expose the actual Layer or View instance, giving you access to all Deck.gl methods:

```tsx
import { useRef } from 'react';
import { ScatterplotLayer } from '@deck.gl/layers';

function MyComponent() {
  const layerRef = useRef<ScatterplotLayer>(null);

  useEffect(() => {
    // Access actual deck.gl layer methods
    console.log(layerRef.current?.props);
    console.log(layerRef.current?.id);
  }, []);

  return (
    <layer
      ref={layerRef}
      layer={
        new ScatterplotLayer({
          id: 'points',
          data: myData,
        })
      }
    />
  );
}
```

### Suspense Support

The reconciler fully supports React Suspense boundaries:

```tsx
import { Suspense } from 'react';

<Suspense fallback={<LoadingLayers />}>
  <AsyncLayerComponent />
</Suspense>;
```

### Layer ID Validation

In development mode, the reconciler validates layer IDs to prevent common bugs:

**Missing IDs** - Warns when layers are missing explicit IDs:

```tsx
// ⚠️ Development warning - layer will reinitialize on every render
<layer layer={new ScatterplotLayer({ data })} />

// ✅ Correct - stable ID prevents reinitialization
<layer layer={new ScatterplotLayer({ id: "my-layer", data })} />
```

**Duplicate IDs** - Errors when multiple layers share the same ID:

```tsx
// ❌ Error - duplicate IDs break deck.gl's diffing
<layer layer={new ScatterplotLayer({ id: "points", data: data1 })} />
<layer layer={new ScatterplotLayer({ id: "points", data: data2 })} />
```

These validations only run in development and are stripped from production builds.

## Reconciler Mode

This reconciler operates in **persistence mode** (not mutation mode). It creates new layer instances on every render, which aligns with Deck.gl's design philosophy that "layers are descriptor objects that are very cheap to instantiate."

Deck.gl matches layers between renders by ID and efficiently diffs props to determine what needs updating. This is why explicit `id` props are critical for performance.

## Documentation

- [React Integration Patterns](../../docs/REACT_PATTERNS.md)
- [Migration Guide](../../docs/MIGRATION.md)
- [Validation Guide](../../docs/VALIDATION.md)
- [Main Documentation](../dom/README.md)
