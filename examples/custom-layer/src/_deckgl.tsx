'use client';
import { Deckgl, useDeckgl } from '@deckgl-fiber-renderer/dom';
import { useCallback, useEffect } from 'react';

import { CustomLayer } from './_layer';
import { connect } from './_maplibre';
import { selectors, useStore } from './_store';

const COLOR = [255, 255, 255, 155] as const;
const HOVER_COLOR = [255, 0, 0, 255] as const;

const PARAMETERS = {
  blend: true,
  blendAlphaDstFactor: 'one-minus-src-alpha',
  blendAlphaOperation: 'add',
  blendAlphaSrcFactor: 'one',
  blendColorDstFactor: 'one-minus-src-alpha',
  blendColorOperation: 'add',
  blendColorSrcFactor: 'src-alpha',
  depthBias: 0,
  depthCompare: 'always',
  depthTest: false,
  depthWriteEnabled: true,
} as const;

export function DeckglExample(props) {
  const { data } = props;
  const deckglInstance = useDeckgl();
  const index = useStore(selectors.index);
  const setIndex = useStore(selectors.setIndex);

  const onHover = useCallback(
    (pickInfo) => {
      pickInfo.picked ? setIndex(pickInfo.index) : setIndex(-1);
    },
    [setIndex]
  );

  useEffect(() => {
    if (deckglInstance) {
      const removeMaplibre = connect(deckglInstance);

      return () => removeMaplibre();
    }
  }, [deckglInstance]);

  return (
    <div id="maplibre">
      <Deckgl debug interleaved parameters={PARAMETERS}>
        {/* Custom layers work directly with new <layer> element - no registration needed! */}
        <layer
          layer={
            new CustomLayer({
              autoHighlight: true,
              data: data.features,
              filled: true,
              getFillColor: COLOR,
              getPosition: (feature) => feature.geometry.coordinates,
              getRadius: 4,
              highlightColor: HOVER_COLOR,
              highlightedObjectIndex: index,
              id: 'data',
              onHover,
              pickable: true,
              radiusUnits: 'pixels',
              scaler: 3,
              stroked: false,
            })
          }
        />
      </Deckgl>
    </div>
  );
}
