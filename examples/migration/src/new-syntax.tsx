/**
 * New Syntax Example (v2+)
 *
 * This demonstrates the new <layer> element pattern where you
 * pass pre-instantiated Deck.gl layer instances.
 *
 * Benefits:
 * - Full TypeScript generic support for type-safe accessor functions
 * - Code-splitting and tree-shaking (only import layers you use)
 * - No layer registration needed (no extend() or side-effects import)
 * - Works with custom layers out of the box
 */

import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { Deckgl } from '@deckgl-fiber-renderer/dom';

const INITIAL_VIEW_STATE = {
  latitude: 37.7749,
  longitude: -122.4194,
  pitch: 0,
  zoom: 11,
};

interface DataPoint {
  position: [number, number];
  size: number;
  color: [number, number, number];
}

const SAMPLE_DATA: DataPoint[] = [
  { color: [255, 0, 0], position: [-122.45, 37.8], size: 100 },
  { color: [0, 255, 0], position: [-122.42, 37.78], size: 200 },
  { color: [0, 0, 255], position: [-122.38, 37.76], size: 150 },
];

export function NewSyntaxExample() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Deckgl controller initialViewState={INITIAL_VIEW_STATE}>
        {/* New syntax: single <layer> element with pre-instantiated layers */}
        <layer
          layer={
            new ScatterplotLayer<DataPoint>({
              id: 'scatter-new',
              data: SAMPLE_DATA,
              getPosition: (d) => d.position, // ✅ TypeScript knows 'd' is DataPoint
              getRadius: (d) => d.size,
              getFillColor: (d) => d.color,
              radiusMinPixels: 3,
              radiusMaxPixels: 30,
            })
          }
        />

        <layer
          layer={
            new GeoJsonLayer({
              data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson',
              filled: true,
              getFillColor: [160, 160, 180, 50],
              getLineColor: [255, 255, 255, 100],
              id: 'geojson-new',
              lineWidthMinPixels: 1,
              stroked: true,
            })
          }
        />
      </Deckgl>
    </div>
  );
}
