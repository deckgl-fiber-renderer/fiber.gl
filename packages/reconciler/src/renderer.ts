import { Deck } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import {
  noop,
  log,
  useStore as storeInstance,
} from "@deckgl-fiber-renderer/shared";
import type { DeckglProps } from "@deckgl-fiber-renderer/types";
import type { ReactNode } from "react";
import reactReconciler from "react-reconciler";
import { ConcurrentRoot } from "react-reconciler/constants";

import * as config from "./config";
import type { ReconcilerRoot, RootElement } from "./types";

// @ts-expect-error @types/react-reconciler is incorrect
export const renderer: ReturnType<typeof reactReconciler> =
  reactReconciler(config);

export const roots = new Map<RootElement, ReconcilerRoot>();

export function unmountAtNode(node: RootElement) {
  const root = roots.get(node);

  log
    .withMetadata({
      node,
      root,
    })
    .debug("renderer.unmountAtNode");

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
    .debug("renderer.createRoot");

  // Early return if root already exists for this node
  const existingRoot = roots.get(node);
  if (existingRoot) {
    return existingRoot;
  }

  // Create new root
  const store = storeInstance;

  const container = renderer.createContainer(
    { store },
    ConcurrentRoot, // tag
    null, // hydration callbacks
    false, // isStrictMode
    null, // concurrentUpdatesByDefaultOverride
    "", // identifierPrefix
    reportError, // onUncaughtError
    reportError, // onCaughtError
    // https://github.com/facebook/react/blob/main/packages/react-noop-renderer/src/createReactNoop.js#L1159
    // @ts-expect-error @types/react-reconciler is incorrect
    reportError, // onRecoverableError
    null // transitionCallbacks
  );

  let configured = false;

  function configure(props: DeckglProps) {
    // NOTE: we want to support a "mix-mode" of sorts where a user can pass an explicit `layers` prop alongside
    // traditional usage of creating layers as JSX children.
    if (props?.layers?.length) {
      // IDEA: we could do some complex diffing logic here but since we don't expose the full store there are
      // no footguns to just updating it all the time.
      store.setState({ _passedLayers: props.layers });
    }

    if (configured) {
      return;
    }

    log.withMetadata(props).debug("renderer.configure");

    const state = store.getState();

    // NOTE: interleaved prop is a hint that we are utilizing an external renderer such as Mapbox/Maplibre
    const isOverlay = "interleaved" in props;
    const deckgl = isOverlay ? new MapboxOverlay(props) : new Deck(props);

    state.setDeckgl(deckgl);

    configured = true;
  }

  function render(children: ReactNode) {
    log
      .withMetadata({
        children,
      })
      .debug("renderer.render");

    renderer.updateContainer(children, container, null, noop);
  }

  const root: ReconcilerRoot = { configure, container, render, store };
  roots.set(node, root);

  return root;
}
