import { MapView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { describe, expect, it } from "vitest";

import type { Instance } from "../types";
import { flattenTree, isView, organizeList } from "../utils";

describe("utils", () => {
  describe(isView, () => {
    it("should return true for View instances", () => {
      const view = new MapView();
      expect(isView(view)).toBeTruthy();
    });

    it("should return false for Layer instances", () => {
      const layer = new ScatterplotLayer({ data: [], id: "test" });
      expect(isView(layer)).toBeFalsy();
    });
  });

  describe(flattenTree, () => {
    it("should flatten single-level tree", () => {
      const layer1 = new ScatterplotLayer({ data: [], id: "layer1" });
      const layer2 = new ScatterplotLayer({ data: [], id: "layer2" });
      const instances: Instance[] = [
        { children: [], node: layer1 },
        { children: [], node: layer2 },
      ];

      const result = flattenTree(instances);

      expect(result).toStrictEqual([layer1, layer2]);
    });

    it("should flatten deeply nested tree", () => {
      const layer1 = new ScatterplotLayer({ data: [], id: "layer1" });
      const layer2 = new ScatterplotLayer({ data: [], id: "layer2" });
      const layer3 = new ScatterplotLayer({ data: [], id: "layer3" });

      const instances: Instance[] = [
        {
          children: [
            {
              children: [{ children: [], node: layer3 }],
              node: layer2,
            },
          ],
          node: layer1,
        },
      ];

      const result = flattenTree(instances);

      expect(result).toStrictEqual([layer1, layer2, layer3]);
    });

    it("should handle empty array", () => {
      const result = flattenTree([]);
      expect(result).toStrictEqual([]);
    });

    it("should preserve depth-first traversal order", () => {
      const layer1 = new ScatterplotLayer({ data: [], id: "layer1" });
      const layer2 = new ScatterplotLayer({ data: [], id: "layer2" });
      const layer3 = new ScatterplotLayer({ data: [], id: "layer3" });
      const layer4 = new ScatterplotLayer({ data: [], id: "layer4" });

      const instances: Instance[] = [
        {
          children: [{ children: [], node: layer2 }],
          node: layer1,
        },
        {
          children: [{ children: [], node: layer4 }],
          node: layer3,
        },
      ];

      const result = flattenTree(instances);

      expect(result).toStrictEqual([layer1, layer2, layer3, layer4]);
    });
  });

  describe(organizeList, () => {
    it("should separate views and layers correctly", () => {
      const view = new MapView();
      const layer1 = new ScatterplotLayer({ data: [], id: "layer1" });
      const layer2 = new ScatterplotLayer({ data: [], id: "layer2" });

      const result = organizeList([view, layer1, layer2]);

      expect(result.views).toStrictEqual([view]);
      expect(result.layers).toStrictEqual([layer1, layer2]);
    });

    it("should handle empty list", () => {
      const result = organizeList([]);

      expect(result.views).toStrictEqual([]);
      expect(result.layers).toStrictEqual([]);
    });

    it("should handle list with only views", () => {
      const view1 = new MapView();
      const view2 = new MapView();

      const result = organizeList([view1, view2]);

      expect(result.views).toStrictEqual([view1, view2]);
      expect(result.layers).toStrictEqual([]);
    });

    it("should handle list with only layers", () => {
      const layer1 = new ScatterplotLayer({ data: [], id: "layer1" });
      const layer2 = new ScatterplotLayer({ data: [], id: "layer2" });

      const result = organizeList([layer1, layer2]);

      expect(result.views).toStrictEqual([]);
      expect(result.layers).toStrictEqual([layer1, layer2]);
    });
  });
});
