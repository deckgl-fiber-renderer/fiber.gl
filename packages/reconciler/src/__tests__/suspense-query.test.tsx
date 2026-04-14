import { ScatterplotLayer } from "@deck.gl/layers";
import { createElement, Fragment, Suspense, use } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createMockDeckInstance } from "../__fixtures__/mock-deck-instance";
import { createRoot, unmountAtNode } from "../renderer";

/**
 * Reproduction test for GitHub issue #15
 * https://github.com/deckgl-fiber-renderer/fiber.gl/issues/15
 *
 * Pattern: Server Components -> Client Component with async query -> Suspense
 * This mimics the Next.js App Router pattern with TanStack Query's useSuspenseQuery
 */

// Test 1: Suspense with TanStack Query pattern
// Module-level state to avoid component remounting on re-render
let test1Suspended = false;
let test1DataPromise: Promise<any[]> | null = null;

function Test1ClientComponent() {
  if (!test1Suspended) {
    test1Suspended = true;
    if (test1DataPromise) {
      throw test1DataPromise;
    }
  }

  const data = [
    { position: [0, 0], radius: 100 },
    { position: [1, 1], radius: 200 },
  ];

  return createElement("layer", {
    layer: new ScatterplotLayer({
      data,
      getPosition: (d: any) => d.position,
      getRadius: (d: any) => d.radius,
      id: "async-data-layer",
    }),
  });
}

function Test1ServerComponent() {
  return createElement(Test1ClientComponent);
}

function Test1LoadingComponent({ children }: { children: React.ReactNode }) {
  return createElement(
    Suspense,
    {
      fallback: createElement("layer", {
        layer: new ScatterplotLayer({
          data: [],
          id: "loading-fallback",
        }),
      }),
    },
    children,
  );
}

function Test1Component() {
  return createElement(Test1LoadingComponent, {}, createElement(Test1ServerComponent));
}

// Test 2: React 19 use() hook pattern
let test2DataPromise: Promise<any[]> | null = null;

function Test2ClientComponentWithUse() {
  let data: any[];
  try {
    if (!test2DataPromise) {
      throw new Error("Test setup incomplete");
    }
    data = use(test2DataPromise);
  } catch (error) {
    throw error;
  }

  return createElement("layer", {
    layer: new ScatterplotLayer({
      data,
      getPosition: (d: any) => d.position,
      id: "use-hook-layer",
    }),
  });
}

function Test2AppWithSuspense() {
  return createElement(
    Suspense,
    {
      fallback: createElement("layer", {
        layer: new ScatterplotLayer({ data: [], id: "fallback" }),
      }),
    },
    createElement(Test2ClientComponentWithUse),
  );
}

// Test 3: Nested Suspense boundaries
let test3Promise1: Promise<any[]> | null = null;
let test3Promise2: Promise<any[]> | null = null;
let test3Suspended1 = false;
let test3Suspended2 = false;

function Test3AsyncLayer1() {
  if (!test3Suspended1) {
    test3Suspended1 = true;
    if (test3Promise1) {
      throw test3Promise1;
    }
  }
  return createElement("layer", {
    layer: new ScatterplotLayer({ data: [], id: "layer-1" }),
  });
}

function Test3AsyncLayer2() {
  if (!test3Suspended2) {
    test3Suspended2 = true;
    if (test3Promise2) {
      throw test3Promise2;
    }
  }
  return createElement("layer", {
    layer: new ScatterplotLayer({ data: [], id: "layer-2" }),
  });
}

function Test3NestedSuspense() {
  return createElement(
    Suspense,
    { fallback: null },
    createElement(
      Fragment,
      null,
      createElement(
        Suspense,
        {
          fallback: createElement("layer", {
            layer: new ScatterplotLayer({ data: [], id: "fallback-1" }),
          }),
        },
        createElement(Test3AsyncLayer1),
      ),
      createElement(
        Suspense,
        {
          fallback: createElement("layer", {
            layer: new ScatterplotLayer({ data: [], id: "fallback-2" }),
          }),
        },
        createElement(Test3AsyncLayer2),
      ),
    ),
  );
}

describe("Suspense with async queries (issue #15)", () => {
  let mockDeck: ReturnType<typeof createMockDeckInstance>;
  let rootElement: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    // Reset module-level state before each test
    test1Suspended = false;
    test1DataPromise = null;
    test2DataPromise = null;
    test3Promise1 = null;
    test3Promise2 = null;
    test3Suspended1 = false;
    test3Suspended2 = false;

    mockDeck = createMockDeckInstance();
    rootElement = document.createElement("div");
    root = createRoot(rootElement);

    root.configure({
      canvas: rootElement as unknown as HTMLCanvasElement,
    });

    const { store } = root;
    store.setState({ deckgl: mockDeck as never });
  });

  afterEach(() => {
    if (rootElement) {
      unmountAtNode(rootElement);
    }
  });

  it("should handle component that suspends while rendering a layer", async () => {
    // Setup test-specific promise
    let resolveData: ((value: any[]) => void) | null = null;
    test1DataPromise = new Promise<any[]>((resolve) => {
      resolveData = resolve;
    });

    // This should not throw during initial render (showing fallback)
    expect(() => {
      root.render(createElement(Test1Component));
    }).not.toThrow();

    // Resolve the data
    if (resolveData) {
      resolveData([
        { position: [0, 0], radius: 100 },
        { position: [1, 1], radius: 200 },
      ]);
    }

    // Allow React to process the resolved promise
    await new Promise((resolve) => setTimeout(resolve, 0));

    // After resolution, should render the actual layer without errors
    expect(() => {
      root.render(createElement(Test1Component));
    }).not.toThrow();
  });

  it("should handle React 19 use() hook pattern", async () => {
    // Setup test-specific promise
    let resolveData: ((value: any[]) => void) | null = null;
    test2DataPromise = new Promise<any[]>((resolve) => {
      resolveData = resolve;
    });

    // Should not throw during initial render
    expect(() => {
      root.render(createElement(Test2AppWithSuspense));
    }).not.toThrow();

    // Resolve data
    if (resolveData) {
      resolveData([{ position: [0, 0] }]);
    }

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Should not throw after resolution
    expect(() => {
      root.render(createElement(Test2AppWithSuspense));
    }).not.toThrow();
  });

  it("should handle nested Suspense boundaries with async components", async () => {
    // Setup test-specific promises
    let resolve1: ((value: any[]) => void) | null = null;
    let resolve2: ((value: any[]) => void) | null = null;
    test3Promise1 = new Promise<any[]>((r) => (resolve1 = r));
    test3Promise2 = new Promise<any[]>((r) => (resolve2 = r));

    // Should handle nested Suspense boundaries
    expect(() => {
      root.render(createElement(Test3NestedSuspense));
    }).not.toThrow();

    // Resolve both
    if (resolve1) {
      resolve1([]);
    }
    if (resolve2) {
      resolve2([]);
    }
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(() => {
      root.render(createElement(Test3NestedSuspense));
    }).not.toThrow();
  });
});
