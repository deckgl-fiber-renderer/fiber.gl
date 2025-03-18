# @deckgl-fiber-renderer/reconciler

## 1.2.0

### Minor Changes

- eb51691: Allow user to pass layers to the `layers` prop in our `<Deckgl />` component alongside tradition React children. E.g.

  ```jsx
  const passedLayers = [ new ScatterplotLayer({ id: 'a', ... }) ];

  <Deckgl layers={passedLayers}>
    <scatterplotLayer id="b" ... />
  </Deckgl>
  ```

  This will result in the following layers array:

  ```js
  [layer.a, layer.b];
  ```

### Patch Changes

- Updated dependencies [eb51691]
  - @deckgl-fiber-renderer/shared@1.2.0
  - @deckgl-fiber-renderer/types@1.2.0

## 1.1.1

### Patch Changes

- e10b626: Remove unused peer dependency.
- Updated dependencies [e10b626]
  - @deckgl-fiber-renderer/shared@1.1.1
  - @deckgl-fiber-renderer/types@1.1.1

## 1.1.0

### Patch Changes

- @deckgl-fiber-renderer/shared@1.1.0
- @deckgl-fiber-renderer/types@1.1.0

## 1.0.1

### Patch Changes

- ae01661: Mark package as public.
- Updated dependencies [ae01661]
  - @deckgl-fiber-renderer/shared@1.0.1
  - @deckgl-fiber-renderer/types@1.0.1

## 1.0.0

### Major Changes

- 765634b: Initial release.

### Patch Changes

- Updated dependencies [765634b]
  - @deckgl-fiber-renderer/shared@1.0.0
  - @deckgl-fiber-renderer/types@1.0.0
