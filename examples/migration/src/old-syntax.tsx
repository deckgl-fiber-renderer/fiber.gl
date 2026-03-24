/**
 * Legacy Syntax Example (v1)
 *
 * This demonstrates the old intrinsic element pattern using
 * JSX elements like <scatterplotLayer> and <geoJsonLayer>.
 *
 * ⚠️ This syntax is deprecated and will be removed in v3.
 */

import { Deckgl } from '@deckgl-fiber-renderer/dom';
import '@deckgl-fiber-renderer/reconciler/side-effects';

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

export function OldSyntaxExample() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Deckgl controller initialViewState={INITIAL_VIEW_STATE}>
        {/* Legacy syntax: layer-specific intrinsic elements */}
        <scatterplotLayer
          id="scatter-old"
          data={SAMPLE_DATA}
          getPosition={(d) => d.position}
          getRadius={(d) => d.size}
          getFillColor={(d) => d.color}
          radiusMinPixels={3}
          radiusMaxPixels={30}
        />

        <geoJsonLayer
          id="geojson-old"
          data="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson"
          stroked
          filled
          lineWidthMinPixels={1}
          getFillColor={[160, 160, 180, 50]}
          getLineColor={[255, 255, 255, 100]}
        />
      </Deckgl>
    </div>
  );
}
