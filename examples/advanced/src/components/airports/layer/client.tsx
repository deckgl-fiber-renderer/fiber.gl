'use client';
import 'client-only';
import { useSelected } from '@/hooks/use-selected';
import type { Color } from '@deck.gl/core';

const COLOR: Color = [255, 255, 255];
const HIGHLIGHT_COLOR = [255, 0, 0];

function getPosition(obj) {
  return [obj.geometry.x, obj.geometry.y];
}

export function AirportsLayerClient(props) {
  const { data } = props;
  const [selected, setSelected] = useSelected();

  function onClick(pickInfo) {
    setSelected(pickInfo.object?.attributes?.GLOBAL_ID);
  }

  function getRadius(obj) {
    if (obj.attributes.GLOBAL_ID === selected) {
      return 1;
    }

    return 0.4;
  }

  function getFillColor(obj) {
    if (obj.attributes.GLOBAL_ID === selected) {
      return HIGHLIGHT_COLOR;
    }

    return COLOR;
  }

  return (
    <scatterplotLayer
      id="airports"
      data={data}
      radiusUnits="common"
      pickable
      autoHighlight
      highlightColor={HIGHLIGHT_COLOR}
      onClick={onClick}
      getPosition={getPosition}
      getRadius={getRadius}
      getFillColor={getFillColor}
      opacity={0.5}
      updateTriggers={{
        getFillColor: [selected],
        getRadius: [selected],
      }}
    />
  );
}
