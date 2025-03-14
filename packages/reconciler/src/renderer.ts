import { Deck } from '@deck.gl/core';
import { MapboxOverlay } from '@deck.gl/mapbox';
import type { ReactNode } from 'react';
import reactReconciler from 'react-reconciler';
import { ConcurrentRoot } from 'react-reconciler/constants';
import * as config from './config';
import {
  noop,
  log,
  useStore as storeInstance,
} from '@deckgl-fiber-renderer/shared';
import type { DeckglProps } from '@deckgl-fiber-renderer/types';
import type { ReconcilerRoot, RootElement } from './types';

// @ts-expect-error @types/react-reconciler is incorrect
export const renderer = reactReconciler(config);

export const roots = new Map<RootElement, ReconcilerRoot>();

export function unmountAtNode(node: RootElement) {
  const root = roots.get(node);

  log
    .withMetadata({
      node,
      root,
    })
    .debug('renderer.unmountAtNode');

  if (root?.container) {
    renderer.updateContainer(null, root.container, null, noop);

    const state = root.store.getState();

    state.deckgl.finalize();
    state.setDeckgl(undefined!);
    roots.delete(node);
  }
}

export function createRoot(node: RootElement): ReconcilerRoot {
  log
    .withMetadata({
      node,
    })
    .debug('renderer.createRoot');

  const prevRoot = roots.get(node);
  const prevStore = prevRoot?.store;
  const prevContainer = prevRoot?.container;

  const store = prevStore ?? storeInstance;

  const container =
    prevContainer ??
    renderer.createContainer(
      { store },
      ConcurrentRoot, // tag
      null, // hydration callbacks
      false, // isStrictMode
      null, // concurrentUpdatesByDefaultOverride
      '', // identifierPrefix
      reportError, // onUncaughtError
      reportError, // onCaughtError
      // https://github.com/facebook/react/blob/main/packages/react-noop-renderer/src/createReactNoop.js#L1159
      // @ts-expect-error @types/react-reconciler is incorrect
      reportError, // onRecoverableError
      null, // transitionCallbacks
    );

  let configured = false;

  function configure(props: DeckglProps) {
    if (configured) {
      return;
    }

    log.withMetadata(props).debug('renderer.configure');

    const state = store.getState();

    // NOTE: interleaved prop is a hint that we are utilizing an external renderer such as Mapbox/Maplibre
    const isOverlay = 'interleaved' in props;
    const deckgl = isOverlay ? new MapboxOverlay(props) : new Deck(props);

    state.setDeckgl(deckgl);

    configured = true;
  }

  function render(children: ReactNode) {
    log
      .withMetadata({
        children,
      })
      .debug('renderer.render');

    renderer.updateContainer(children, container, null, noop);
  }

  if (!prevRoot) {
    roots.set(node, { container, store, render, configure });
  }

  // Due to the above condition we are always guaranteed a result
  return roots.get(node) as ReconcilerRoot;
}
