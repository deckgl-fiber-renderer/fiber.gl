import { selectors, useStore } from '@deckgl-fiber-renderer/shared';

export function useDeckgl() {
  return useStore(selectors.deckgl);
}
