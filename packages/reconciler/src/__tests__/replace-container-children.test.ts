import { MapView, OrbitView } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { describe, expect, it, vi } from 'vitest';

import {
  createMockContainer,
  createMockDeckInstance,
} from '../__fixtures__/mock-deck-instance';
import { replaceContainerChildren } from '../config';
import type { ChildSet, Instance } from '../types';

describe('replaceContainerChildren', () => {
  describe('views prop handling', () => {
    it('should not set views prop when no views are present', () => {
      const mockContainer = createMockContainer();
      const mockDeckInstance = createMockDeckInstance();
      // @ts-expect-error - mocking deckgl instance
      mockContainer.store.getState = vi.fn(() => ({
        _passedLayers: [],
        deckgl: mockDeckInstance,
      }));

      const layer1: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'layer-1' }),
      };

      const layer2: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'layer-2' }),
      };

      const childSet: ChildSet = [layer1, layer2];

      replaceContainerChildren(mockContainer, childSet);

      expect(mockDeckInstance.setProps).toHaveBeenCalledTimes(1);
      const propsUpdate = mockDeckInstance.setProps.mock.calls[0][0];

      // Should have layers prop but not views prop
      expect(propsUpdate).toHaveProperty('layers');
      expect(propsUpdate).not.toHaveProperty('views');
    });

    it('should set views prop when views are present', () => {
      const mockContainer = createMockContainer();
      const mockDeckInstance = createMockDeckInstance();
      // @ts-expect-error - mocking deckgl instance
      mockContainer.store.getState = vi.fn(() => ({
        _passedLayers: [],
        deckgl: mockDeckInstance,
      }));

      const view1: Instance = {
        children: [],
        node: new MapView({ id: 'map-view' }),
      };

      const view2: Instance = {
        children: [],
        node: new OrbitView({ id: 'orbit-view' }),
      };

      const layer: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'layer-1' }),
      };

      const childSet: ChildSet = [view1, view2, layer];

      replaceContainerChildren(mockContainer, childSet);

      expect(mockDeckInstance.setProps).toHaveBeenCalledTimes(1);
      const propsUpdate = mockDeckInstance.setProps.mock.calls[0][0];

      // Should have both layers and views props
      expect(propsUpdate).toHaveProperty('layers');
      expect(propsUpdate).toHaveProperty('views');
      expect(propsUpdate.views).toHaveLength(2);
      expect(propsUpdate.views[0]).toBe(view1.node);
      expect(propsUpdate.views[1]).toBe(view2.node);
    });

    it('should combine _passedLayers with tree layers', () => {
      const passedLayer = new ScatterplotLayer({
        data: [],
        id: 'passed-layer',
      });

      const mockContainer = createMockContainer();
      const mockDeckInstance = createMockDeckInstance();
      // @ts-expect-error - mocking deckgl instance
      mockContainer.store.getState = vi.fn(() => ({
        _passedLayers: [passedLayer],
        deckgl: mockDeckInstance,
      }));

      const treeLayer: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'tree-layer' }),
      };

      const childSet: ChildSet = [treeLayer];

      replaceContainerChildren(mockContainer, childSet);

      expect(mockDeckInstance.setProps).toHaveBeenCalledTimes(1);
      const propsUpdate = mockDeckInstance.setProps.mock.calls[0][0];

      // Should have both passed layers and tree layers in order
      expect(propsUpdate.layers).toHaveLength(2);
      expect(propsUpdate.layers[0]).toBe(passedLayer);
      expect(propsUpdate.layers[1]).toBe(treeLayer.node);
    });
  });

  describe('deckgl cleanup handling', () => {
    it('should handle case when deckgl is already cleaned up', () => {
      const mockContainer = createMockContainer();
      // @ts-expect-error - mocking deckgl instance
      mockContainer.store.getState = vi.fn(() => ({
        _passedLayers: [],
        deckgl: null,
      }));

      const layer: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'layer-1' }),
      };

      const childSet: ChildSet = [layer];

      // Should not throw when deckgl is null
      expect(() => {
        replaceContainerChildren(mockContainer, childSet);
      }).not.toThrow();
    });
  });
});
