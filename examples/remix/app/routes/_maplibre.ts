import MapLibreLib from "maplibre-gl";
const { Map: MapLibre } = MapLibreLib;

const INITIAL_VIEW_STATE = {
  latitude: 38.9072,
  longitude: -77.0369,
  zoom: 4,
};

const MAP_STYLE =
  "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export function connect(deckgl) {
  const map = new MapLibre({
    center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
    container: "maplibre",
    style: MAP_STYLE,
    zoom: INITIAL_VIEW_STATE.zoom,
  });

  map.once("style.load", () => {
    map.setProjection({ type: "globe" });
  });

  map.once("load", () => {
    map.addControl(deckgl);
  });

  return () => {
    map.removeControl(deckgl);
    map.remove();
  };
}
