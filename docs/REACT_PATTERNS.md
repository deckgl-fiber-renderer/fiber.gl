# React Integration Patterns

This guide explains how to properly integrate Deck.gl layers with React using `@deckgl-fiber-renderer`. Understanding these patterns is critical for building performant, maintainable visualizations.

## Table of Contents

- [Stable Layer IDs](#stable-layer-ids)
- [Layer Lifecycle Pattern](#layer-lifecycle-pattern)
- [Update Triggers](#update-triggers)
- [Dynamic Layer Lists](#dynamic-layer-lists)
- [Visibility vs Conditional Rendering](#visibility-vs-conditional-rendering)
- [Anti-Patterns](#anti-patterns)

---

## Stable Layer IDs

**Every layer instance MUST have an explicit `id` prop.** This is the most important pattern for proper React integration.

### Why IDs Matter

Deck.gl matches layers between renders by ID. When an ID is stable across renders:

- ✅ Deck.gl reuses GPU buffers
- ✅ Animations are smooth
- ✅ Performance is optimal

When an ID changes (or is missing):

- ❌ Deck.gl destroys and recreates the entire layer
- ❌ GPU buffers are reallocated
- ❌ Performance degrades significantly

### ✅ Correct: Explicit IDs

```tsx
import { ScatterplotLayer } from "@deck.gl/layers";
import { Deckgl } from "@deckgl-fiber-renderer/dom";

function Map({ data }) {
  return (
    <Deckgl>
      <layer
        layer={
          new ScatterplotLayer({
            id: "points", // ✅ Explicit, stable ID
            data,
            getPosition: (d) => d.coordinates,
            getRadius: 100,
          })
        }
      />
    </Deckgl>
  );
}
```

### ❌ Incorrect: Missing IDs

```tsx
function Map({ data }) {
  return (
    <Deckgl>
      <layer
        layer={
          new ScatterplotLayer({
            // ❌ No ID - Deck.gl will generate one, but it changes every render!
            data,
            getPosition: (d) => d.coordinates,
            getRadius: 100,
          })
        }
      />
    </Deckgl>
  );
}
```

**Result:** Layer reinitializes on every render, causing performance issues.

### Runtime Warning

In development mode, you'll see a warning when IDs are missing:

```
Layer missing explicit "id" prop - this will cause expensive reinitialization
on every render. Add: id: "unique-id"
```

---

## Layer Lifecycle Pattern

**Creating new layer instances on every render is the recommended pattern.** This may seem counterintuitive, but it's how Deck.gl is designed to work.

### Why Create Layers Each Render?

Deck.gl layers are **descriptor objects** that are:

- Very cheap to create (just plain JavaScript objects)
- Matched by ID between renders
- Diffed internally by Deck.gl to detect prop changes

You should think of layers like React elements - they describe _what_ you want, not _how_ to create it.

### ✅ Correct: Inline Layer Creation

```tsx
function Map({ data, colorScheme }) {
  // ✅ Create new layer instance each render
  return (
    <Deckgl>
      <layer
        layer={
          new ScatterplotLayer({
            id: "points",
            data,
            getPosition: (d) => d.coordinates,
            getFillColor: colorScheme === "red" ? [255, 0, 0] : [0, 0, 255],
            getRadius: 100,
          })
        }
      />
    </Deckgl>
  );
}
```

Deck.gl matches the new instance with the previous one by ID and only updates what changed.

### ❌ Incorrect: Memoizing Layer Instances

```tsx
function Map({ data, colorScheme }) {
  // ❌ Over-memoization - usually unnecessary and can cause bugs
  const layer = useMemo(
    () =>
      new ScatterplotLayer({
        id: "points",
        data,
        getPosition: (d) => d.coordinates,
        getFillColor: colorScheme === "red" ? [255, 0, 0] : [0, 0, 255],
        getRadius: 100,
      }),
    [data, colorScheme] // Easy to forget dependencies
  );

  return (
    <Deckgl>
      <layer layer={layer} />
    </Deckgl>
  );
}
```

**Problems:**

- Adds complexity with no performance benefit
- Easy to forget dependencies (stale closures)
- Goes against Deck.gl's recommended pattern

---

## Update Triggers

**Use `updateTriggers` when accessor functions depend on React state or props.**

### The Problem

Deck.gl caches computed attributes for performance. When you pass an accessor function, Deck.gl only re-runs it if:

1. The data array changes
2. You explicitly tell it to via `updateTriggers`

It does **not** detect when the accessor function's _behavior_ changes due to closures over changing state/props.

### ✅ Correct: Using updateTriggers

```tsx
function Map({ data }) {
  const [colorScheme, setColorScheme] = useState<"red" | "blue">("red");
  const [sizeMultiplier, setSizeMultiplier] = useState(1);

  return (
    <Deckgl>
      <layer
        layer={
          new ScatterplotLayer({
            id: "points",
            data,
            getPosition: (d) => d.coordinates,

            // Accessor depends on colorScheme state
            getFillColor: (d) =>
              colorScheme === "red" ? [255, 0, 0] : [0, 0, 255],

            // Accessor depends on sizeMultiplier state
            getRadius: (d) => d.value * sizeMultiplier,

            // ✅ Tell Deck.gl when to recompute
            updateTriggers: {
              getFillColor: colorScheme,
              getRadius: sizeMultiplier,
            },
          })
        }
      />
    </Deckgl>
  );
}
```

### ❌ Incorrect: Missing updateTriggers

```tsx
function Map({ data }) {
  const [colorScheme, setColorScheme] = useState<"red" | "blue">("red");

  return (
    <Deckgl>
      <layer
        layer={
          new ScatterplotLayer({
            id: "points",
            data,
            getPosition: (d) => d.coordinates,
            // ❌ Accessor depends on colorScheme, but no updateTrigger!
            getFillColor: (d) =>
              colorScheme === "red" ? [255, 0, 0] : [0, 0, 255],
            getRadius: 100,
          })
        }
      />
    </Deckgl>
  );
}
```

**Result:** Changing `colorScheme` won't update colors. Deck.gl reuses cached values.

### When Do You Need updateTriggers?

| Accessor Pattern                                                    | Needs updateTriggers?                              |
| ------------------------------------------------------------------- | -------------------------------------------------- |
| `getFillColor: [255, 0, 0]`                                         | ❌ No (static value)                               |
| `getFillColor: (d) => d.color`                                      | ❌ No (only uses data properties)                  |
| `getFillColor: (d) => scheme === 'red' ? [255, 0, 0] : [0, 0, 255]` | ✅ Yes (depends on external `scheme` variable)     |
| `getFillColor: (d) => d.value * multiplier`                         | ✅ Yes (depends on external `multiplier` variable) |

**Rule of thumb:** If your accessor function references anything outside the `data` item parameter, you need `updateTriggers`.

---

## Dynamic Layer Lists

**When rendering lists of layers, provide both React `key` and Deck.gl `id`.**

### Why Both keys and IDs?

- **React `key`:** Tells React which JSX elements correspond between renders
- **Deck.gl `id`:** Tells Deck.gl which layer instances correspond between renders

They serve different purposes and both are necessary.

### ✅ Correct: Both key and id

```tsx
interface LayerConfig {
  id: string;
  data: DataPoint[];
  color: [number, number, number];
}

function Map({ layerConfigs }: { layerConfigs: LayerConfig[] }) {
  return (
    <Deckgl>
      {layerConfigs.map((config) => (
        <layer
          key={config.id} // ✅ React key for reconciliation
          layer={
            new ScatterplotLayer({
              id: config.id, // ✅ Deck.gl ID for layer matching
              data: config.data,
              getFillColor: config.color,
              getPosition: (d) => d.coordinates,
              getRadius: 100,
            })
          }
        />
      ))}
    </Deckgl>
  );
}
```

### ❌ Incorrect: Using array index as key

```tsx
function Map({ layerConfigs }) {
  return (
    <Deckgl>
      {layerConfigs.map((config, index) => (
        <layer
          key={index} // ❌ Index as key - breaks when list order changes
          layer={
            new ScatterplotLayer({
              id: config.id,
              data: config.data,
              getFillColor: config.color,
              getPosition: (d) => d.coordinates,
              getRadius: 100,
            })
          }
        />
      ))}
    </Deckgl>
  );
}
```

**Problem:** If list order changes, React will reuse the wrong elements, causing visual glitches.

---

## Visibility vs Conditional Rendering

**For frequently toggled layers, use the `visible` prop instead of conditional rendering.**

### Performance Trade-offs

| Pattern               | GPU Resources          | Use When                                |
| --------------------- | ---------------------- | --------------------------------------- |
| `visible` prop        | ✅ Preserved           | Toggling frequently (e.g., UI controls) |
| Conditional rendering | ❌ Destroyed/recreated | Truly removing layer from scene         |

### ✅ Correct: Using visible for toggles

```tsx
function Map({ data, showHeatmap }) {
  return (
    <Deckgl>
      <layer
        layer={
          new ScatterplotLayer({
            id: "points",
            data,
            getPosition: (d) => d.coordinates,
            getRadius: 100,
            visible: showHeatmap, // ✅ Fast toggle, GPU resources preserved
          })
        }
      />
    </Deckgl>
  );
}
```

### ❌ Incorrect: Conditional rendering for frequent toggles

```tsx
function Map({ data, showHeatmap }) {
  return (
    <Deckgl>
      {/* ❌ Destroys and recreates GPU buffers on every toggle */}
      {showHeatmap && (
        <layer
          layer={
            new ScatterplotLayer({
              id: "points",
              data,
              getPosition: (d) => d.coordinates,
              getRadius: 100,
            })
          }
        />
      )}
    </Deckgl>
  );
}
```

### When to Use Each

**Use `visible` prop:**

- Layer visibility controlled by UI toggle
- Frequent showing/hiding
- Layer might be shown again soon

**Use conditional rendering:**

- Layer only needed in specific app states
- Won't be shown again for a while
- Want to completely remove from scene

---

## Anti-Patterns

### ❌ Creating Layers Outside Render

```tsx
// ❌ WRONG: Layer created once at module level
const layer = new ScatterplotLayer({
  id: "points",
  data: [], // Frozen at initial value!
  getPosition: (d) => d.coordinates,
});

function Map({ data }) {
  // Props are frozen - won't update!
  return (
    <Deckgl>
      <layer layer={layer} />
    </Deckgl>
  );
}
```

**Problem:** Layer props are frozen at creation time and never update.

**Fix:** Create layer inside render function.

---

### ❌ Missing IDs in Dynamic Lists

```tsx
function Map({ items }) {
  return (
    <Deckgl>
      {items.map((item) => (
        <layer
          key={item.id}
          layer={
            new ScatterplotLayer({
              // ❌ No ID! Each layer recreates on every render
              data: item.data,
              getPosition: (d) => d.coordinates,
            })
          }
        />
      ))}
    </Deckgl>
  );
}
```

**Problem:** Every layer recreates from scratch on each render.

**Fix:** Add explicit IDs: `id: item.id`

---

### ❌ Over-Memoization

```tsx
function Map({ data, filter }) {
  // ❌ Unnecessary complexity, no performance benefit
  const filteredData = useMemo(
    () => data.filter((d) => d.value > filter),
    [data, filter]
  );

  const layer = useMemo(
    () =>
      new ScatterplotLayer({
        id: "points",
        data: filteredData,
        getPosition: (d) => d.coordinates,
        getRadius: 100,
      }),
    [filteredData]
  );

  return (
    <Deckgl>
      <layer layer={layer} />
    </Deckgl>
  );
}
```

**Problem:** Adds cognitive overhead, easy to miss dependencies, and provides no performance benefit since layer creation is already cheap.

**Fix:** Just create the layer inline. Filter inline too if it's not expensive.

---

## Summary

1. **Always use explicit layer IDs** - This is the #1 most important pattern
2. **Create layers inline each render** - It's fast and recommended by Deck.gl
3. **Use updateTriggers** when accessors depend on external state/props
4. **Provide both React key and Deck.gl id** for dynamic lists
5. **Use visible prop** for frequent toggling instead of conditional rendering
6. **Avoid memoization** unless profiling shows a real benefit

Following these patterns ensures your Deck.gl visualizations are performant and behave correctly with React's rendering model.
