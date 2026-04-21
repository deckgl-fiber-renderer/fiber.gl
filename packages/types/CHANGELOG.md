# @deckgl-fiber-renderer/types

## 2.0.0

### Major Changes

- 80fa689: ## Major v2 Release

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

## 1.4.0

### Minor Changes

- 3471a06: Fixed `isView` logic to allow for other view types.
  Fixed some types for Views.

## 1.3.0

## 1.2.0

## 1.1.1

### Patch Changes

- e10b626: Remove unused peer dependency.

## 1.1.0

## 1.0.1

### Patch Changes

- ae01661: Mark package as public.

## 1.0.0

### Major Changes

- 765634b: Initial release.
