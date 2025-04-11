'use client';
import { useCallback, useEffect } from 'react';
import { CompassWidget, FullscreenWidget } from '@deck.gl/widgets';
import { Deckgl, useDeckgl } from '@deckgl-fiber-renderer/dom';
import { connect } from './_maplibre';
import { useStore, selectors } from './_store';

const COLOR = [255, 255, 255, 155];
const HOVER_COLOR = [255, 0, 0, 255];

const PARAMETERS = {
  depthWriteEnabled: true,
  depthCompare: 'always',
  depthBias: 0,
  blend: true,
  depthTest: false,
  blendColorSrcFactor: 'src-alpha',
  blendColorDstFactor: 'one-minus-src-alpha',
  blendAlphaSrcFactor: 'one',
  blendAlphaDstFactor: 'one-minus-src-alpha',
  blendColorOperation: 'add',
  blendAlphaOperation: 'add',
};

const WIDGETS = [
  new FullscreenWidget({ id: 'fullscreen' }),
  new CompassWidget({
    id: 'compass',
  }),
];

export function DeckglExample(props) {
  const { data } = props;
  const deckglInstance = useDeckgl();
  const index = useStore(selectors.index);
  const setIndex = useStore(selectors.setIndex);

  const onHover = useCallback((pickInfo) => {
    pickInfo.picked ? setIndex(pickInfo.index) : setIndex(-1);
  });

  useEffect(() => {
    if (deckglInstance) {
      const removeMaplibre = connect(deckglInstance);

      return () => removeMaplibre();
    }
  }, [deckglInstance]);

  return (
    <div id="maplibre">
      <Deckgl debug interleaved parameters={PARAMETERS} widgets={WIDGETS}>
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
