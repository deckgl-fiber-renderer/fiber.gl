import MapLibreLib from 'maplibre-gl';
const { Map: MapLibre } = MapLibreLib;

const INITIAL_VIEW_STATE = {
  longitude: -77.0369,
  latitude: 38.9072,
  zoom: 4,
  minZoom: 1,
  maxZoom: 22,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE =
  'https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

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
