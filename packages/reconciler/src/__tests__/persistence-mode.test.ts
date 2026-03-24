import { MapView } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { describe, expect, it } from 'vitest';

import {
  appendChildToSet,
  cloneInstance,
  detachDeletedInstance,
} from '../config';
import type { ChildSet, Instance } from '../types';

describe('persistence mode', () => {
  describe('appendChildToSet', () => {
    it('returns new array reference', () => {
      const childSet: ChildSet = [];
      const child: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'child' }),
      };

      const newChildSet = appendChildToSet(childSet, child);

      // Should return a new array, not mutate original
      expect(newChildSet).not.toBe(childSet);
      expect(newChildSet.length).toBe(1);
      expect(newChildSet[0]).toBe(child);
      expect(childSet.length).toBe(0); // Original unchanged
    });

    it('appends child to existing set', () => {
      const existingChild: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'existing' }),
      };
      const childSet: ChildSet = [existingChild];
      const newChild: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'new' }),
      };

      const newChildSet = appendChildToSet(childSet, newChild);

      expect(newChildSet.length).toBe(2);
      expect(newChildSet[0]).toBe(existingChild);
      expect(newChildSet[1]).toBe(newChild);
    });
  });

  describe('cloneInstance', () => {
    it('preserves children when keepChildren is true', () => {
      const child: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'child' }),
      };
      const instance: Instance = {
        children: [child],
        node: new ScatterplotLayer({ data: [], id: 'parent' }),
      };

      const cloned = cloneInstance(
        instance,
        'layer',
        {},
        { layer: instance.node },
        true, // keepChildren
        null
      );

      expect(cloned.children).toBe(instance.children);
      expect(cloned.children.length).toBe(1);
      expect(cloned.children[0]).toBe(child);
    });

    it('uses newChildSet when keepChildren is false', () => {
      const oldChild: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'old' }),
      };
      const newChild: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'new' }),
      };
      const instance: Instance = {
        children: [oldChild],
        node: new ScatterplotLayer({ data: [], id: 'parent' }),
      };
      const newChildSet: ChildSet = [newChild];

      const cloned = cloneInstance(
        instance,
        'layer',
        {},
        { layer: instance.node },
        false, // keepChildren
        newChildSet
      );

      expect(cloned.children).toBe(newChildSet);
      expect(cloned.children.length).toBe(1);
      expect(cloned.children[0]).toBe(newChild);
    });

    it('uses empty array when keepChildren is false and newChildSet is null', () => {
      const child: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'child' }),
      };
      const instance: Instance = {
        children: [child],
        node: new ScatterplotLayer({ data: [], id: 'parent' }),
      };

      const cloned = cloneInstance(
        instance,
        'layer',
        {},
        { layer: instance.node },
        false, // keepChildren
        null // newChildSet
      );

      expect(cloned.children).toEqual([]);
    });
  });

  describe('detachDeletedInstance', () => {
    it('clears children array to help GC', () => {
      const child: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'child' }),
      };
      const instance: Instance = {
        children: [child],
        node: new ScatterplotLayer({ data: [], id: 'parent' }),
      };

      detachDeletedInstance(instance);

      expect(instance.children.length).toBe(0);
    });
  });
});
