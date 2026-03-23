"use client";
import { Deckgl } from "@deckgl-fiber-renderer/dom";
import { PLYLoader } from "@loaders.gl/ply";

const COLOR = [255, 255, 255];

const INITIAL_VIEW_STATE = {
  maxRotationX: 90,
  maxZoom: 10,
  minRotationX: -90,
  minZoom: -10,
  rotationOrbit: 145,
  rotationX: 65,
  target: [0, 175, 0],
  zoom: -0.5,
};

export function DeckglExample(props) {
  return (
    <Deckgl debug initialViewState={INITIAL_VIEW_STATE}>
      <orbitView id="main" controller orbitAxis="Y">
        <simpleMeshLayer
          id="mesh"
          data={[0]}
          mesh="https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/point-cloud-ply/lucy100k.ply"
          getColor={COLOR}
          loaders={[PLYLoader]}
        />
      </orbitView>
    </Deckgl>
  );
}
