import { ScatterplotLayer } from "@deck.gl/layers";
import { createElement, Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createMockDeckInstance } from "../__fixtures__/mock-deck-instance";
import { createRoot, unmountAtNode } from "../renderer";

// Simulate an async component that suspends
let resolvePromise: (() => void) | null = null;
let promise: Promise<void> | null = null;

// Component defined at module scope to avoid remounting on re-render
function AsyncDataComponent() {
  if (!promise) {
    promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    throw promise;
  }
  return createElement("layer", {
    layer: new ScatterplotLayer({ data: [], id: "async-layer" }),
  });
}

describe("Suspense boundary integration", () => {
  let mockDeck: ReturnType<typeof createMockDeckInstance>;
  let rootElement: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    // Reset promise state
    promise = null;
    resolvePromise = null;

    // Create mock Deck.gl instance and root element
    mockDeck = createMockDeckInstance();
    rootElement = document.createElement("div");
    root = createRoot(rootElement);

    // Configure the root with mock deck instance
    root.configure({
      canvas: rootElement as unknown as HTMLCanvasElement,
    });

    // Mock the deck instance on the store
    const { store } = root;
    store.setState({ deckgl: mockDeck as never });
  });

  afterEach(() => {
    // Cleanup after each test
    if (rootElement) {
      unmountAtNode(rootElement);
    }
  });

  it("should handle Suspense boundaries without error", () => {
    // This should not throw when a Suspense boundary wraps async components
    expect(() => {
      root.render(
        createElement(
          Suspense,
          {
            fallback: createElement("layer", {
              layer: new ScatterplotLayer({ data: [], id: "fallback" }),
            }),
          },
          createElement(AsyncDataComponent),
        ),
      );
    }).not.toThrow();
  });

  it("should handle nested Suspense with non-suspending layers", () => {
    // Even if nothing suspends, Suspense boundary should work
    expect(() => {
      root.render(
        createElement(
          Suspense,
          { fallback: null },
          createElement("layer", {
            layer: new ScatterplotLayer({ data: [], id: "layer-1" }),
          }),
          createElement("layer", {
            layer: new ScatterplotLayer({ data: [], id: "layer-2" }),
          }),
        ),
      );
    }).not.toThrow();
  });
});
