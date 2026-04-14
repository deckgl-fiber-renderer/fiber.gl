/**
 * Side-by-Side Example (v2 Migration Period)
 *
 * This demonstrates that both old and new syntaxes can coexist
 * in the same application during the v2 migration period.
 *
 * This allows gradual migration without breaking existing code.
 *
 * ⚠️ In v3, only the new <layer> syntax will be supported.
 */

import { ScatterplotLayer } from "@deck.gl/layers";
import { Deckgl } from "@deckgl-fiber-renderer/dom";
import "@deckgl-fiber-renderer/reconciler/side-effects";

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

const OLD_STYLE_DATA: DataPoint[] = [
  { color: [255, 0, 0], position: [-122.45, 37.8], size: 100 },
  { color: [0, 255, 0], position: [-122.42, 37.78], size: 200 },
];

const NEW_STYLE_DATA: DataPoint[] = [
  { color: [0, 0, 255], position: [-122.38, 37.76], size: 150 },
  { color: [255, 255, 0], position: [-122.35, 37.74], size: 180 },
];

export function SideBySideExample() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Deckgl controller initialViewState={INITIAL_VIEW_STATE}>
        {/* Old syntax (deprecated) - still works in v2 */}
        <scatterplotLayer
          id="old-scatter"
          data={OLD_STYLE_DATA}
          getPosition={(d) => d.position}
          getRadius={(d) => d.size}
          getFillColor={(d) => d.color}
          radiusMinPixels={3}
          radiusMaxPixels={30}
        />

        {/* New syntax - recommended */}
        <layer
          layer={
            new ScatterplotLayer<DataPoint>({
              data: NEW_STYLE_DATA,
              getFillColor: (d) => d.color,
              getPosition: (d) => d.position,
              getRadius: (d) => d.size,
              id: "new-scatter",
              radiusMaxPixels: 30,
              radiusMinPixels: 3,
            })
          }
        />

        {/* Both syntaxes render correctly in the same scene */}
        <geoJsonLayer
          id="background-old"
          data="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson"
          stroked={false}
          filled
          getFillColor={[200, 200, 200, 30]}
        />
      </Deckgl>
    </div>
  );
}
