import type { Layer } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { createElement } from "react";
import type { ReactElement } from "react";
import { describe, expectTypeOf, it } from "vitest";

describe("JSX Type Tests", () => {
  it("should layer element accept Layer instance", () => {
    // Arrange
    const layer = new ScatterplotLayer({ data: [], id: "test" });

    // Act
    const element = createElement("layer", { layer });

    // Assert
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
    expectTypeOf(element.props.layer).toEqualTypeOf<Layer>();
  });

  it("should invalid element types be rejected (@ts-expect-error)", () => {
    // Assert - TypeScript should reject invalid types

    // @ts-expect-error - number is not a valid layer type
    const numElement = createElement("layer", { layer: 123 });
    expectTypeOf(numElement).toEqualTypeOf<ReactElement>();

    // @ts-expect-error - string is not a valid layer type
    const strElement = createElement("layer", { layer: "not-a-layer" });
    expectTypeOf(strElement).toEqualTypeOf<ReactElement>();

    // @ts-expect-error - missing layer prop
    const emptyElement = createElement("layer", {});
    expectTypeOf(emptyElement).toEqualTypeOf<ReactElement>();
  });

  it("should layer element accept children", () => {
    // Arrange
    const layer = new ScatterplotLayer({ data: [], id: "parent" });
    const childLayer = new ScatterplotLayer({ data: [], id: "child" });

    // Act
    const element = createElement("layer", {
      children: createElement("layer", { layer: childLayer }),
      layer,
    });

    // Assert
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
    expectTypeOf(element.props.children).toEqualTypeOf<ReactElement>();
  });

  it("should layer element accept multiple children", () => {
    // Arrange
    const layer = new ScatterplotLayer({ data: [], id: "parent" });
    const child1 = new ScatterplotLayer({ data: [], id: "child1" });
    const child2 = new ScatterplotLayer({ data: [], id: "child2" });

    // Act
    const element = createElement("layer", {
      children: [
        createElement("layer", { layer: child1 }),
        createElement("layer", { layer: child2 }),
      ],
      layer,
    });

    // Assert
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
    expectTypeOf(element.props.children).toEqualTypeOf<ReactElement[]>();
  });

  it("should layer element reject null/undefined layer (@ts-expect-error)", () => {
    // Assert - TypeScript should reject null/undefined

    // @ts-expect-error - null is not a valid layer type
    const nullElement = createElement("layer", { layer: null });
    expectTypeOf(nullElement).toEqualTypeOf<ReactElement>();

    // @ts-expect-error - undefined is not a valid layer type
    const undefinedElement = createElement("layer", { layer: undefined });
    expectTypeOf(undefinedElement).toEqualTypeOf<ReactElement>();
  });
});
