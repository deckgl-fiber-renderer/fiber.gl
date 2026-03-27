'use client';
import { OrthographicView } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Deckgl } from '@deckgl-fiber-renderer/dom';
import * as d3 from 'd3';

const COLOR = [255, 255, 255, 155] as const;

const INITIAL_VIEW_STATE = {
  maxZoom: 40,
  minZoom: -2,
  target: [500, 500, 0],
  zoom: 0,
};

const nodes = (async () => {
  const resp = await fetch(
    'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/world-countries.json'
  );
  const data = await resp.json();
  const tree = d3.hierarchy(data).sum((d) => d.population);
  const pack = d3.pack().size([1000, 1000]).padding(3);
  return pack(tree).leaves();
})();

export function DeckglExample(props) {
  return (
    <Deckgl debug initialViewState={INITIAL_VIEW_STATE}>
      <view
        view={
          new OrthographicView({
            controller: true,
            flipY: false,
            id: 'main',
          })
        }
      >
        <layer
          layer={
            new ScatterplotLayer({
              data: nodes,
              getFillColor: COLOR,
              getLineWidth: 1,
              getPosition: (d) => [d.x, d.y],
              getRadius: (d) => d.r,
              id: 'circles',
              lineWidthUnits: 'pixels',
              stroked: true,
            })
          }
        />
      </view>
    </Deckgl>
  );
}
