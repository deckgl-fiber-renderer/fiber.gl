---
"@deckgl-fiber-renderer/reconciler": major
"@deckgl-fiber-renderer/shared": major
"@deckgl-fiber-renderer/types": major
"@deckgl-fiber-renderer/dom": major
---

## Major v2 Release

Replaced JSX intrinsic elements (`<scatterplotLayer>`) with a unified `<layer>` element that accepts layer instances. This enables full TypeScript inference, automatic code-splitting, and eliminates the need for layer registration.

### Migration Guide

**Before (v1):**

```tsx
<Deckgl>
  <scatterplotLayer
    id="points"
    data={data}
    getPosition={(d) => d.coordinates}
    getRadius={100}
  />
</Deckgl>
```

**After (v2):**

```tsx
import { ScatterplotLayer } from "@deck.gl/layers";

<Deckgl>
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
</Deckgl>;
```

Remove the deprecated `@deckgl-fiber-renderer/reconciler/side-effects` import if present.
