import { MapView, OrbitView } from "@deck.gl/core";
import type { View } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { createElement } from "react";
import type { ReactElement } from "react";
import { describe, expectTypeOf, it } from "vitest";

describe("View Element Type Tests", () => {
  it("should view element accept MapView instance", () => {
    // Arrange
    const view = new MapView({ id: "main" });

    // Act
    const element = createElement("view", { view });

    // Assert
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
    expectTypeOf(element.props.view).toEqualTypeOf<View>();
  });

  it("should view element accept OrbitView instance", () => {
    // Arrange
    const view = new OrbitView({ id: "orbit" });

    // Act
    const element = createElement("view", { view });

    // Assert
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
    expectTypeOf(element.props.view).toEqualTypeOf<View>();
  });

  it("should view element reject Layer instance (@ts-expect-error)", () => {
    // Arrange
    const layer = new ScatterplotLayer({ data: [], id: "points" });

    // Assert - TypeScript should reject Layer as View
    // @ts-expect-error - Layer is not assignable to View
    const element = createElement("view", { view: layer });
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
  });

  it("should layer element accept Layer instance", () => {
    // Arrange
    const layer = new ScatterplotLayer({ data: [], id: "points" });

    // Act
    const element = createElement("layer", { layer });

    // Assert
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
  });

  it("should layer element reject View instance (@ts-expect-error)", () => {
    // Arrange
    const view = new MapView({ id: "main" });

    // Assert - TypeScript should reject View as Layer
    // @ts-expect-error - View is not assignable to Layer
    const element = createElement("layer", { layer: view });
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
  });

  it("should view element reject missing view prop (@ts-expect-error)", () => {
    // Assert - TypeScript should reject missing required view prop
    // @ts-expect-error - missing view prop
    const element = createElement("view", {});
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
  });

  it("should view element accept children", () => {
    // Arrange
    const view = new MapView({ id: "main" });

    // Act
    const element = createElement("view", {
      children: createElement("layer", {
        layer: new ScatterplotLayer({ data: [], id: "child" }),
      }),
      view,
    });

    // Assert
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
  });

  it("should view element accept multiple children", () => {
    // Arrange
    const view = new MapView({ id: "main" });
    const layer1 = new ScatterplotLayer({ data: [], id: "child1" });
    const layer2 = new ScatterplotLayer({ data: [], id: "child2" });

    // Act
    const element = createElement("view", {
      children: [
        createElement("layer", { layer: layer1 }),
        createElement("layer", { layer: layer2 }),
      ],
      view,
    });

    // Assert
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
  });

  it("should view element reject null/undefined view (@ts-expect-error)", () => {
    // Assert - TypeScript should reject null/undefined

    // @ts-expect-error - null is not a valid view type
    const nullElement = createElement("view", { view: null });
    expectTypeOf(nullElement).toEqualTypeOf<ReactElement>();

    // @ts-expect-error - undefined is not a valid view type
    const undefinedElement = createElement("view", { view: undefined });
    expectTypeOf(undefinedElement).toEqualTypeOf<ReactElement>();
  });

  it("should view element reject plain object (@ts-expect-error)", () => {
    // Assert - TypeScript should reject plain objects

    // @ts-expect-error - plain object is not a View instance
    const element = createElement("view", { view: { id: "not-a-view" } });
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
  });

  it("should layer element reject plain object (@ts-expect-error)", () => {
    // Assert - TypeScript should reject plain objects

    // @ts-expect-error - plain object is not a Layer instance
    const element = createElement("layer", { layer: { id: "not-a-layer" } });
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
  });
});
