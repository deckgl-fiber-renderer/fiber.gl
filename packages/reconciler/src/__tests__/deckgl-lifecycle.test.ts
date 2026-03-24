import { MapView } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { describe, expect, it } from 'vitest';

import { fixtures, createTestLayer } from '../__fixtures__/layers';
import {
  createMockInstance,
  createMockHostContext,
} from '../__fixtures__/mock-deck-instance';
import { createInstance, getChildHostContext } from '../config';
import { flattenTree, organizeList } from '../utils';

describe('Deck.gl Lifecycle Tests', () => {
  describe('Layer ID preservation', () => {
    it('should layer ID preserved on creation', () => {
      // Arrange
      const layerId = 'stable-id';
      const layer = fixtures.scatterplotLayer({ id: layerId });
      const hostContext = createMockHostContext();

      // Act
      const instance = createInstance(
        'layer',
        { layer },
        hostContext.store,
        hostContext
      );

      // Assert
      expect(instance.node.id).toBe(layerId);
    });

    it('should layer ID preserved through updates', () => {
      // Arrange
      const layerId = 'persistent-id';
      const originalLayer = fixtures.scatterplotLayer({
        id: layerId,
        radiusScale: 1,
      });
      const originalInstance = createMockInstance(originalLayer);

      // Act - simulate an update by creating a new layer with same ID
      const updatedLayer = fixtures.scatterplotLayer({
        id: layerId,
        radiusScale: 2,
      });
      const updatedInstance = createMockInstance(updatedLayer);

      // Assert
      expect(originalInstance.node.id).toBe(layerId);
      expect(updatedInstance.node.id).toBe(layerId);
    });
  });

  describe('View context', () => {
    it('should View sets child host context', () => {
      // Arrange
      const view = fixtures.mapView({ id: 'map-view' });
      const hostContext = createMockHostContext({ insideView: false });

      // Act
      const childContext = getChildHostContext(
        hostContext,
        'view',
        hostContext.store
      );

      // Assert
      expect(childContext.insideView).toBe(true);
    });

    it('should layer inherits parent View context', () => {
      // Arrange
      const parentContext = createMockHostContext({ insideView: true });

      // Act
      const childContext = getChildHostContext(
        parentContext,
        'layer',
        parentContext.store
      );

      // Assert
      expect(childContext.insideView).toBe(true);
    });
  });

  describe('List organization', () => {
    it('should mixed list organized correctly (views/layers)', () => {
      // Arrange
      const view = new MapView({ id: 'view-1' });
      const layer = new ScatterplotLayer({ data: [], id: 'layer-1' });
      const mixedList = [view, layer];

      // Act
      const organized = organizeList(mixedList);

      // Assert
      expect(organized.views).toHaveLength(1);
      expect(organized.layers).toHaveLength(1);
      expect(organized.views[0]).toBe(view);
      expect(organized.layers[0]).toBe(layer);
    });

    it('should all layers list has no views', () => {
      // Arrange
      const layer1 = new ScatterplotLayer({ data: [], id: 'layer-1' });
      const layer2 = new ScatterplotLayer({ data: [], id: 'layer-2' });
      const layersList = [layer1, layer2];

      // Act
      const organized = organizeList(layersList);

      // Assert
      expect(organized.views).toHaveLength(0);
      expect(organized.layers).toHaveLength(2);
    });
  });

  describe('Tree flattening', () => {
    it('should flatten three-level hierarchy', () => {
      // Arrange
      const layer1 = createTestLayer('scatterplot', { id: 'level-1' });
      const layer2 = createTestLayer('scatterplot', { id: 'level-2' });
      const layer3 = createTestLayer('scatterplot', { id: 'level-3' });

      const level3Instance = createMockInstance(layer3, []);
      const level2Instance = createMockInstance(layer2, [level3Instance]);
      const level1Instance = createMockInstance(layer1, [level2Instance]);

      // Act
      const flattened = flattenTree([level1Instance]);

      // Assert
      expect(flattened).toHaveLength(3);
      expect(flattened[0].id).toBe('level-1');
      expect(flattened[1].id).toBe('level-2');
      expect(flattened[2].id).toBe('level-3');
    });

    it('should flatten handles empty children', () => {
      // Arrange
      const layer = createTestLayer('scatterplot', { id: 'solo' });
      const instance = createMockInstance(layer, []);

      // Act
      const flattened = flattenTree([instance]);

      // Assert
      expect(flattened).toHaveLength(1);
      expect(flattened[0].id).toBe('solo');
    });
  });
});
