"use client";
import "client-only";
import type { Color } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";

import { useSelected } from "@/hooks/use-selected";

const COLOR: Color = [255, 255, 255];
const HIGHLIGHT_COLOR = [255, 0, 0] as const;

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
    <layer
      layer={
        new ScatterplotLayer({
          autoHighlight: true,
          data,
          getFillColor,
          getPosition,
          getRadius,
          highlightColor: HIGHLIGHT_COLOR,
          id: "airports",
          onClick,
          opacity: 0.5,
          pickable: true,
          radiusUnits: "common",
          updateTriggers: {
            getFillColor: selected,
            getRadius: selected,
          },
        })
      }
    />
  );
}
