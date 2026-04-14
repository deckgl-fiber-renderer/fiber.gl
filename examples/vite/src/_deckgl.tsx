"use client";
import { Deckgl, useDeckgl } from "@deckgl-fiber-renderer/dom";
import { useCallback, useEffect } from "react";

import { connect } from "./_maplibre";
import { useStore, selectors } from "./_store";

const COLOR = [255, 255, 255, 155];
const HOVER_COLOR = [255, 0, 0, 255];

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

export function DeckglExample(props) {
  const { data } = props;
  const deckglInstance = useDeckgl();
  const index = useStore(selectors.index);
  const setIndex = useStore(selectors.setIndex);

  const onHover = useCallback((pickInfo) => {
    pickInfo.picked ? setIndex(pickInfo.index) : setIndex(-1);
  }, []);

  useEffect(() => {
    if (deckglInstance) {
      const removeMaplibre = connect(deckglInstance);

      return () => removeMaplibre();
    }
  }, [deckglInstance]);

  return (
    <div id="maplibre">
      <Deckgl debug interleaved parameters={PARAMETERS}>
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
    </div>
  );
}
