import { ScatterplotLayer } from "@deck.gl/layers";
import { createElement } from "react";
import type { vi } from "vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { fixtures } from "../__fixtures__/layers";
import { createMockDeckInstance } from "../__fixtures__/mock-deck-instance";
import { extend } from "../extend";
import { createRoot, unmountAtNode } from "../renderer";

// Register layers for testing
extend({
  ScatterplotLayer,
});

describe("Reconciler Integration Tests", () => {
  let mockDeck: ReturnType<typeof createMockDeckInstance>;
  let rootElement: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    // Arrange: Create mock Deck.gl instance and root element
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

  it("should render single ScatterplotLayer via React", () => {
    // Arrange
    const layer = fixtures.scatterplotLayer({ id: "test-scatterplot" });

    // Act
    root.render(createElement("layer", { layer }));

    // Assert
    const state = root.store.getState();
    expect(state._passedLayers).toHaveLength(0); // No directly passed layers
    expect(mockDeck.setProps).toHaveBeenCalled();
  });

  it("should render multiple layers in hierarchy", () => {
    // Arrange
    const scatterplot = fixtures.scatterplotLayer({ id: "scatterplot-1" });
    const path = fixtures.pathLayer({ id: "path-1" });

    // Act
    root.render(
      createElement(
        "group",
        {},
        createElement("layer", { layer: scatterplot }),
        createElement("layer", { layer: path })
      )
    );

    // Assert
    expect(mockDeck.setProps).toHaveBeenCalled();
  });

  it("should update layer props triggers new instance", () => {
    // Arrange
    const initialLayer = fixtures.scatterplotLayer({
      id: "test",
      radiusScale: 1,
    });
    root.render(createElement("layer", { layer: initialLayer }));
    const callCountBefore = (mockDeck.setProps as ReturnType<typeof vi.fn>).mock
      .calls.length;

    // Act
    const updatedLayer = fixtures.scatterplotLayer({
      id: "test",
      radiusScale: 2,
    });
    root.render(createElement("layer", { layer: updatedLayer }));

    // Assert
    const callCountAfter = (mockDeck.setProps as ReturnType<typeof vi.fn>).mock
      .calls.length;
    expect(callCountAfter).toBeGreaterThan(callCountBefore);
  });

  it("should update preserves layer ID", () => {
    // Arrange
    const layerId = "persistent-id";
    const initialLayer = fixtures.scatterplotLayer({
      id: layerId,
      radiusScale: 1,
    });
    root.render(createElement("layer", { layer: initialLayer }));

    // Act
    const updatedLayer = fixtures.scatterplotLayer({
      id: layerId,
      radiusScale: 2,
    });
    root.render(createElement("layer", { layer: updatedLayer }));

    // Assert
    const lastCall = (
      mockDeck.setProps as ReturnType<typeof vi.fn>
    ).mock.calls.at(-1);
    const layers = lastCall?.[0]?.layers || [];
    expect(layers[0]?.id).toBe(layerId);
  });

  it("should unmount removes all layers", () => {
    // Arrange
    const layer = fixtures.scatterplotLayer({ id: "to-remove" });
    root.render(createElement("layer", { layer }));

    // Act
    unmountAtNode(rootElement);

    // Assert
    expect(mockDeck.finalize).toHaveBeenCalled();
  });

  it("should unmount with nested layers", () => {
    // Arrange
    const layer1 = fixtures.scatterplotLayer({ id: "nested-1" });
    const layer2 = fixtures.pathLayer({ id: "nested-2" });
    root.render(
      createElement(
        "group",
        {},
        createElement("layer", { layer: layer1 }),
        createElement("layer", { layer: layer2 })
      )
    );

    // Act
    unmountAtNode(rootElement);

    // Assert
    expect(mockDeck.finalize).toHaveBeenCalled();
  });
});
