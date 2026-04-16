import { ScatterplotLayer } from "@deck.gl/layers";
import { createElement, Fragment } from "react";
import type { vi } from "vitest";
import { describe, expect, it } from "vitest";

import { createTestLayer, fixtures } from "../__fixtures__/layers";
import { createMockDeckInstance } from "../__fixtures__/mock-deck-instance";
import { extend } from "../extend";
import { createRoot } from "../renderer";

// Register layers for testing
extend({
  ScatterplotLayer,
});

describe("Layer Tree Snapshot Tests", () => {
  it("renders complex layer hierarchy with snapshot", async () => {
    // Arrange
    const mockDeck = createMockDeckInstance();
    const rootElement = document.createElement("div");
    const root = createRoot(rootElement);

    root.configure({
      canvas: rootElement as unknown as HTMLCanvasElement,
    });
    root.store.setState({ deckgl: mockDeck as never });

    const scatterplot1 = fixtures.scatterplotLayer({
      id: "scatterplot-1",
      radiusScale: 1,
    });
    const scatterplot2 = fixtures.scatterplotLayer({
      id: "scatterplot-2",
      radiusScale: 2,
    });
    const path = fixtures.pathLayer({ id: "path-1" });

    // Act
    root.render(
      createElement(
        Fragment,
        {},
        createElement("layer", { layer: scatterplot1 }),
        createElement(
          Fragment,
          {},
          createElement("layer", { layer: scatterplot2 }),
          createElement("layer", { layer: path }),
        ),
      ),
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assert - snapshot the layer structure with property matchers
    const lastCall = (mockDeck.setProps as ReturnType<typeof import("vitest").vi.fn>).mock.calls.at(
      -1,
    );
    const layers = lastCall?.[0]?.layers || [];

    expect(layers).toMatchSnapshot({
      0: expect.objectContaining({ id: "scatterplot-1" }),
      1: expect.objectContaining({ id: "scatterplot-2" }),
      2: expect.objectContaining({ id: "path-1" }),
    });
  });

  it("snapshots with property matchers for dynamic values", async () => {
    // Arrange
    const mockDeck = createMockDeckInstance();
    const rootElement = document.createElement("div");
    const root = createRoot(rootElement);

    root.configure({
      canvas: rootElement as unknown as HTMLCanvasElement,
    });
    root.store.setState({ deckgl: mockDeck as never });

    const layer1 = createTestLayer("scatterplot", {
      data: [{ x: 1, y: 2 }],
      id: "dynamic-1",
    });
    const layer2 = createTestLayer("path", {
      data: [{ path: [[0, 0]] }],
      id: "dynamic-2",
    });

    // Act
    root.render(
      createElement(
        Fragment,
        {},
        createElement("layer", { layer: layer1 }),
        createElement("layer", { layer: layer2 }),
      ),
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assert - snapshot with property matchers for IDs
    const lastCall = (mockDeck.setProps as ReturnType<typeof vi.fn>).mock.calls.at(-1);
    const layers = lastCall?.[0]?.layers || [];

    expect(layers).toMatchSnapshot({
      0: expect.objectContaining({ id: "dynamic-1" }),
      1: expect.objectContaining({ id: "dynamic-2" }),
    });
  });
});
