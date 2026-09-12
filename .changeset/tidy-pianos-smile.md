---
"@deckgl-fiber-renderer/reconciler": patch
---

Fix `unmountAtNode` finalizing another root's deck.gl instance

The store is a module-level singleton shared by every root, so when two roots
are alive at once the store holds whichever instance was configured last. React
commits an incoming root's effects before the outgoing root's cleanup runs, so
unmounting the first root finalized the instance the second had just created and
blanked the shared slot — leaving `useDeckgl()` undefined for good while a live
instance was still on screen.

Each root now finalizes the instance it created, and the shared slot is only
cleared while it still points at that instance. Instances placed into the store
from outside `configure()` are unaffected.
