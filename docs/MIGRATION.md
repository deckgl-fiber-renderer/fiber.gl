# Migration Guide: v1 → v2

This guide helps you migrate from the legacy layer-specific intrinsic elements (`<scatterplotLayer>`) to the new universal `<layer>` element pattern.

## Table of Contents

- [Why Migrate?](#why-migrate)
- [Syntax Comparison](#syntax-comparison)
- [Migration Steps](#migration-steps)
- [Custom Layers](#custom-layers)
- [Backwards Compatibility](#backwards-compatibility)
- [Search and Replace Patterns](#search-and-replace-patterns)
- [Troubleshooting](#troubleshooting)

---

## Why Migrate?

The new `<layer>` element brings significant improvements:

### 1. **Full TypeScript Generic Support**

**Old (v1):** No type inference for accessor functions

```tsx
<scatterplotLayer
  data={dataPoints}
  getPosition={(d) => d.coords} // d is 'any' - no autocomplete
/>
```

**New (v2):** Full generic type inference

```tsx
<layer
  layer={
    new ScatterplotLayer<DataPoint>({
      data: dataPoints,
      getPosition: (d) => d.coords, // ✅ d is DataPoint - full autocomplete!
    })
  }
/>
```

### 2. **Automatic Code-Splitting**

**Old (v1):** All layer classes bundled together

```tsx
import "@deckgl-fiber-renderer/reconciler/side-effects"; // Imports ALL layers
```

**New (v2):** Only bundle what you use

```tsx
import { ScatterplotLayer } from "@deck.gl/layers"; // Only this layer
import { Tile3DLayer } from "@deck.gl/geo-layers"; // Tree-shakeable
```

### 3. **No Registration Required**

**Old (v1):** Custom layers need manual registration

```tsx
import { extend } from "@deckgl-fiber-renderer/reconciler";
import { MyCustomLayer } from "./my-layer";

extend({ MyCustomLayer }); // Required!
```

**New (v2):** Custom layers work immediately

```tsx
import { MyCustomLayer } from "./my-layer";

<layer layer={new MyCustomLayer({ id: "custom" })} />; // Just works!
```

---

## Syntax Comparison

### Basic Layer

<table>
<tr>
<th>Old Syntax (v1)</th>
<th>New Syntax (v2+)</th>
</tr>
<tr>
<td>

```tsx
<scatterplotLayer
  id="points"
  data={data}
  getPosition={(d) => d.coords}
  getRadius={100}
  getFillColor={[255, 0, 0]}
/>
```

</td>
<td>

```tsx
<layer
  layer={
    new ScatterplotLayer({
      id: "points",
      data,
      getPosition: (d) => d.coords,
      getRadius: 100,
      getFillColor: [255, 0, 0],
    })
  }
/>
```

</td>
</tr>
</table>

### With Generic Types

<table>
<tr>
<th>Old Syntax (v1)</th>
<th>New Syntax (v2+)</th>
</tr>
<tr>
<td>

```tsx
// No way to add type parameter
<scatterplotLayer
  id="points"
  data={dataPoints}
  getPosition={(d) => d.coordinates}
/>
```

</td>
<td>

```tsx
<layer
  layer={
    new ScatterplotLayer<DataPoint>({
      id: "points",
      data: dataPoints,
      getPosition: (d) => d.coordinates,
      // ✅ TypeScript knows d is DataPoint
    })
  }
/>
```

</td>
</tr>
</table>

### With Views

<table>
<tr>
<th>Old Syntax (v1)</th>
<th>New Syntax (v2+)</th>
</tr>
<tr>
<td>

```tsx
<globeView id="main" controller>
  <geoJsonLayer id="data" data={data} getFillColor={[255, 255, 255]} />
</globeView>
```

</td>
<td>

```tsx
<layer
  layer={
    new GlobeView({
      id: "main",
      controller: true,
    })
  }
>
  <layer
    layer={
      new GeoJsonLayer({
        id: "data",
        data,
        getFillColor: [255, 255, 255],
      })
    }
  />
</layer>
```

</td>
</tr>
</table>

---

## Migration Steps

### Step 1: Install Latest Version

```bash
pnpm install @deckgl-fiber-renderer/dom@latest
```

### Step 2: Import Layer Classes

Add imports for the layer classes you use:

```tsx
// Add these imports
import { ScatterplotLayer, GeoJsonLayer } from "@deck.gl/layers";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { MapView, GlobeView } from "@deck.gl/core";
```

### Step 3: Remove Side-Effects Import

**Remove this line:**

```tsx
import "@deckgl-fiber-renderer/reconciler/side-effects"; // ❌ Delete
```

This import is deprecated and no longer needed.

### Step 4: Convert Each Layer

For each layer, wrap it in `<layer>` and instantiate the class:

**Before:**

```tsx
<scatterplotLayer id="points" data={data} getPosition={(d) => d.coords} />
```

**After:**

```tsx
<layer
  layer={
    new ScatterplotLayer({ id: "points", data, getPosition: (d) => d.coords })
  }
/>
```

### Step 5: Add Explicit IDs Everywhere

**⚠️ Critical:** Every layer MUST have an explicit `id` prop.

```tsx
<layer
  layer={
    new ScatterplotLayer({
      id: "my-unique-id", // ✅ Required!
      data,
      // ...
    })
  }
/>
```

Without explicit IDs, layers will recreate on every render, causing performance issues.

---

## Custom Layers

Custom layers become much simpler with v2!

### Old Pattern (v1)

**1. Define the layer class:**

```tsx
// my-custom-layer.ts
import { CompositeLayer } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";

export class MyCustomLayer extends CompositeLayer {
  renderLayers() {
    return [
      new ScatterplotLayer({
        id: `${this.props.id}-scatter`,
        data: this.props.data,
      }),
    ];
  }
}

// ❌ Required: Declare JSX type
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        myCustomLayer: any;
      }
    }
  }
}
```

**2. Register the layer:**

```tsx
// side-effects.ts
import { extend } from "@deckgl-fiber-renderer/reconciler";
import { MyCustomLayer } from "./my-custom-layer";

extend({ MyCustomLayer }); // ❌ Required registration
```

**3. Import side-effects:**

```tsx
// main.tsx
import "./side-effects"; // ❌ Must remember to import
```

**4. Use the layer:**

```tsx
<myCustomLayer id="custom" data={data} />
```

### New Pattern (v2)

**1. Define the layer class (same as before, but no JSX declaration):**

```tsx
// my-custom-layer.ts
import { CompositeLayer } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";

export class MyCustomLayer extends CompositeLayer {
  renderLayers() {
    return [
      new ScatterplotLayer({
        id: `${this.props.id}-scatter`,
        data: this.props.data,
      }),
    ];
  }
}

// ✅ No JSX declaration needed!
```

**2. Use the layer directly:**

```tsx
import { MyCustomLayer } from "./my-custom-layer";

<layer layer={new MyCustomLayer({ id: "custom", data })} />;
```

**That's it!** No registration, no side-effects file, no JSX declarations.

---

## Backwards Compatibility

**Both syntaxes work in v2** - you can migrate gradually.

```tsx
import { ScatterplotLayer } from "@deck.gl/layers";
import "@deckgl-fiber-renderer/reconciler/side-effects"; // Keep for old syntax

function Map({ data }) {
  return (
    <Deckgl>
      {/* Old syntax still works */}
      <geoJsonLayer id="old" data={oldData} />

      {/* New syntax */}
      <layer layer={new ScatterplotLayer({ id: "new", data: newData })} />
    </Deckgl>
  );
}
```

**In v3 (future):** Old syntax will be removed. Migrate before then.

---

## Search and Replace Patterns

Use your editor's find-and-replace to speed up migration:

### ScatterplotLayer

**Find (regex):**

```regex
<scatterplotLayer\s+([^>]*?)\/?>
```

**Replace with:**

```tsx
<layer layer={new ScatterplotLayer({ $1 })} />
```

Then manually:

1. Import `ScatterplotLayer` from `@deck.gl/layers`
2. Fix any multi-line props
3. Ensure explicit `id` is present

### GeoJsonLayer

**Find (regex):**

```regex
<geoJsonLayer\s+([^>]*?)\/?>
```

**Replace with:**

```tsx
<layer layer={new GeoJsonLayer({ $1 })} />
```

### Other Layers

Repeat for each layer type:

- `arcLayer` → `ArcLayer`
- `iconLayer` → `IconLayer`
- `textLayer` → `TextLayer`
- etc.

**Tip:** Use PascalCase for the class name (e.g., `GeoJsonLayer`, not `GeoJSONLayer`).

---

## Troubleshooting

### "Type '{}' is not assignable to type 'Layer'"

**Problem:**

```tsx
<layer layer={{}} /> // ❌ Plain object
```

**Solution:**
You must instantiate the layer class with `new`:

```tsx
<layer layer={new ScatterplotLayer({ id: "points", data })} /> // ✅
```

---

### "Cannot find name 'ScatterplotLayer'"

**Problem:**
You're using the layer class but haven't imported it.

**Solution:**
Add the import:

```tsx
import { ScatterplotLayer } from "@deck.gl/layers";
```

---

### Layer recreates on every render

**Problem:**
Missing or non-stable `id` prop.

**Solution:**
Always provide explicit, stable IDs:

```tsx
// ❌ No ID
<layer layer={new ScatterplotLayer({ data })} />

// ✅ Explicit ID
<layer layer={new ScatterplotLayer({ id: 'points', data })} />

// ❌ Dynamic ID (changes every render)
<layer layer={new ScatterplotLayer({ id: Math.random(), data })} />

// ✅ Stable ID
<layer layer={new ScatterplotLayer({ id: 'points', data })} />
```

---

### Deprecation warnings in console

**Problem:**
You see warnings like:

```
Using deprecated <scatterplotLayer> element. Migrate to <layer layer={new ScatterplotLayer({...})} />
```

**Solution:**
These are intentional reminders to migrate. Follow the migration steps to use the new syntax.

To remove the warnings temporarily, you can suppress them, but the correct solution is to migrate.

---

### "Property 'layer' does not exist on type..."

**Problem:**
TypeScript doesn't recognize the `layer` prop.

**Solution:**
Make sure you're using the latest version of `@deckgl-fiber-renderer/types`:

```bash
pnpm install @deckgl-fiber-renderer/types@latest
```

---

### Custom layer doesn't work

**Problem:**
Old custom layer with JSX declaration not working with new syntax.

**Solution:**

1. Remove the JSX `IntrinsicElements` declaration
2. Remove any `extend()` calls
3. Import and use directly with `<layer layer={new MyCustomLayer({...})} />`

---

## Migration Checklist

- [ ] Install latest `@deckgl-fiber-renderer/dom`
- [ ] Import layer classes from `@deck.gl/*`
- [ ] Remove `side-effects` import
- [ ] Convert each layer to new syntax
- [ ] Add explicit `id` to every layer
- [ ] Remove custom layer registrations
- [ ] Test that layers still render correctly
- [ ] Verify no console warnings in development
- [ ] Check that TypeScript compiles without errors

---

## Need Help?

- **Examples:** See `examples/migration/` for side-by-side comparisons
- **Patterns:** Read `docs/REACT_PATTERNS.md` for best practices
- **Issues:** Report problems at https://github.com/deckgl-fiber-renderer/fiber.gl/issues

---

**Remember:** v2 maintains backwards compatibility. Take your time migrating - both syntaxes work together!
