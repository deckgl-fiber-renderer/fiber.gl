import type { Layer, View } from "@deck.gl/core";
import type { createStore } from "@deckgl-fiber-renderer/shared";
import { vi } from "vitest";

import type { Container, HostContext, Instance } from "../types";

/**
 * Creates a mock Deck.gl instance for testing
 * Use this instead of real Deck.gl to avoid WebGL context requirements
 */
export function createMockDeckInstance() {
  const layers: Layer[] = [];

  return {
    finalize: vi.fn(),
    layers,
    setProps: vi.fn((props: { layers?: Layer[] }) => {
      if (props.layers) {
        layers.splice(0, layers.length, ...props.layers);
      }
    }),
  };
}

/**
 * Creates a mock container for testing reconciler
 */
export function createMockContainer(): Container {
  const store = {
    destroy: vi.fn(),
    getState: vi.fn(() => ({
      _passedLayers: [],
      deckgl: undefined,
    })),
    setState: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  } as unknown as ReturnType<typeof createStore>;

  return {
    store,
  };
}

/**
 * Creates a mock host context for testing
 */
export function createMockHostContext(overrides: Partial<HostContext> = {}): HostContext {
  return {
    insideView: false,
    store: createMockContainer().store,
    ...overrides,
  };
}

/**
 * Creates a mock Instance for testing
 */
export function createMockInstance(node: Layer | View, children: Instance[] = []): Instance {
  return {
    children,
    node,
  };
}
