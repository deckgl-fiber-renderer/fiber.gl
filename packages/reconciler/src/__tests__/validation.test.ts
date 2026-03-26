import { MapView } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createMockContainer,
  createMockHostContext,
} from '../__fixtures__/mock-deck-instance';
import { createInstance, finalizeContainerChildren } from '../config';
import type { Instance } from '../types';

// Helper to run code in a specific NODE_ENV
function withNodeEnv<T>(env: string, fn: () => T): T {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = env;
  try {
    return fn();
  } finally {
    process.env.NODE_ENV = originalEnv;
  }
}

describe('validation', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('layer ID validation', () => {
    const mockContainer = createMockContainer();
    const mockHostContext = createMockHostContext();

    it("shows warning when layer ID is 'unknown'", () => {
      const layer = new ScatterplotLayer({
        data: [],
        id: 'unknown',
      });

      withNodeEnv('development', () => {
        createInstance(
          'layer',
          { layer },
          mockContainer,
          mockHostContext,
          null
        );
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Layer missing explicit "id" prop')
      );
    });

    it("doesn't show warning when layer has valid ID", () => {
      const layer = new ScatterplotLayer({
        data: [],
        id: 'valid-id',
      });

      withNodeEnv('development', () => {
        createInstance(
          'layer',
          { layer },
          mockContainer,
          mockHostContext,
          null
        );
      });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('only runs validation in development mode', () => {
      const layer = new ScatterplotLayer({
        data: [],
        id: 'unknown',
      });

      withNodeEnv('production', () => {
        createInstance(
          'layer',
          { layer },
          mockContainer,
          mockHostContext,
          null
        );
      });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('duplicate ID detection', () => {
    const mockContainer = createMockContainer();

    it('triggers error when duplicate IDs are present', () => {
      const layer1: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'duplicate-id' }),
      };
      const layer2: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'duplicate-id' }),
      };

      withNodeEnv('development', () => {
        finalizeContainerChildren(mockContainer, [layer1, layer2]);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Duplicate layer IDs detected')
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('duplicate-id')
      );
    });

    it("doesn't trigger error when IDs are unique", () => {
      const layer1: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'unique-id-1' }),
      };
      const layer2: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'unique-id-2' }),
      };

      withNodeEnv('development', () => {
        finalizeContainerChildren(mockContainer, [layer1, layer2]);
      });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('only runs validation in development mode', () => {
      const layer1: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'duplicate-id' }),
      };
      const layer2: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'duplicate-id' }),
      };

      withNodeEnv('production', () => {
        finalizeContainerChildren(mockContainer, [layer1, layer2]);
      });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('excludes Views from duplicate ID check', () => {
      const view1: Instance = {
        children: [],
        node: new MapView({ id: 'map-view' }),
      };
      const view2: Instance = {
        children: [],
        node: new MapView({ id: 'map-view' }),
      };

      withNodeEnv('development', () => {
        finalizeContainerChildren(mockContainer, [view1, view2]);
      });

      // Views should not trigger duplicate ID errors
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('enhanced error messages', () => {
    const mockContainer = createMockContainer();
    const mockHostContext = createMockHostContext();

    it('includes available elements in error message', () => {
      expect(() => {
        createInstance(
          'nonExistentLayer',
          {},
          mockContainer,
          mockHostContext,
          null
        );
      }).toThrow(/Available elements:/);
    });

    it('suggests side-effects import in error message', () => {
      expect(() => {
        createInstance(
          'nonExistentLayer',
          {},
          mockContainer,
          mockHostContext,
          null
        );
      }).toThrow(/Did you forget to import side-effects/);
    });
  });
});
