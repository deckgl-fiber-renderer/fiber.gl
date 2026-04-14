// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { globalScope } from "../constants";

describe("Constants Tests", () => {
  describe(globalScope, () => {
    it("should be defined in jsdom environment", () => {
      expect(globalScope).toBeTypeOf("object");
      expect(globalScope).not.toBeNull();
    });

    it("should reference self in jsdom (prioritizes self over window)", () => {
      const hasSelf = typeof self !== "undefined";
      const hasWindow = typeof window !== "undefined";

      // jsdom provides both self and window - implementation prioritizes self
      expect(hasSelf).toBeTruthy();
      expect(hasWindow).toBeTruthy();
      expect(globalScope).toBe(self);
      expect(globalScope).toBeTypeOf("object");
    });
  });
});
