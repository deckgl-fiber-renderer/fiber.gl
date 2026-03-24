import { ScatterplotLayer } from "@deck.gl/layers";
import { describe, expect, it } from "vitest";

import {
  cloneHiddenInstance,
  cloneHiddenTextInstance,
  unhideInstance,
  unhideTextInstance,
} from "../config";
import type { Instance } from "../types";

describe("suspense", () => {
  describe("cloneHiddenInstance", () => {
    it("returns instance with same structure", () => {
      const layer = new ScatterplotLayer({
        data: [],
        id: "test-layer",
      });
      const child: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: "child" }),
      };
      const instance: Instance = {
        children: [child],
        node: layer,
      };

      const hidden = cloneHiddenInstance(instance, "layer", { layer });

      // Should preserve node and children references
      expect(hidden.node).toBe(layer);
      expect(hidden.children).toBe(instance.children);
      expect(hidden.children.length).toBe(1);
      expect(hidden.children[0]).toBe(child);
    });
  });

  describe("unhideInstance", () => {
    it("doesn't throw", () => {
      const layer = new ScatterplotLayer({
        data: [],
        id: "test-layer",
      });
      const instance: Instance = {
        children: [],
        node: layer,
      };

      expect(() => {
        unhideInstance(instance, { layer });
      }).not.toThrow();
    });
  });

  describe("text instance methods", () => {
    it("cloneHiddenTextInstance throws with helpful error", () => {
      const instance: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: "test" }),
      };

      expect(() => {
        cloneHiddenTextInstance(instance);
      }).toThrow("Text nodes are not supported in deck.gl renderer");
    });

    it("unhideTextInstance throws with helpful error", () => {
      const instance: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: "test" }),
      };

      expect(() => {
        unhideTextInstance(instance, "text");
      }).toThrow("Text nodes are not supported in deck.gl renderer");
    });
  });
});
