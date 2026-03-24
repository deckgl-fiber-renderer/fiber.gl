import { MapView } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createInstance, finalizeContainerChildren } from '../config';
import type { Container, HostContext, Instance } from '../types';

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
    const mockContainer: Container = { store: {} as any };
    const mockHostContext: HostContext = { store: {} as any };

    it("shows warning when layer ID is 'unknown'", () => {
      const layer = new ScatterplotLayer({
        data: [],
        id: 'unknown',
      });

      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      createInstance('layer', { layer }, mockContainer, mockHostContext, null);

      process.env.NODE_ENV = originalEnv;

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Layer missing explicit "id" prop')
      );
    });

    it("doesn't show warning when layer has valid ID", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const layer = new ScatterplotLayer({
        data: [],
        id: 'valid-id',
      });

      createInstance('layer', { layer }, mockContainer, mockHostContext, null);

      process.env.NODE_ENV = originalEnv;

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('only runs validation in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const layer = new ScatterplotLayer({
        data: [],
        id: 'unknown',
      });

      createInstance('layer', { layer }, mockContainer, mockHostContext, null);

      process.env.NODE_ENV = originalEnv;

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('duplicate ID detection', () => {
    const mockContainer: Container = { store: {} as any };

    it('triggers error when duplicate IDs are present', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const layer1: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'duplicate-id' }),
      };
      const layer2: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'duplicate-id' }),
      };

      finalizeContainerChildren(mockContainer, [layer1, layer2]);

      process.env.NODE_ENV = originalEnv;

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Duplicate layer IDs detected')
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('duplicate-id')
      );
    });

    it("doesn't trigger error when IDs are unique", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const layer1: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'unique-id-1' }),
      };
      const layer2: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'unique-id-2' }),
      };

      finalizeContainerChildren(mockContainer, [layer1, layer2]);

      process.env.NODE_ENV = originalEnv;

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('only runs validation in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const layer1: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'duplicate-id' }),
      };
      const layer2: Instance = {
        children: [],
        node: new ScatterplotLayer({ data: [], id: 'duplicate-id' }),
      };

      finalizeContainerChildren(mockContainer, [layer1, layer2]);

      process.env.NODE_ENV = originalEnv;

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('excludes Views from duplicate ID check', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const view1: Instance = {
        children: [],
        node: new MapView({ id: 'map-view' }),
      };
      const view2: Instance = {
        children: [],
        node: new MapView({ id: 'map-view' }),
      };

      finalizeContainerChildren(mockContainer, [view1, view2]);

      process.env.NODE_ENV = originalEnv;

      // Views should not trigger duplicate ID errors
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('enhanced error messages', () => {
    const mockContainer: Container = { store: {} as any };
    const mockHostContext: HostContext = { store: {} as any };

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
