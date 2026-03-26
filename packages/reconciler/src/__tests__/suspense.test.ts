import { ScatterplotLayer } from '@deck.gl/layers';
import { describe, expect, it } from 'vitest';

import {
  cloneHiddenInstance,
  cloneHiddenTextInstance,
  unhideInstance,
  unhideTextInstance,
} from '../config';
import type { Instance } from '../types';

describe('suspense', () => {
  describe('cloneHiddenInstance', () => {
    it('returns instance with same structure', () => {
      const layer = new ScatterplotLayer({
        data: [],
        id: 'test-layer',
      });
      const child: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'child' }),
      };
      const instance: Instance = {
        children: [child],
        node: layer,
      };

      const hidden = cloneHiddenInstance(instance, 'layer', { layer });

      // Should preserve node and children references
      expect(hidden.node).toBe(layer);
      expect(hidden.children).toBe(instance.children);
      expect(hidden.children.length).toBe(1);
      expect(hidden.children[0]).toBe(child);
    });
  });

  describe('unhideInstance', () => {
    it('is a no-op that maintains API compatibility with React reconciler', () => {
      // deck.gl layers don't have a concept of "hidden" state
      // This function exists for React reconciler API compatibility
      const layer = new ScatterplotLayer({
        data: [],
        id: 'test-layer',
      });
      const instance: Instance = {
        children: [],
        node: layer,
      };

      // Verify function exists and doesn't throw
      expect(() => {
        unhideInstance(instance, { layer });
      }).not.toThrow();

      // Verify instance structure is unchanged (no-op behavior)
      expect(instance.node).toBe(layer);
      expect(instance.children).toEqual([]);
    });
  });

  describe('text instance methods', () => {
    it('cloneHiddenTextInstance throws with helpful error', () => {
      const instance: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'test' }),
      };

      expect(() => {
        cloneHiddenTextInstance(instance);
      }).toThrow('Text nodes are not supported in deck.gl renderer');
    });

    it('unhideTextInstance throws with helpful error', () => {
      const instance: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'test' }),
      };

      expect(() => {
        unhideTextInstance(instance, 'text');
      }).toThrow('Text nodes are not supported in deck.gl renderer');
    });
  });
});
