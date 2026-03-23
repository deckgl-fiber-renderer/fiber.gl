import {
  selectors,
  useStore,
  isBrowserEnvironment,
} from "@deckgl-fiber-renderer/shared";
import { useEffect, useLayoutEffect } from 'react';
import type { DependencyList, EffectCallback } from 'react';

export function useIsomorphicLayoutEffect(
  fn: EffectCallback,
  deps?: DependencyList
) {
  return isBrowserEnvironment ? useLayoutEffect(fn, deps) : useEffect(fn, deps);
}

export function useDeckgl() {
  return useStore(selectors.deckgl);
}
