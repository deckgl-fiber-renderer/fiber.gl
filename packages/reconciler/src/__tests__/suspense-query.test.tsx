import { ScatterplotLayer } from '@deck.gl/layers';
import { createElement, Suspense, use } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createMockDeckInstance } from '../__fixtures__/mock-deck-instance';
import { createRoot, unmountAtNode } from '../renderer';

/**
 * Reproduction test for GitHub issue #15
 * https://github.com/deckgl-fiber-renderer/fiber.gl/issues/15
 *
 * Pattern: Server Components -> Client Component with async query -> Suspense
 * This mimics the Next.js App Router pattern with TanStack Query's useSuspenseQuery
 */
describe('Suspense with async queries (issue #15)', () => {
  let mockDeck: ReturnType<typeof createMockDeckInstance>;
  let rootElement: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    mockDeck = createMockDeckInstance();
    rootElement = document.createElement('div');
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

  it('should handle component that suspends while rendering a layer', async () => {
    // Simulate TanStack Query's useSuspenseQuery behavior
    let resolveData: ((value: any[]) => void) | null = null;
    const dataPromise = new Promise<any[]>((resolve) => {
      resolveData = resolve;
    });

    let suspended = false;

    // Client component that uses suspense query
    function MyClientComponent() {
      if (!suspended) {
        suspended = true;
        // This is what useSuspenseQuery does internally - throws a promise
        throw dataPromise;
      }

      // After suspense resolves, render the layer
      const data = [
        { position: [0, 0], radius: 100 },
        { position: [1, 1], radius: 200 },
      ];

      return createElement('layer', {
        layer: new ScatterplotLayer({
          data,
          getPosition: (d: any) => d.position,
          getRadius: (d: any) => d.radius,
          id: 'async-data-layer',
        }),
      });
    }

    // Server component (just passes through)
    function MyServerComponent() {
      return createElement(MyClientComponent);
    }

    // Loading wrapper with Suspense
    function LoadingComponent({ children }: { children: React.ReactNode }) {
      return createElement(
        Suspense,
        {
          fallback: createElement('layer', {
            layer: new ScatterplotLayer({
              data: [],
              id: 'loading-fallback',
            }),
          }),
        },
        children
      );
    }

    // Full component tree
    function MyComponent() {
      return createElement(
        LoadingComponent,
        {},
        createElement(MyServerComponent)
      );
    }

    // This should not throw during initial render (showing fallback)
    expect(() => {
      root.render(createElement(MyComponent));
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
      root.render(createElement(MyComponent));
    }).not.toThrow();
  });

  it('should handle React 19 use() hook pattern', async () => {
    // React 19's use() hook for promises
    let resolveData: ((value: any[]) => void) | null = null;
    const dataPromise = new Promise<any[]>((resolve) => {
      resolveData = resolve;
    });

    function MyClientComponentWithUse() {
      // React 19: use(promise) suspends until resolved
      let data: any[];
      try {
        data = use(dataPromise);
      } catch (error) {
        // If use() throws, it's suspending
        throw error;
      }

      return createElement('layer', {
        layer: new ScatterplotLayer({
          data,
          getPosition: (d: any) => d.position,
          id: 'use-hook-layer',
        }),
      });
    }

    function AppWithSuspense() {
      return createElement(
        Suspense,
        {
          fallback: createElement('layer', {
            layer: new ScatterplotLayer({ data: [], id: 'fallback' }),
          }),
        },
        createElement(MyClientComponentWithUse)
      );
    }

    // Should not throw during initial render
    expect(() => {
      root.render(createElement(AppWithSuspense));
    }).not.toThrow();

    // Resolve data
    if (resolveData) {
      resolveData([{ position: [0, 0] }]);
    }

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Should not throw after resolution
    expect(() => {
      root.render(createElement(AppWithSuspense));
    }).not.toThrow();
  });

  it('should handle nested Suspense boundaries with async components', async () => {
    let resolve1: ((value: any[]) => void) | null = null;
    let resolve2: ((value: any[]) => void) | null = null;
    const promise1 = new Promise<any[]>((r) => (resolve1 = r));
    const promise2 = new Promise<any[]>((r) => (resolve2 = r));

    let suspended1 = false;
    let suspended2 = false;

    function AsyncLayer1() {
      if (!suspended1) {
        suspended1 = true;
        throw promise1;
      }
      return createElement('layer', {
        layer: new ScatterplotLayer({ data: [], id: 'layer-1' }),
      });
    }

    function AsyncLayer2() {
      if (!suspended2) {
        suspended2 = true;
        throw promise2;
      }
      return createElement('layer', {
        layer: new ScatterplotLayer({ data: [], id: 'layer-2' }),
      });
    }

    function NestedSuspense() {
      return createElement(
        Suspense,
        { fallback: null },
        createElement(
          'fragment',
          {},
          createElement(
            Suspense,
            {
              fallback: createElement('layer', {
                layer: new ScatterplotLayer({ data: [], id: 'fallback-1' }),
              }),
            },
            createElement(AsyncLayer1)
          ),
          createElement(
            Suspense,
            {
              fallback: createElement('layer', {
                layer: new ScatterplotLayer({ data: [], id: 'fallback-2' }),
              }),
            },
            createElement(AsyncLayer2)
          )
        )
      );
    }

    // Should handle nested Suspense boundaries
    expect(() => {
      root.render(createElement(NestedSuspense));
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
      root.render(createElement(NestedSuspense));
    }).not.toThrow();
  });
});
