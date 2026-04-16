import { MapView } from "@deck.gl/core";
import { PathLayer, ScatterplotLayer } from "@deck.gl/layers";

/**
 * Helper to create a test layer with default props
 * Use this when you need a generic Layer for testing reconciler behavior
 */
export function createTestLayer(
  type: "scatterplot" | "path",
  overrides: Record<string, unknown> = {},
) {
  const baseProps = {
    data: [],
    id: "test-layer",
    ...overrides,
  };

  if (type === "scatterplot") {
    return new ScatterplotLayer(baseProps);
  }

  if (type === "path") {
    return new PathLayer(baseProps);
  }

  throw new Error(`Unknown layer type: ${type}`);
}

/**
 * Fixture factories for common layer types
 * Use these for consistency across test files
 */
export const fixtures = {
  /**
   * Creates a ScatterplotLayer with sensible test defaults
   */
  scatterplotLayer: (overrides: Record<string, unknown> = {}) =>
    new ScatterplotLayer({
      data: [
        { position: [0, 0], radius: 10 },
        { position: [1, 1], radius: 20 },
      ],
      getPosition: (d: { position: number[] }) => d.position as [number, number],
      getRadius: (d: { radius: number }) => d.radius,
      id: "scatterplot-test",
      ...overrides,
    }),

  /**
   * Creates a PathLayer with sensible test defaults
   */
  pathLayer: (overrides: Record<string, unknown> = {}) =>
    new PathLayer({
      data: [
        {
          path: [
            [0, 0],
            [1, 1],
          ],
        },
      ],
      getPath: (d: { path: [number, number][] }) => d.path,
      id: "path-test",
      ...overrides,
    }),

  /**
   * Creates a MapView with sensible test defaults
   */
  mapView: (overrides: Record<string, unknown> = {}) =>
    new MapView({
      controller: true,
      id: "map-view-test",
      ...overrides,
    }),
};
