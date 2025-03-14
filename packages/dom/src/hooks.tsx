import {
  type DependencyList,
  type EffectCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  selectors,
  useStore,
  isBrowserEnvironment,
} from '@deckgl-fiber-renderer/shared';

export function useIsomorphicLayoutEffect(
  fn: EffectCallback,
  deps?: DependencyList,
) {
  return isBrowserEnvironment ? useLayoutEffect(fn, deps) : useEffect(fn, deps);
}

export function useDeckgl() {
  return useStore(selectors.deckgl);
}
