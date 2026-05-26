---
"@deckgl-fiber-renderer/dom": patch
"@deckgl-fiber-renderer/reconciler": patch
"@deckgl-fiber-renderer/shared": patch
"@deckgl-fiber-renderer/types": patch
---

Fix race condition where React refs were null during Deck.gl initialization, causing duplicate canvas creation. Refs are now spread in layout effect after commit phase when guaranteed to be populated. Also adds support for external canvas elements via `canvas` prop when provided, no wrapper/canvas is rendered.
