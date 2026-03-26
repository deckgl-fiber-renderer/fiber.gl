import { ScatterplotLayer } from '@deck.gl/layers';
import { beforeAll, describe, expect, it } from 'vitest';

import { createRoot } from '../renderer';
import type { RootElement } from '../types';

// Mock reportError for tests
beforeAll(() => {
  globalThis.reportError = (error: any) => {
    console.error(error);
  };
});

describe('renderer', () => {
  describe('createRoot', () => {
    it('calling createRoot twice on same node returns same root', () => {
      const node = {} as RootElement;

      const root1 = createRoot(node);
      const root2 = createRoot(node);

      expect(root2).toBe(root1);
    });

    it('root reuse preserves store and container', () => {
      const node = {} as RootElement;

      const root1 = createRoot(node);
      const root2 = createRoot(node);

      expect(root2.store).toBe(root1.store);
      expect(root2.container).toBe(root1.container);
    });

    it('different nodes get different roots', () => {
      const node1 = {} as RootElement;
      const node2 = {} as RootElement;

      const root1 = createRoot(node1);
      const root2 = createRoot(node2);

      expect(root2).not.toBe(root1);
      expect(root2.container).not.toBe(root1.container);
    });
  });

  describe('configure', () => {
    it('should set _passedLayers when layers prop is provided', () => {
      const node = {} as RootElement;
      const root = createRoot(node);

      const passedLayers = [
        new ScatterplotLayer({ data: [], id: 'passed-1' }),
        new ScatterplotLayer({ data: [], id: 'passed-2' }),
      ];

      // Configure with layers prop
      root.configure({
        layers: passedLayers,
        views: [],
      });

      const state = root.store.getState();
      expect(state._passedLayers).toEqual(passedLayers);
    });

    it('should not reconfigure when called multiple times', () => {
      const node = {} as RootElement;
      const root = createRoot(node);

      // First configure call
      root.configure({ views: [] });
      const firstDeckgl = root.store.getState().deckgl;

      // Second configure call should not create new Deck instance
      root.configure({ views: [] });
      const secondDeckgl = root.store.getState().deckgl;

      expect(secondDeckgl).toBe(firstDeckgl);
    });

    it('should update _passedLayers even when already configured', () => {
      const node = {} as RootElement;
      const root = createRoot(node);

      // First configure
      root.configure({ views: [] });

      // Second configure with new layers should update _passedLayers
      const newLayers = [new ScatterplotLayer({ data: [], id: 'new-layer' })];
      root.configure({
        layers: newLayers,
        views: [],
      });

      const state = root.store.getState();
      expect(state._passedLayers).toEqual(newLayers);
    });

    it('should create MapboxOverlay when interleaved prop is present', () => {
      const node = {} as RootElement;
      const root = createRoot(node);

      // Configure with interleaved prop to trigger MapboxOverlay path
      root.configure({
        interleaved: true,
        views: [],
      });

      const state = root.store.getState();
      // MapboxOverlay should be created instead of Deck
      expect(state.deckgl).toBeDefined();
    });
  });
});
