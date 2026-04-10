import { ScatterplotLayer } from '@deck.gl/layers';
import * as fc from 'fast-check';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createRoot, roots, unmountAtNode } from '../renderer';
import type { RootElement } from '../types';

/**
 * Creates a test RootElement instance
 * Centralizes type assertion for easier maintenance
 */
function createTestRootElement(): RootElement {
  return {} as RootElement;
}

describe('renderer', () => {
  afterEach(() => {
    // Clean up all roots after each test to prevent worker teardown issues
    const allRoots = Array.from(roots.keys());
    for (const node of allRoots) {
      try {
        unmountAtNode(node);
      } catch {
        // Ignore errors during cleanup
      }
    }
  });
  describe('createRoot', () => {
    it('calling createRoot twice on same node returns same root', () => {
      // Arrange
      const node = createTestRootElement();

      // Act
      const root1 = createRoot(node);
      const root2 = createRoot(node);

      // Assert
      expect(root2).toBe(root1);
    });

    it('root reuse preserves store and container', () => {
      // Arrange
      const node = createTestRootElement();

      // Act
      const root1 = createRoot(node);
      const root2 = createRoot(node);

      // Assert
      expect(root2.store).toBe(root1.store);
      expect(root2.container).toBe(root1.container);
    });

    it('different nodes get different roots', () => {
      // Arrange
      const node1 = createTestRootElement();
      const node2 = createTestRootElement();

      // Act
      const root1 = createRoot(node1);
      const root2 = createRoot(node2);

      // Assert
      expect(root2).not.toBe(root1);
      expect(root2.container).not.toBe(root1.container);
    });
  });

  describe('configure', () => {
    it('should set _passedLayers when layers prop is provided', () => {
      // Arrange
      const node = createTestRootElement();
      const root = createRoot(node);
      const passedLayers = [
        new ScatterplotLayer({ data: [], id: 'passed-1' }),
        new ScatterplotLayer({ data: [], id: 'passed-2' }),
      ];

      // Act
      root.configure({
        layers: passedLayers,
        views: [],
      });

      // Assert
      const state = root.store.getState();
      expect(state._passedLayers).toEqual(passedLayers);
    });

    it('should not reconfigure when called multiple times', () => {
      // Arrange
      const node = createTestRootElement();
      const root = createRoot(node);

      // Act
      root.configure({ views: [] });
      const firstDeckgl = root.store.getState().deckgl;

      root.configure({ views: [] });
      const secondDeckgl = root.store.getState().deckgl;

      // Assert
      expect(secondDeckgl).toBe(firstDeckgl);
    });

    it('should update _passedLayers even when already configured', () => {
      // Arrange
      const node = createTestRootElement();
      const root = createRoot(node);
      root.configure({ views: [] });
      const newLayers = [new ScatterplotLayer({ data: [], id: 'new-layer' })];

      // Act
      root.configure({
        layers: newLayers,
        views: [],
      });

      // Assert
      const state = root.store.getState();
      expect(state._passedLayers).toEqual(newLayers);
    });

    it('should create MapboxOverlay when interleaved prop is present', () => {
      // Arrange
      const node = createTestRootElement();
      const root = createRoot(node);

      // Act
      root.configure({
        interleaved: true,
        views: [],
      });

      // Assert
      const state = root.store.getState();
      expect(state.deckgl).not.toBeNull();
      expect(state.deckgl).toBeTypeOf('object');
      expect(state.deckgl).toHaveProperty('setProps');
      expect(state.deckgl).toHaveProperty('finalize');
    });
  });

  describe('unmountAtNode', () => {
    it('should finalize deckgl and remove root from map', () => {
      // Arrange
      const node = createTestRootElement();
      const root = createRoot(node);
      root.configure({ views: [] });
      const { deckgl } = root.store.getState();

      // Track finalize behavior without spying on implementation
      const originalFinalize = deckgl.finalize;
      let finalizeCalled = false;
      deckgl.finalize = () => {
        finalizeCalled = true;
        originalFinalize.call(deckgl);
      };

      expect(roots.has(node)).toBe(true);

      // Act
      unmountAtNode(node);

      // Assert
      expect(finalizeCalled).toBe(true);
      expect(roots.has(node)).toBe(false);
      expect(root.store.getState().deckgl).toBeUndefined();
    });

    it('should handle unmounting non-existent node gracefully', () => {
      // Arrange
      const node = createTestRootElement();

      // Act & Assert
      expect(() => unmountAtNode(node)).not.toThrow();
      expect(roots.has(node)).toBe(false);
    });
  });

  describe('render', () => {
    it('should update container with provided children', () => {
      // Arrange
      const node = createTestRootElement();
      const root = createRoot(node);
      root.configure({ views: [] });
      const children = React.createElement('div', null, 'test content');

      // Act & Assert
      expect(() => root.render(children)).not.toThrow();
    });
  });

  describe('property: createRoot idempotency', () => {
    it('property: returns same root for same node regardless of call count', () => {
      fc.assert(
        fc.property(fc.integer({ max: 10, min: 2 }), (callCount) => {
          // Arrange
          const node = createTestRootElement();

          // Act
          const roots = Array.from({ length: callCount }, () =>
            createRoot(node)
          );

          // Assert
          const firstRoot = roots[0];
          return (
            roots.every((root) => root === firstRoot) &&
            roots.every((root) => root.store === firstRoot.store) &&
            roots.every((root) => root.container === firstRoot.container)
          );
        })
      );
    });
  });

  describe('edge cases', () => {
    it('should handle render before configure gracefully', () => {
      // Arrange
      const node = createTestRootElement();
      const root = createRoot(node);
      const children = React.createElement('div', null, 'test');

      // Act & Assert
      expect(() => root.render(children)).not.toThrow();
    });

    it('should complete cleanup even when finalize throws', () => {
      // Arrange
      const node = createTestRootElement();
      const root = createRoot(node);
      root.configure({ views: [] });

      const { deckgl } = root.store.getState();
      deckgl.finalize = () => {
        throw new Error('Finalize failed');
      };

      // Suppress console errors during this test to avoid worker teardown issues
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      try {
        // Act & Assert
        // Error propagates to caller
        expect(() => unmountAtNode(node)).toThrow('Finalize failed');

        // But cleanup still completes (try-finally ensures this)
        // Root IS removed even when finalize throws
        expect(roots.has(node)).toBe(false);
      } finally {
        consoleErrorSpy.mockRestore();
      }
    });
  });
});
