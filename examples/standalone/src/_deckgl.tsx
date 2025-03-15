'use client';
import { Deckgl } from '@deckgl-fiber-renderer/dom';

const INITIAL_VIEW_STATE = {
  longitude: -77.0369,
  latitude: 38.9072,
  zoom: 4,
};

export function DeckglExample(props) {
  const { data } = props;

  return (
    <>
      <Deckgl debug controller initialViewState={INITIAL_VIEW_STATE}>
        <geoJsonLayer
          id="basemap"
          data="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_land.geojson"
          stroked={false}
          filled
          opacity={0.1}
          getFillColor={[30, 80, 120]}
        />
        <geoJsonLayer
          id="data"
          data={data}
          pointRadiusUnits="pixels"
          getPointRadius={16}
          autoHighlight
          pickable
          pointType="circle"
          filled
          stroked={false}
          getFillColor={[255, 255, 255, 155]}
          highlightColor={[255, 0, 0, 255]}
        />
      </Deckgl>
    </>
  );
}
