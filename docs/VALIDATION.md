# Validation Guide

The reconciler includes development-mode validation to help prevent common Deck.gl integration mistakes. These checks only run when `process.env.NODE_ENV === "development"` and are completely removed from production builds.

## Layer ID Requirements

### Why Layer IDs Matter

Deck.gl uses layer IDs for efficient diffing between renders. Without explicit IDs, layers reinitialize on every render, which is expensive and can cause:

- Loss of animation state
- Unnecessary GPU memory allocation
- Poor performance
- Flickering during updates

### Missing ID Warning

When a layer is created without an explicit ID (or with the default "unknown" ID), you'll see:

```
⚠️  Layer missing explicit "id" prop. This causes expensive
reinitialization on every render.

Add a stable ID:
<layer layer={new ScatterplotLayer({ id: "my-layer", ... })} />
```

**Example - Incorrect:**

```tsx
function MyMap({ data }) {
  // ❌ No ID - layer reinitializes every render
  return (
    <layer
      layer={
        new ScatterplotLayer({
          data,
          getPosition: (d) => d.coordinates,
        })
      }
    />
  );
}
```

**Example - Correct:**

```tsx
function MyMap({ data }) {
  // ✅ Explicit ID - efficient updates
  return (
    <layer
      layer={
        new ScatterplotLayer({
          id: "my-points",
          data,
          getPosition: (d) => d.coordinates,
        })
      }
    />
  );
}
```

### Choosing Good IDs

**Static layers** - Use descriptive constant IDs:

```tsx
<layer layer={new ScatterplotLayer({ id: "earthquake-points", data })} />
<layer layer={new PathLayer({ id: "flight-paths", data })} />
```

**Dynamic layers** - When rendering lists, include the item identifier:

```tsx
{
  cities.map((city) => (
    <layer
      key={city.id}
      layer={
        new ScatterplotLayer({
          id: `city-${city.id}`,
          data: city.points,
        })
      }
    />
  ));
}
```

Note: Both React `key` and Deck.gl `id` are required. The `key` helps React reconcile the element tree, while the `id` helps Deck.gl diff layer instances.

## Duplicate ID Detection

### Why Duplicates Are Problematic

When multiple layers share the same ID, Deck.gl's diffing algorithm breaks. This causes:

- Incorrect prop updates going to wrong layers
- Layers disappearing or not updating
- Unpredictable rendering behavior

### Duplicate ID Error

When duplicate layer IDs are detected at render time, you'll see:

```
❌ Duplicate layer IDs detected: points, lines

Deck.gl uses layer IDs for diffing. Duplicate IDs cause incorrect updates.
Each layer must have a unique ID.
```

**Example - Incorrect:**

```tsx
function MyMap() {
  // ❌ Both layers have id "data-layer"
  return (
    <>
      <layer layer={new ScatterplotLayer({ id: "data-layer", data: points })} />
      <layer layer={new PathLayer({ id: "data-layer", data: paths })} />
    </>
  );
}
```

**Example - Correct:**

```tsx
function MyMap() {
  // ✅ Each layer has a unique ID
  return (
    <>
      <layer
        layer={new ScatterplotLayer({ id: "points-layer", data: points })}
      />
      <layer layer={new PathLayer({ id: "paths-layer", data: paths })} />
    </>
  );
}
```

### Views Are Not Validated

Views can share IDs without issues, so they're excluded from duplicate ID detection. Only Layers are validated.

## Enhanced Error Messages

### Unsupported Element Type

When an element type isn't registered (legacy syntax only), you'll see a helpful error:

```
Unsupported element type: "myCustomLayer"

Available elements: ScatterplotLayer, PathLayer, ...

Did you forget to import side-effects?
import "@deckgl-fiber-renderer/reconciler/side-effects";
```

This helps debug missing imports or typos in element names.

## Interpreting Validation Messages

### Development vs Production

All validation runs **only in development**:

```tsx
// This check only runs if NODE_ENV === "development"
if (process.env.NODE_ENV === "development") {
  if (!layer.id || layer.id === "unknown") {
    console.warn("Layer missing explicit 'id' prop...");
  }
}
```

When you build for production, these checks are completely removed by your bundler's dead code elimination.

### Warning vs Error

- **Warnings** (console.warn) - Issues that hurt performance but don't break functionality
  - Missing layer IDs
  - Deprecated syntax usage

- **Errors** (console.error) - Issues that cause incorrect behavior
  - Duplicate layer IDs

- **Thrown Errors** - Issues that prevent rendering
  - Unsupported element types
  - Missing required props

## Best Practices

1. **Always use explicit IDs** - Even if you don't see a warning, explicit IDs are best practice

2. **Use descriptive IDs** - `"earthquake-data"` is better than `"layer1"`

3. **Keep IDs stable** - Don't generate random IDs or include timestamps:

   ```tsx
   // ❌ Bad - new ID every render
   id: `layer-${Math.random()}`;

   // ✅ Good - stable ID
   id: "my-layer";
   ```

4. **Unique per layer type** - It's fine to have `{ id: "points" }` for both a ScatterplotLayer and a different map:

   ```tsx
   // ✅ OK - different contexts
   <MapA>
     <layer layer={new ScatterplotLayer({ id: "points" })} />
   </MapA>
   <MapB>
     <layer layer={new ScatterplotLayer({ id: "points" })} />
   </MapB>
   ```

5. **Test in development** - Validation is your friend! Run your app in development mode to catch issues early.

## Disabling Validation

Validation is automatically disabled in production builds. If you need to disable it in development (not recommended), you can set:

```tsx
// Not recommended - validation helps catch bugs
process.env.NODE_ENV = "production";
```

However, it's better to fix the underlying issues than to silence warnings.
