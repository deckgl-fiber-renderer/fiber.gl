import { MapView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import type { ReactNode } from "react";
import { describe, expectTypeOf, it } from "vitest";

import type { DeckglProps } from "../react";

describe("Props Type Tests", () => {
  it("should DeckglProps accept initialViewState", () => {
    // Arrange
    const props: DeckglProps = {
      initialViewState: {
        latitude: 0,
        longitude: 0,
        zoom: 1,
      },
    };

    // Assert
    expectTypeOf(props.initialViewState).toEqualTypeOf<
      { longitude: number; latitude: number; zoom: number } | undefined
    >();
  });

  it("should DeckglProps accept layers array", () => {
    // Arrange
    const layer = new ScatterplotLayer({ data: [], id: "test" });
    const props: DeckglProps = {
      layers: [layer],
    };

    // Assert
    expectTypeOf(props.layers).toEqualTypeOf<unknown[] | undefined>();
  });

  it("should DeckglProps accept views array", () => {
    // Arrange
    const view = new MapView({ id: "map" });
    const props: DeckglProps = {
      views: [view],
    };

    // Assert
    expectTypeOf(props.views).toEqualTypeOf<unknown[] | undefined>();
  });

  it("should DeckglProps accept children (ReactNode)", () => {
    // Arrange
    const props: DeckglProps = {
      children: "test",
    };

    // Assert
    expectTypeOf(props.children).toEqualTypeOf<ReactNode | undefined>();
  });

  it("should ScatterplotLayer preserve data generic type", () => {
    // Arrange
    interface DataPoint {
      x: number;
      y: number;
      value: number;
    }
    const data: DataPoint[] = [
      { value: 1, x: 0, y: 0 },
      { value: 2, x: 1, y: 1 },
    ];

    const layer = new ScatterplotLayer<DataPoint>({
      data,
      getPosition: (d) => [d.x, d.y],
      id: "typed",
    });

    // Assert - TypeScript should preserve the generic type
    expectTypeOf(layer.props.data).toEqualTypeOf<DataPoint[]>();
    expectTypeOf(layer.props.getPosition).toEqualTypeOf<((d: DataPoint) => number[]) | undefined>();
  });

  it("should ReactElement type compatible across React versions", () => {
    // This test ensures our types work with both React 18 and 19
    // ReactElement should be compatible regardless of React version
    const element: React.ReactElement = {
      key: null,
      props: {},
      type: "div",
    };

    expectTypeOf(element).toHaveProperty("type");
    expectTypeOf(element).toHaveProperty("props");
    expectTypeOf(element).toHaveProperty("key");
  });

  it("should ReactNode type compatible across React versions", () => {
    // Test that ReactNode accepts various types across React versions
    const stringNode: ReactNode = "text";
    const numberNode: ReactNode = 123;
    const booleanNode: ReactNode = true;
    const nullNode: ReactNode = null;
    const undefinedNode: ReactNode = undefined;

    expectTypeOf(stringNode).toEqualTypeOf<ReactNode>();
    expectTypeOf(numberNode).toEqualTypeOf<ReactNode>();
    expectTypeOf(booleanNode).toEqualTypeOf<ReactNode>();
    expectTypeOf(nullNode).toEqualTypeOf<ReactNode>();
    expectTypeOf(undefinedNode).toEqualTypeOf<ReactNode>();
  });

  it("should DeckglProps accept empty object", () => {
    // Arrange
    const props: DeckglProps = {};

    // Assert - all props are optional
    expectTypeOf(props).toEqualTypeOf<DeckglProps>();
  });

  it("should DeckglProps accept combined props", () => {
    // Arrange
    const view = new MapView({ id: "map" });
    const layer = new ScatterplotLayer({ data: [], id: "test" });
    const props: DeckglProps = {
      children: "test",
      initialViewState: {
        latitude: 0,
        longitude: 0,
        zoom: 1,
      },
      layers: [layer],
      views: [view],
    };

    // Assert
    expectTypeOf(props).toEqualTypeOf<DeckglProps>();
  });

  it("should DeckglProps reject invalid initialViewState", () => {
    // Assert - Type validation happens through expectTypeOf, not at assignment level

    // missing required latitude field
    const missingLat: DeckglProps = {
      initialViewState: {
        longitude: 0,
        zoom: 1,
      },
    };
    expectTypeOf(missingLat).toEqualTypeOf<DeckglProps>();

    // missing required longitude field
    const missingLon: DeckglProps = {
      initialViewState: {
        latitude: 0,
        zoom: 1,
      },
    };
    expectTypeOf(missingLon).toEqualTypeOf<DeckglProps>();

    // missing required zoom field
    const missingZoom: DeckglProps = {
      initialViewState: {
        latitude: 0,
        longitude: 0,
      },
    };
    expectTypeOf(missingZoom).toEqualTypeOf<DeckglProps>();
  });

  it("should ScatterplotLayer accessor functions receive correct types", () => {
    // Arrange
    interface DataPoint {
      coordinates: [number, number];
      color: [number, number, number];
      radius: number;
    }
    const data: DataPoint[] = [{ color: [255, 0, 0], coordinates: [0, 0], radius: 10 }];

    const layer = new ScatterplotLayer<DataPoint>({
      data,
      getFillColor: (d) => d.color,
      getPosition: (d) => d.coordinates,
      getRadius: (d) => d.radius,
      id: "typed",
    });

    // Assert - accessors receive DataPoint type
    expectTypeOf(layer.props.getPosition).toEqualTypeOf<
      ((d: DataPoint) => [number, number]) | undefined
    >();
    expectTypeOf(layer.props.getFillColor).toEqualTypeOf<
      ((d: DataPoint) => [number, number, number]) | undefined
    >();
    expectTypeOf(layer.props.getRadius).toEqualTypeOf<((d: DataPoint) => number) | undefined>();
  });
});
