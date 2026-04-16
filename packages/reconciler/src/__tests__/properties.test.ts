import { MapView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { createMockInstance } from "../__fixtures__/mock-deck-instance";
import { appendChildToSet, cloneInstance } from "../config";
import type { ChildSet, Instance } from "../types";
import { flattenTree, organizeList } from "../utils";

// Arbitraries for generating test data
const layerArbitrary = (): fc.Arbitrary<ScatterplotLayer> =>
  fc
    .record({
      data: fc.constant([]),
      id: fc.string({ maxLength: 20, minLength: 1 }),
    })
    .map((props) => new ScatterplotLayer(props));

const instanceArbitrary = (depth = 0): fc.Arbitrary<Instance> => {
  if (depth > 3) {
    // Limit depth to prevent stack overflow
    return layerArbitrary().map((layer) => createMockInstance(layer, []));
  }
  return fc
    .tuple(layerArbitrary(), fc.array(fc.constant(null), { maxLength: 3 }))
    .chain(([layer, childrenPlaceholders]) =>
      fc.tuple(
        fc.constant(layer),
        fc.array(instanceArbitrary(depth + 1), {
          maxLength: childrenPlaceholders.length,
        }),
      ),
    )
    .map(([layer, children]) => createMockInstance(layer, children));
};

describe("Property-Based Tests", () => {
  describe("flattenTree properties", () => {
    it("property: output length equals total node count", () => {
      fc.assert(
        fc.property(fc.array(instanceArbitrary(), { maxLength: 10, minLength: 0 }), (instances) => {
          const flattened = flattenTree(instances);
          const totalNodes = countNodes(instances);
          expect(flattened).toHaveLength(totalNodes);
        }),
      );
    });

    it("property: all output nodes exist in input tree", () => {
      fc.assert(
        fc.property(fc.array(instanceArbitrary(), { maxLength: 10, minLength: 0 }), (instances) => {
          const flattened = flattenTree(instances);
          const allInputNodes = collectAllNodes(instances);

          for (const node of flattened) {
            expect(allInputNodes).toContain(node);
          }
        }),
      );
    });

    it("property: flattening empty array returns empty array", () => {
      const flattened = flattenTree([]);
      expect(flattened).toStrictEqual([]);
    });

    it("property: flattening is idempotent on structure (can re-wrap and flatten again)", () => {
      fc.assert(
        fc.property(fc.array(instanceArbitrary(), { maxLength: 10, minLength: 0 }), (instances) => {
          const flattened1 = flattenTree(instances);
          // Re-wrap and flatten again
          const rewrapped = flattened1.map((node) => createMockInstance(node, []));
          const flattened2 = flattenTree(rewrapped);

          expect(flattened2).toHaveLength(flattened1.length);
        }),
      );
    });
  });

  describe("organizeList properties", () => {
    it("property: output length equals input length (no nodes lost)", () => {
      fc.assert(
        fc.property(fc.array(layerArbitrary(), { maxLength: 20, minLength: 0 }), (layers) => {
          const organized = organizeList(layers);
          const outputLength = organized.views.length + organized.layers.length;
          expect(outputLength).toBe(layers.length);
        }),
      );
    });

    it("property: all layers go to layers array (no Views in our test data)", () => {
      fc.assert(
        fc.property(fc.array(layerArbitrary(), { maxLength: 20, minLength: 0 }), (layers) => {
          const organized = organizeList(layers);
          expect(organized.layers).toHaveLength(layers.length);
          expect(organized.views).toHaveLength(0);
        }),
      );
    });

    it("property: organizing empty array returns empty arrays", () => {
      const organized = organizeList([]);
      expect(organized.views).toStrictEqual([]);
      expect(organized.layers).toStrictEqual([]);
    });
  });

  describe("appendChildToSet properties", () => {
    it("property: never mutates original array", () => {
      fc.assert(
        fc.property(
          fc.array(instanceArbitrary(), { maxLength: 10 }),
          instanceArbitrary(),
          (childSet, child) => {
            const originalLength = childSet.length;
            const originalFirstId = childSet.length > 0 ? childSet[0].node.id : null;

            const newChildSet = appendChildToSet(childSet, child);

            // Original unchanged
            expect(childSet).toHaveLength(originalLength);
            if (originalFirstId !== null) {
              expect(childSet[0].node.id).toBe(originalFirstId);
            }

            // Result is different reference
            expect(newChildSet).not.toBe(childSet);
          },
        ),
      );
    });

    it("property: output length is input length + 1", () => {
      fc.assert(
        fc.property(
          fc.array(instanceArbitrary(), { maxLength: 10 }),
          instanceArbitrary(),
          (childSet, child) => {
            const newChildSet = appendChildToSet(childSet, child);
            expect(newChildSet).toHaveLength(childSet.length + 1);
          },
        ),
      );
    });

    it("property: appended child is at the end", () => {
      fc.assert(
        fc.property(
          fc.array(instanceArbitrary(), { maxLength: 10 }),
          instanceArbitrary(),
          (childSet, child) => {
            const newChildSet = appendChildToSet(childSet, child);
            expect(newChildSet.at(-1)).toBe(child);
          },
        ),
      );
    });

    it("property: appending to empty set returns single-element array", () => {
      fc.assert(
        fc.property(instanceArbitrary(), (child) => {
          const childSet: ChildSet = [];
          const newChildSet = appendChildToSet(childSet, child);
          expect(newChildSet).toHaveLength(1);
          expect(newChildSet[0]).toBe(child);
        }),
      );
    });
  });

  describe("cloneInstance properties", () => {
    it("property: cloned instance is never the same reference as original", () => {
      fc.assert(
        fc.property(instanceArbitrary(), (instance) => {
          const layer = instance.node;
          const cloned = cloneInstance(instance, "layer", {}, { layer }, true, null);

          expect(cloned).not.toBe(instance);
        }),
      );
    });

    it("property: when keepChildren is true, children reference is preserved", () => {
      fc.assert(
        fc.property(instanceArbitrary(), (instance) => {
          const layer = instance.node;
          const cloned = cloneInstance(
            instance,
            "layer",
            {},
            { layer },
            true, // keepChildren
            null,
          );

          expect(cloned.children).toBe(instance.children);
        }),
      );
    });

    it("property: when keepChildren is false with recyclableInstance, uses recyclableInstance.children", () => {
      fc.assert(
        fc.property(
          instanceArbitrary(),
          fc.array(instanceArbitrary(), { maxLength: 5 }),
          (instance, newChildren) => {
            const layer = instance.node;
            const recyclableInstance: Instance = {
              children: newChildren,
              node: new MapView({ id: "recycled" }),
            };
            const cloned = cloneInstance(
              instance,
              "layer",
              {},
              { layer },
              false, // keepChildren
              recyclableInstance,
            );

            expect(cloned.children).toBe(recyclableInstance.children);
            expect(cloned.children).not.toBe(instance.children);
          },
        ),
      );
    });

    it("property: when keepChildren is false with null newChildSet, children is empty", () => {
      fc.assert(
        fc.property(instanceArbitrary(), (instance) => {
          const layer = instance.node;
          const cloned = cloneInstance(
            instance,
            "layer",
            {},
            { layer },
            false, // keepChildren
            null, // newChildSet
          );

          expect(cloned.children).toStrictEqual([]);
        }),
      );
    });
  });
});

// Helper functions
function countNodes(instances: Instance[]): number {
  let count = 0;
  for (const instance of instances) {
    count += 1;
    count += countNodes(instance.children);
  }
  return count;
}

function collectAllNodes(instances: Instance[]): Instance["node"][] {
  const nodes: Instance["node"][] = [];
  for (const instance of instances) {
    nodes.push(instance.node);
    nodes.push(...collectAllNodes(instance.children));
  }
  return nodes;
}
