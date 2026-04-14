"use client";
import { _GlobeView as GlobeView } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Deckgl } from "@deckgl-fiber-renderer/dom";

const COLOR = [255, 255, 255, 155] as const;
const HOVER_COLOR = [255, 0, 0, 255] as const;

const INITIAL_VIEW_STATE = {
  latitude: 38.9072,
  longitude: -77.0369,
  zoom: 4,
};

const PARAMETERS = {
  blend: true,
  blendAlphaDstFactor: "one-minus-src-alpha",
  blendAlphaOperation: "add",
  blendAlphaSrcFactor: "one",
  blendColorDstFactor: "one-minus-src-alpha",
  blendColorOperation: "add",
  blendColorSrcFactor: "src-alpha",
  cullMode: "back",
  depthBias: 0,
  depthCompare: "always",
  depthTest: false,
  depthWriteEnabled: true,
} as const;

export function DeckglExample(props) {
  const { data } = props;

  return (
    <Deckgl debug parameters={PARAMETERS} initialViewState={INITIAL_VIEW_STATE}>
      <view
        view={
          new GlobeView({
            controller: true,
            id: "main",
            resolution: 1,
          })
        }
      >
        <layer
          layer={
            new GeoJsonLayer({
              data: "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_land.geojson",
              filled: true,
              getFillColor: [30, 80, 120],
              id: "bg",
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
              getFillColor: COLOR,
              getPointRadius: 16,
              highlightColor: HOVER_COLOR,
              id: "data",
              pickable: true,
              pointRadiusUnits: "pixels",
              pointType: "circle",
              stroked: false,
            })
          }
        />
      </view>
    </Deckgl>
  );
}
