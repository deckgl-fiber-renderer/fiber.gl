"use client";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Deckgl } from "@deckgl-fiber-renderer/dom";

const INITIAL_VIEW_STATE = {
  latitude: 38.9072,
  longitude: -77.0369,
  zoom: 4,
};

export function DeckglExample(props) {
  const { data } = props;

  return (
    <>
      <Deckgl debug controller initialViewState={INITIAL_VIEW_STATE}>
        <layer
          layer={
            new GeoJsonLayer({
              data: "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_land.geojson",
              filled: true,
              getFillColor: [30, 80, 120],
              id: "basemap",
              opacity: 0.1,
              stroked: false,
            })
          }
        />
        <layer
          layer={
            new GeoJsonLayer({
              autoHighlight: true,
              data,
              filled: true,
              getFillColor: [255, 255, 255, 155],
              getPointRadius: 16,
              highlightColor: [255, 0, 0, 255],
              id: "data",
              pickable: true,
              pointRadiusUnits: "pixels",
              pointType: "circle",
              stroked: false,
            })
          }
        />
      </Deckgl>
    </>
  );
}
