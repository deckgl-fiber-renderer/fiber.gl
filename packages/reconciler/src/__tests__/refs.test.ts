import { MapView } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { describe, expect, it } from 'vitest';

import { getPublicInstance } from '../config';
import type { Instance } from '../types';

describe('refs', () => {
  describe('getPublicInstance', () => {
    it('returns actual Layer instance with deck.gl methods', () => {
      const layer = new ScatterplotLayer({
        data: [],
        id: 'test-layer',
      });

      const instance: Instance = {
        children: [],
        node: layer,
      };

      const publicInstance = getPublicInstance(instance);

      // Should return the actual layer, not the wrapper
      expect(publicInstance).toBe(layer);

      // Should have deck.gl Layer properties and methods
      expect(publicInstance).toHaveProperty('id');
      expect(publicInstance).toHaveProperty('props');
      expect(publicInstance.clone).toBeTypeOf('function');
    });

    it('returns actual View instance', () => {
      const view = new MapView({
        id: 'test-view',
      });

      const instance: Instance = {
        children: [],
        node: view,
      };

      const publicInstance = getPublicInstance(instance);

      // Should return the actual view, not the wrapper
      expect(publicInstance).toBe(view);

      // Should have deck.gl View properties
      expect(publicInstance).toHaveProperty('id');
    });
  });
});
