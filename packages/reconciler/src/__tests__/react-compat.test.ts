import {
  ContinuousEventPriority,
  DefaultEventPriority,
  DiscreteEventPriority,
} from 'react-reconciler/constants';
import { describe, expect, it } from 'vitest';

import { fixtures } from '../__fixtures__/layers';
import {
  createMockContainer,
  createMockHostContext,
  createMockInstance,
} from '../__fixtures__/mock-deck-instance';
import * as config from '../config';

describe('React Compatibility Tests', () => {
  describe('Mode configuration', () => {
    it('should supportsPersistence is true', () => {
      // Assert
      expect(config.supportsPersistence).toBe(true);
    });

    it('should supportsMutation is false', () => {
      // Assert
      expect(config.supportsMutation).toBe(false);
    });
  });

  describe('Event priority', () => {
    it('should event priority is valid (DiscreteEventPriority, ContinuousEventPriority, or DefaultEventPriority)', () => {
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

  describe('Core methods exist', () => {
    it('should core methods exist (createInstance, cloneInstance, etc.)', () => {
      // Assert - verify critical reconciler methods are exported
      expect(typeof config.createInstance).toBe('function');
      expect(typeof config.cloneInstance).toBe('function');
      expect(typeof config.finalizeInitialChildren).toBe('function');
      expect(typeof config.prepareUpdate).toBe('function');
      expect(typeof config.getRootHostContext).toBe('function');
      expect(typeof config.getChildHostContext).toBe('function');
    });
  });

  describe('Persistence methods exist', () => {
    it('should persistence methods exist (cloneInstance, createContainerChildSet, etc.)', () => {
      // Assert - verify persistence mode methods
      expect(typeof config.cloneInstance).toBe('function');
      expect(typeof config.createContainerChildSet).toBe('function');
      expect(typeof config.appendChildToContainerChildSet).toBe('function');
      expect(typeof config.replaceContainerChildren).toBe('function');
      expect(typeof config.cloneHiddenInstance).toBe('function');
    });
  });

  describe('Suspense methods exist', () => {
    it('should suspense methods exist (cloneHiddenInstance, unhideInstance)', () => {
      // Assert - verify suspense support methods
      expect(typeof config.cloneHiddenInstance).toBe('function');
      expect(typeof config.cloneHiddenTextInstance).toBe('function');
    });
  });

  describe('Method signatures', () => {
    it('should createInstance accepts correct parameters', () => {
      // Arrange
      const type = 'layer';
      const props = { layer: fixtures.scatterplotLayer() };
      const container = createMockContainer();
      const hostContext = createMockHostContext();

      // Act
      const instance = config.createInstance(
        type,
        props,
        container.store,
        hostContext
      );

      // Assert
      expect(instance).toBeDefined();
      expect(instance.node).toBeDefined();
      expect(instance.children).toBeDefined();
    });

    it('should cloneInstance accepts correct parameters', () => {
      // Arrange
      const layer = fixtures.scatterplotLayer({ id: 'test' });
      const instance = createMockInstance(layer);
      const type = 'layer';
      const oldProps = { layer };
      const newProps = { layer: fixtures.scatterplotLayer({ id: 'test' }) };
      const keepChildren = false;
      const newChildSet = null;

      // Act
      const cloned = config.cloneInstance(
        instance,
        type,
        oldProps,
        newProps,
        keepChildren,
        newChildSet
      );

      // Assert
      expect(cloned).toBeDefined();
      expect(cloned.node).toBeDefined();
      expect(cloned).not.toBe(instance);
    });
  });
});
