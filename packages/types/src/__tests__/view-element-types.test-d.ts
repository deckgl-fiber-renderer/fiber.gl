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

    // @ts-expect-error - Layer is not assignable to View
    createElement("view", { view: layer });
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

    // @ts-expect-error - View is not assignable to Layer
    createElement("layer", { layer: view });
  });

  it("should view element reject missing view prop (@ts-expect-error)", () => {
    // @ts-expect-error - missing view prop
    createElement("view", {});
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
});
