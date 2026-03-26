import { ScatterplotLayer } from '@deck.gl/layers';
import { describe, expect, it } from 'vitest';

import {
  createMockContainer,
  createMockHostContext,
} from '../__fixtures__/mock-deck-instance';
import {
  afterActiveInstanceBlur,
  appendInitialChild,
  beforeActiveInstanceBlur,
  createTextInstance,
  getInstanceFromNode,
  getInstanceFromScope,
  preparePortalMount,
  prepareScopeUpdate,
  prepareUpdate,
  shouldAttemptEagerTransition,
} from '../config';
import type { Instance } from '../types';

describe('reconciler lifecycle functions', () => {
  describe('createTextInstance', () => {
    it('should throw error for text nodes', () => {
      // Text nodes are not supported in deck.gl renderer
      // Deck.gl layers are not DOM-like and don't have text content
      expect(() => {
        createTextInstance();
      }).toThrow('Text nodes are not supported');
    });
  });

  describe('appendInitialChild', () => {
    it('should append child to parent children array', () => {
      const parentInstance: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'parent' }),
      };

      const childInstance: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'child' }),
      };

      appendInitialChild(parentInstance, childInstance);

      expect(parentInstance.children).toHaveLength(1);
      expect(parentInstance.children[0]).toBe(childInstance);
    });

    it('should append multiple children in order', () => {
      const parentInstance: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'parent' }),
      };

      const child1: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'child-1' }),
      };

      const child2: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'child-2' }),
      };

      appendInitialChild(parentInstance, child1);
      appendInitialChild(parentInstance, child2);

      expect(parentInstance.children).toHaveLength(2);
      expect(parentInstance.children[0]).toBe(child1);
      expect(parentInstance.children[1]).toBe(child2);
    });
  });

  describe('prepareUpdate', () => {
    it('should return null in persistence mode', () => {
      // In persistence mode, we don't mutate existing instances
      // Instead, we create new instances on prop changes
      const mockContainer = createMockContainer();
      const mockHostContext = createMockHostContext();
      const instance: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'layer' }),
      };

      const result = prepareUpdate(
        instance,
        'layer',
        { data: [], id: 'layer' },
        { data: [{ x: 1, y: 2 }], id: 'layer' },
        mockContainer,
        mockHostContext
      );

      expect(result).toBeNull();
    });
  });

  describe('preparePortalMount', () => {
    it('should execute without error', () => {
      // No-op function for portal mounting
      // Deck.gl doesn't need special portal preparation
      expect(() => {
        preparePortalMount();
      }).not.toThrow();
    });
  });

  describe('focus management API', () => {
    describe('beforeActiveInstanceBlur', () => {
      it('should execute without error', () => {
        // No-op because deck.gl doesn't manage focus at layer level
        // Focus is handled at the DOM canvas level
        expect(() => {
          beforeActiveInstanceBlur();
        }).not.toThrow();
      });
    });

    describe('afterActiveInstanceBlur', () => {
      it('should execute without error', () => {
        // No-op because deck.gl doesn't manage focus at layer level
        expect(() => {
          afterActiveInstanceBlur();
        }).not.toThrow();
      });
    });

    describe('getInstanceFromNode', () => {
      it('should return null', () => {
        // Not implemented - deck.gl doesn't track fiber-to-instance mapping
        const mockFiber = {} as Parameters<typeof getInstanceFromNode>[0];
        const result = getInstanceFromNode(mockFiber);

        expect(result).toBeNull();
      });
    });
  });

  describe('scope API', () => {
    describe('getInstanceFromScope', () => {
      it('should return null', () => {
        // Scope queries not implemented - deck.gl doesn't use scope abstraction
        const mockScopeInstance: Instance = {
          children: [],
          node: new ScatterplotLayer({ data: [], id: 'scope' }),
        };

        const result = getInstanceFromScope(mockScopeInstance);

        expect(result).toBeNull();
      });
    });

    describe('prepareScopeUpdate', () => {
      it('should execute without error', () => {
        // No-op because scope updates not implemented
        // Deck.gl updates work at full tree level
        const scopeInstance: Instance = {
          children: [],
          node: new ScatterplotLayer({ data: [], id: 'scope' }),
        };
        const instance: Instance = {
          children: [],
          node: new ScatterplotLayer({ data: [], id: 'instance' }),
        };

        expect(() => {
          prepareScopeUpdate(scopeInstance, instance);
        }).not.toThrow();
      });
    });
  });

  describe('shouldAttemptEagerTransition', () => {
    it('should return false to defer transitions', () => {
      // Conservative approach - deck.gl layer updates can be expensive
      // Always defer transitions to avoid blocking main thread
      const result = shouldAttemptEagerTransition();

      expect(result).toBe(false);
    });
  });
});
