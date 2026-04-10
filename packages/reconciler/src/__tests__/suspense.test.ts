import { ScatterplotLayer } from '@deck.gl/layers';
import { describe, expect, it } from 'vitest';

import {
  cloneHiddenInstance,
  cloneHiddenTextInstance,
  getSuspendedCommitReason,
  maySuspendCommitInSyncRender,
  maySuspendCommitOnUpdate,
  preloadInstance,
  requestPostPaintCallback,
  startSuspendingCommit,
  suspendInstance,
  unhideInstance,
  unhideTextInstance,
  waitForCommitToBeReady,
} from '../config';
import type { Container, Instance } from '../types';

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

  describe('Suspense lifecycle functions', () => {
    it('startSuspendingCommit returns correct state shape', () => {
      const state = startSuspendingCommit();

      expect(state).toEqual({ pendingCount: 0 });
      expect(state.pendingCount).toBe(0);
    });

    it('suspendInstance is callable and does not throw', () => {
      const state = startSuspendingCommit();
      const layer = new ScatterplotLayer({
        data: [],
        id: 'test-layer',
      });
      const instance: Instance = {
        children: [],
        node: layer,
      };

      expect(() => {
        suspendInstance(state, instance, 'scatterplotLayer', { id: 'test' });
      }).not.toThrow();
    });

    it('waitForCommitToBeReady returns null for no-op behavior', () => {
      const state = startSuspendingCommit();

      const result = waitForCommitToBeReady(state, 5000);

      expect(result).toBeNull();
    });

    it('getSuspendedCommitReason returns null', () => {
      const state = startSuspendingCommit();
      const container: Container = {
        store: {} as Container['store'],
      };

      const reason = getSuspendedCommitReason(state, container);

      expect(reason).toBeNull();
    });
  });

  describe('Suspense predicate functions', () => {
    it('maySuspendCommitOnUpdate returns false', () => {
      const result = maySuspendCommitOnUpdate(
        'scatterplotLayer',
        { data: [], id: 'test' },
        { data: [1, 2, 3], id: 'test' }
      );

      expect(result).toBe(false);
    });

    it('maySuspendCommitInSyncRender returns false', () => {
      const result = maySuspendCommitInSyncRender('scatterplotLayer', {
        id: 'test',
      });

      expect(result).toBe(false);
    });

    it('preloadInstance returns true', () => {
      const result = preloadInstance('scatterplotLayer', { id: 'test' });

      expect(result).toBe(true);
    });
  });

  describe('requestPostPaintCallback', () => {
    it('is callable and does not throw', () => {
      expect(() => {
        requestPostPaintCallback(() => {});
      }).not.toThrow();
    });

    it('callback is called after scheduling', async () => {
      let callbackCalled = false;

      requestPostPaintCallback(() => {
        callbackCalled = true;
      });

      // Initially not called
      expect(callbackCalled).toBe(false);

      // Wait for RAF + setTimeout to complete
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            resolve();
          }, 10);
        });
      });

      // Should be called by now
      expect(callbackCalled).toBe(true);
    });

    it('callback fires after requestAnimationFrame', async () => {
      const callOrder: string[] = [];

      requestAnimationFrame(() => {
        callOrder.push('raf');
      });

      requestPostPaintCallback(() => {
        callOrder.push('postPaint');
      });

      // Wait for both to complete
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            resolve();
          }, 10);
        });
      });

      // RAF should fire first, then post-paint callback
      expect(callOrder).toEqual(['raf', 'postPaint']);
    });

    it('callback receives performance.now() timestamp', async () => {
      let receivedTime: number | undefined;

      requestPostPaintCallback((time) => {
        receivedTime = time;
      });

      // Wait for callback to execute
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            resolve();
          }, 10);
        });
      });

      // Should receive a valid timestamp
      expect(receivedTime).toBeTypeOf('number');
      expect(Number.isFinite(receivedTime)).toBe(true);
      expect(receivedTime).toBeGreaterThan(0);
      // Should be reasonably close to current time (within 1 second)
      expect(Math.abs(performance.now() - receivedTime!)).toBeLessThan(1000);
    });
  });
});
