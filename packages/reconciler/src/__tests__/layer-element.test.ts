import {
  FirstPersonView,
  _GlobeView,
  Layer,
  MapView,
  OrbitView,
  OrthographicView,
} from '@deck.gl/core';
import {
  GeohashLayer,
  H3ClusterLayer,
  H3HexagonLayer,
  MVTLayer,
  QuadkeyLayer,
  S2Layer,
  TerrainLayer,
  Tile3DLayer,
  TileLayer,
  TripsLayer,
  _WMSLayer,
} from '@deck.gl/geo-layers';
import {
  ArcLayer,
  BitmapLayer,
  ColumnLayer,
  GeoJsonLayer,
  GridCellLayer,
  IconLayer,
  LineLayer,
  PathLayer,
  PointCloudLayer,
  PolygonLayer,
  ScatterplotLayer,
  SolidPolygonLayer,
  TextLayer,
} from '@deck.gl/layers';
import { ScenegraphLayer, SimpleMeshLayer } from '@deck.gl/mesh-layers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createMockContainer,
  createMockHostContext,
} from '../__fixtures__/mock-deck-instance';
import { createInstance } from '../config';
import { extend } from '../extend';
import type { Props } from '../types';

// Register layers for backwards compatibility testing
extend({
  // @deck.gl/core
  MapView,
  OrthographicView,
  OrbitView,
  FirstPersonView,
  GlobeView: _GlobeView,
  // @deck.gl/layers
  ArcLayer,
  BitmapLayer,
  IconLayer,
  LineLayer,
  PointCloudLayer,
  ScatterplotLayer,
  ColumnLayer,
  GridCellLayer,
  PathLayer,
  PolygonLayer,
  GeoJsonLayer,
  TextLayer,
  SolidPolygonLayer,
  // @deck.gl/geo-layers
  S2Layer,
  QuadkeyLayer,
  TileLayer,
  TripsLayer,
  H3ClusterLayer,
  H3HexagonLayer,
  Tile3DLayer,
  TerrainLayer,
  MVTLayer,
  MvtLayer: MVTLayer,
  WMSLayer: _WMSLayer,
  WmsLayer: _WMSLayer,
  GeohashLayer,
  // @deck.gl/mesh-layers
  ScenegraphLayer,
  SimpleMeshLayer,
});

// Mock container and fiber for testing
const mockContainer = createMockContainer();
const mockHostContext = createMockHostContext();
const mockFiber = null;

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

describe('layer element', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Spy on console.warn to verify deprecation warnings
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('new <layer> element', () => {
    it('creates instance from passed layer', () => {
      const layer = new ScatterplotLayer({
        data: [],
        id: 'test-layer',
      });

      const props: Props = { layer };
      const instance = createInstance(
        'layer',
        props,
        mockContainer,
        mockHostContext,
        mockFiber
      );

      expect(instance.node).toBe(layer);
      expect(instance.children).toEqual([]);
    });

    it('throws error when layer prop is missing', () => {
      const props: Props = {};

      expect(() =>
        createInstance(
          'layer',
          props,
          mockContainer,
          mockHostContext,
          mockFiber
        )
      ).toThrow("<layer> element requires a 'layer' prop");
    });

    it('works with Layer instances', () => {
      const layer = new ScatterplotLayer({
        data: [],
        id: 'scatter',
      });

      const props: Props = { layer };
      const instance = createInstance(
        'layer',
        props,
        mockContainer,
        mockHostContext,
        mockFiber
      );

      expect(instance.node).toBeInstanceOf(Layer);
      expect(instance.node).toBe(layer);
    });

    it('works with View instances', () => {
      const view = new MapView({
        id: 'map-view',
      });

      const props: Props = { layer: view };
      const instance = createInstance(
        'layer',
        props,
        mockContainer,
        mockHostContext,
        mockFiber
      );

      expect(instance.node).toBe(view);
    });

    it('preserves layer ID through reconciliation', () => {
      const layerId = 'my-unique-layer-id';
      const layer = new ScatterplotLayer({
        data: [],
        id: layerId,
      });

      const props: Props = { layer };
      const instance = createInstance(
        'layer',
        props,
        mockContainer,
        mockHostContext,
        mockFiber
      );

      expect(instance.node.id).toBe(layerId);
    });

    it('warns when layer is missing explicit id in development', () => {
      const layer = new ScatterplotLayer({
        data: [],
        id: 'unknown',
      });

      const props: Props = { layer };
      withNodeEnv('development', () => {
        createInstance(
          'layer',
          props,
          mockContainer,
          mockHostContext,
          mockFiber
        );
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      const calls = consoleWarnSpy.mock.calls.flat().join(' ');
      expect(calls).toContain('Layer missing explicit "id" prop');
    });

    it('does not warn when layer has explicit id in development', () => {
      consoleWarnSpy.mockClear();

      const layer = new ScatterplotLayer({
        data: [],
        id: 'test-layer',
      });

      const props: Props = { layer };
      withNodeEnv('development', () => {
        createInstance(
          'layer',
          props,
          mockContainer,
          mockHostContext,
          mockFiber
        );
      });

      const calls = consoleWarnSpy.mock.calls.flat().join(' ');
      expect(calls).not.toContain('Layer missing explicit "id" prop');
    });

    it('does not warn about missing id in production', () => {
      const layer = new ScatterplotLayer({
        data: [],
      });

      const props: Props = { layer };
      withNodeEnv('production', () => {
        createInstance(
          'layer',
          props,
          mockContainer,
          mockHostContext,
          mockFiber
        );
      });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('backwards compatibility', () => {
    it('legacy scatterplotLayer element still works', () => {
      const props: Props = {
        data: [],
        id: 'legacy-layer',
      };

      const instance = createInstance(
        'scatterplotLayer',
        props,
        mockContainer,
        mockHostContext,
        mockFiber
      );

      expect(instance.node).toBeInstanceOf(ScatterplotLayer);
      expect(instance.node.id).toBe('legacy-layer');
    });

    it('legacy mapView element still works', () => {
      const props: Props = {
        id: 'legacy-view',
      };

      const instance = createInstance(
        'mapView',
        props,
        mockContainer,
        mockHostContext,
        mockFiber
      );

      expect(instance.node).toBeInstanceOf(MapView);
    });

    it('shows deprecation warning for legacy elements in development', () => {
      const props: Props = {
        data: [],
        id: 'test',
      };

      withNodeEnv('development', () => {
        createInstance(
          'scatterplotLayer',
          props,
          mockContainer,
          mockHostContext,
          mockFiber
        );
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      const calls = consoleWarnSpy.mock.calls.flat().join(' ');
      expect(calls).toContain('deprecated <scatterplotLayer> element');
      expect(calls).toContain('Migrate to <layer layer={new ScatterplotLayer');
    });

    it('does not show deprecation warning in production', () => {
      const props: Props = {
        data: [],
        id: 'test',
      };

      withNodeEnv('production', () => {
        createInstance(
          'scatterplotLayer',
          props,
          mockContainer,
          mockHostContext,
          mockFiber
        );
      });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('both new and legacy syntaxes work in same session', () => {
      // New syntax
      const newLayer = new ScatterplotLayer({
        data: [],
        id: 'new-style',
      });
      const newInstance = createInstance(
        'layer',
        { layer: newLayer },
        mockContainer,
        mockHostContext,
        mockFiber
      );

      // Legacy syntax
      const legacyInstance = createInstance(
        'scatterplotLayer',
        {
          data: [],
          id: 'legacy-style',
        },
        mockContainer,
        mockHostContext,
        mockFiber
      );

      expect(newInstance.node).toBeInstanceOf(ScatterplotLayer);
      expect(legacyInstance.node).toBeInstanceOf(ScatterplotLayer);
      expect(newInstance.node.id).toBe('new-style');
      expect(legacyInstance.node.id).toBe('legacy-style');
    });
  });

  describe('error handling', () => {
    it('throws error for unsupported element type', () => {
      expect(() =>
        createInstance(
          'nonexistentLayer',
          {},
          mockContainer,
          mockHostContext,
          mockFiber
        )
      ).toThrow(/Unsupported element type: "nonexistentLayer"/);
    });

    it('error message includes available elements', () => {
      expect(() =>
        createInstance(
          'nonexistentLayer',
          {},
          mockContainer,
          mockHostContext,
          mockFiber
        )
      ).toThrow(/Available elements:/);
    });

    it('error message suggests side-effects import', () => {
      expect(() =>
        createInstance(
          'nonexistentLayer',
          {},
          mockContainer,
          mockHostContext,
          mockFiber
        )
      ).toThrow(/Did you forget to import side-effects/);
    });
  });
});
