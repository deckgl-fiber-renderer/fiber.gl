"use client";
import { Deckgl } from "@deckgl-fiber-renderer/dom";

const COLOR = [255, 255, 255, 155];
const HOVER_COLOR = [255, 0, 0, 255];

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
};

export function DeckglExample(props) {
  const { data } = props;

  return (
    <Deckgl debug parameters={PARAMETERS} initialViewState={INITIAL_VIEW_STATE}>
      <globeView id="main" controller={true} resolution={1}>
        <geoJsonLayer
          id="bg"
          data="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_land.geojson"
          stroked={false}
          filled={true}
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
          getFillColor={COLOR}
          highlightColor={HOVER_COLOR}
        />
      </globeView>
    </Deckgl>
  );
}
