import {
  ContinuousEventPriority,
  DefaultEventPriority,
  DiscreteEventPriority,
} from "react-reconciler/constants";
import { describe, expect, it } from "vitest";

import { fixtures } from "../__fixtures__/layers";
import {
  createMockContainer,
  createMockHostContext,
  createMockInstance,
} from "../__fixtures__/mock-deck-instance";
import * as config from "../config";

describe("React Compatibility Tests", () => {
  describe("Mode configuration", () => {
    it("uses persistence mode (supportsPersistence is true)", () => {
      // Assert
      expect(config.supportsPersistence).toBeTruthy();
    });

    it("disables mutation mode (supportsMutation is false)", () => {
      // Assert
      expect(config.supportsMutation).toBeFalsy();
    });
  });

  describe("Event priority", () => {
    it("returns valid event priority (DiscreteEventPriority, ContinuousEventPriority, or DefaultEventPriority)", () => {
      // Arrange
      const validPriorities = [
        DiscreteEventPriority,
        ContinuousEventPriority,
        DefaultEventPriority,
      ];

      // Act
      const priority = config.getCurrentEventPriority();

      // Assert
      expect(validPriorities).toContain(priority);
    });
  });

  describe("Method signatures", () => {
    it("creates instance with correct parameters", () => {
      // Arrange
      const type = "layer";
      const props = { layer: fixtures.scatterplotLayer() };
      const container = createMockContainer();
      const hostContext = createMockHostContext();

      // Act
      const instance = config.createInstance(type, props, container.store, hostContext);

      // Assert
      expect(instance).toBeDefined();
      expect(instance.node).toBeDefined();
      expect(instance.children).toBeDefined();
    });

    it("clones instance with correct parameters", () => {
      // Arrange
      const layer = fixtures.scatterplotLayer({ id: "test" });
      const instance = createMockInstance(layer);
      const type = "layer";
      const oldProps = { layer };
      const newProps = { layer: fixtures.scatterplotLayer({ id: "test" }) };
      const keepChildren = false;
      const newChildSet = null;

      // Act
      const cloned = config.cloneInstance(
        instance,
        type,
        oldProps,
        newProps,
        keepChildren,
        newChildSet,
      );

      // Assert
      expect(cloned).toBeDefined();
      expect(cloned.node).toBeDefined();
      expect(cloned).not.toBe(instance);
    });
  });
});
