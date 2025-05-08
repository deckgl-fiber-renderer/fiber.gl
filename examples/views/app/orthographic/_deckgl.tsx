'use client';
import { Deckgl } from '@deckgl-fiber-renderer/dom';
import * as d3 from 'd3';

const COLOR = [255, 255, 255, 155];

const INITIAL_VIEW_STATE = {
  target: [500, 500, 0],
  zoom: 0,
  minZoom: -2,
  maxZoom: 40,
};

const nodes = (async () => {
  const resp = await fetch(
    'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/world-countries.json',
  );
  const data = await resp.json();
  const tree = d3.hierarchy(data).sum((d) => d.population);
  const pack = d3.pack().size([1000, 1000]).padding(3);
  return pack(tree).leaves();
})();

export function DeckglExample(props) {
  return (
    <Deckgl debug initialViewState={INITIAL_VIEW_STATE}>
      <orthographicView id="main" controller flipY={false}>
        <scatterplotLayer
          id="circles"
          data={nodes}
          getPosition={(d) => [d.x, d.y]}
          getRadius={(d) => d.r}
          getLineWidth={1}
          lineWidthUnits="pixels"
          stroked={true}
          getFillColor={COLOR}
        />
      </orthographicView>
    </Deckgl>
  );
}
