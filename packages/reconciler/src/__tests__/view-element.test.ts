import { MapView, OrbitView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createMockContainer, createMockHostContext } from "../__fixtures__/mock-deck-instance";
import { createInstance } from "../config";
import type { Props } from "../types";

// Mock container and fiber for testing
const mockContainer = createMockContainer();
const mockHostContext = createMockHostContext();
const mockFiber = null;

// Helper to run code in a specific NODE_ENV
function withNodeEnv<T>(env: string, fn: () => T): T {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = env;
  try {
    return fn();
  } finally {
    process.env.NODE_ENV = originalEnv;
  }
}

describe("view element", () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("new <view> element", () => {
    it("creates instance from passed view", () => {
      const view = new MapView({
        id: "test-view",
      });

      const props: Props = { view };
      const instance = createInstance("view", props, mockContainer, mockHostContext, mockFiber);

      expect(instance.node).toBe(view);
      expect(instance.children).toStrictEqual([]);
    });

    it("throws error when view prop is missing", () => {
      const props: Props = {};

      expect(() =>
        createInstance("view", props, mockContainer, mockHostContext, mockFiber),
      ).toThrow("<view> element requires a 'view' prop");
    });

    it("works with MapView instances", () => {
      const view = new MapView({
        id: "map-view",
      });

      const props: Props = { view };
      const instance = createInstance("view", props, mockContainer, mockHostContext, mockFiber);

      expect(instance.node).toBeInstanceOf(MapView);
      expect(instance.node).toBe(view);
    });

    it("works with OrbitView instances", () => {
      const view = new OrbitView({
        id: "orbit-view",
      });

      const props: Props = { view };
      const instance = createInstance("view", props, mockContainer, mockHostContext, mockFiber);

      expect(instance.node).toBeInstanceOf(OrbitView);
      expect(instance.node).toBe(view);
    });

    it("preserves view ID through reconciliation", () => {
      const viewId = "my-unique-view-id";
      const view = new MapView({
        id: viewId,
      });

      const props: Props = { view };
      const instance = createInstance("view", props, mockContainer, mockHostContext, mockFiber);

      expect(instance.node.id).toBe(viewId);
    });

    it("warns when view is missing explicit id in development", () => {
      const view = new MapView({
        id: "unknown",
      });

      const props: Props = { view };
      withNodeEnv("development", () => {
        createInstance("view", props, mockContainer, mockHostContext, mockFiber);
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      const calls = consoleWarnSpy.mock.calls.flat().join(" ");
      expect(calls).toContain('View missing explicit "id" prop');
    });

    it("does not warn when view has explicit id in development", () => {
      consoleWarnSpy.mockClear();

      const view = new MapView({
        id: "test-view",
      });

      const props: Props = { view };
      withNodeEnv("development", () => {
        createInstance("view", props, mockContainer, mockHostContext, mockFiber);
      });

      const calls = consoleWarnSpy.mock.calls.flat().join(" ");
      expect(calls).not.toContain('View missing explicit "id" prop');
    });

    it("does not warn about missing id in production", () => {
      const view = new MapView({});

      const props: Props = { view };
      withNodeEnv("production", () => {
        createInstance("view", props, mockContainer, mockHostContext, mockFiber);
      });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
