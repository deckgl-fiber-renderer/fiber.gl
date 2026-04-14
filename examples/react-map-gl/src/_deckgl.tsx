"use client";
import { Deckgl, useDeckgl } from "@deckgl-fiber-renderer/dom";
import { useCallback } from "react";
import { Map as MapLibre, NavigationControl, useControl } from "react-map-gl/maplibre";

import { useStore, selectors } from "./_store";

const COLOR = [255, 255, 255, 155];
const HOVER_COLOR = [255, 0, 0, 255];

const INITIAL_VIEW_STATE = {
  latitude: 38.9072,
  longitude: -77.0369,
  zoom: 4,
};

const MAP_STYLE = "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const PARAMETERS = {
  blend: true,
  blendAlphaDstFactor: "one-minus-src-alpha",
  blendAlphaOperation: "add",
  blendAlphaSrcFactor: "one",
  blendColorDstFactor: "one-minus-src-alpha",
  blendColorOperation: "add",
  blendColorSrcFactor: "src-alpha",
  depthBias: 0,
  depthCompare: "always",
  depthTest: false,
  depthWriteEnabled: true,
};

// NOTE: render this as a child of `<Deckgl />` so that we can grab the deck.gl instance
function AddDeckglControl() {
  const deckglInstance = useDeckgl();
  useControl(() => deckglInstance);

  return null;
}

function DeckglMap(props) {
  const { data } = props;

  const index = useStore(selectors.index);
  const setIndex = useStore(selectors.setIndex);

  const onHover = useCallback((pickInfo) => {
    pickInfo.picked ? setIndex(pickInfo.index) : setIndex(-1);
  }, []);

  return (
    // NOTE: make sure to supply `interleaved` prop so a DeckglOverlay instance is created internally
    <Deckgl debug interleaved parameters={PARAMETERS}>
      <AddDeckglControl />
      <geoJsonLayer
        id="data"
        data={data}
        pointRadiusUnits="pixels"
        getPointRadius={16}
        autoHighlight
        highlightedObjectIndex={index}
        pickable
        pointType="circle"
        filled
        stroked={false}
        getFillColor={COLOR}
        highlightColor={HOVER_COLOR}
        onHover={onHover}
      />
    </Deckgl>
  );
}

export function DeckglExample(props) {
  const { data } = props;

  return (
    <MapLibre initialViewState={INITIAL_VIEW_STATE} mapStyle={MAP_STYLE}>
      <DeckglMap data={data} />
      <NavigationControl position="top-left" />
    </MapLibre>
  );
}
