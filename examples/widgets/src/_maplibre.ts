import { Map as MapLibre } from 'maplibre-gl';

const INITIAL_VIEW_STATE = {
  longitude: -77.0369,
  latitude: 38.9072,
  zoom: 4,
};

const MAP_STYLE =
  'https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export function connect(deckgl) {
  const map = new MapLibre({
    container: 'maplibre',
    style: MAP_STYLE,
    center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
    zoom: INITIAL_VIEW_STATE.zoom,
  });

  map.once('load', () => {
    map.addControl(deckgl);
  });

  return () => {
    map.removeControl(deckgl);
    map.remove();
  };
}
