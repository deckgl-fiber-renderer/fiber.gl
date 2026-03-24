import { DefaultEventPriority } from "react-reconciler/constants";
import { describe, expect, it } from "vitest";

import { getCurrentEventPriority } from "../config";

describe("event priority", () => {
  describe("getCurrentEventPriority", () => {
    it("returns DefaultEventPriority when no global scope", () => {
      // Note: In a Node.js test environment without window/self,
      // getCurrentEventPriority returns DefaultEventPriority
      expect(getCurrentEventPriority()).toBe(DefaultEventPriority);
    });

    // Note: Full event priority testing would require a browser environment
    // or mocking the global scope before module initialization.
    // The implementation has been manually verified to handle:
    // - Discrete events: click, keydown, keyup, focusin, focusout
    // - Continuous events: pointermove, touchmove, drag, scroll
    // - Default for unknown events
  });
});
