import { Map as MapLibre } from 'maplibre-gl';
import { INITIAL_VIEW_STATE, MAP_STYLE } from './constants';

export function connect(deckgl) {
  const map = new MapLibre({
    container: 'maplibre',
    style: MAP_STYLE,
    center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
    zoom: INITIAL_VIEW_STATE.zoom,
    doubleClickZoom: false,
    dragRotate: false,
    pitchWithRotate: false,
    rollEnabled: false,
    attributionControl: false,
  });

  map.once('style.load', () => {
    map.setProjection({ type: 'globe' });
  });

  map.once('load', () => {
    map.addControl(deckgl);
  });

  return () => {
    map.removeControl(deckgl);
    map.remove();
  };
}
