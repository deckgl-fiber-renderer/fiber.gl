import { beforeAll, describe, expect, it } from "vitest";

import { createRoot } from "../renderer";
import type { RootElement } from "../types";

// Mock reportError for tests
beforeAll(() => {
  globalThis.reportError = (error: any) => {
    console.error(error);
  };
});

describe("renderer", () => {
  describe("createRoot", () => {
    it("calling createRoot twice on same node returns same root", () => {
      const node = {} as RootElement;

      const root1 = createRoot(node);
      const root2 = createRoot(node);

      expect(root2).toBe(root1);
    });

    it("root reuse preserves store and container", () => {
      const node = {} as RootElement;

      const root1 = createRoot(node);
      const root2 = createRoot(node);

      expect(root2.store).toBe(root1.store);
      expect(root2.container).toBe(root1.container);
    });

    it("different nodes get different roots", () => {
      const node1 = {} as RootElement;
      const node2 = {} as RootElement;

      const root1 = createRoot(node1);
      const root2 = createRoot(node2);

      expect(root2).not.toBe(root1);
      expect(root2.container).not.toBe(root1.container);
    });
  });
});
