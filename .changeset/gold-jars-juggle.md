---
"@deckgl-fiber-renderer/reconciler": minor
"@deckgl-fiber-renderer/shared": minor
---

Allow user to pass layers to the `layers` prop in our `<Deckgl />` component alongside tradition React children. E.g.

```jsx
const passedLayers = [ new ScatterplotLayer({ id: 'a', ... }) ];

<Deckgl layers={passedLayers}>
  <scatterplotLayer id="b" ... />
</Deckgl>
```

This will result in the following layers array: 

```js
[layer.a, layer.b]
```
