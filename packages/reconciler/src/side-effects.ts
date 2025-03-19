import {
  FirstPersonView,
  _GlobeView as GlobeView,
  MapView,
  OrbitView,
  OrthographicView,
} from '@deck.gl/core';
import {
  GeohashLayer,
  H3ClusterLayer,
  H3HexagonLayer,
  MVTLayer,
  QuadkeyLayer,
  S2Layer,
  TerrainLayer,
  Tile3DLayer,
  TileLayer,
  TripsLayer,
  _WMSLayer as WMSLayer,
} from '@deck.gl/geo-layers';
import {
  ArcLayer,
  BitmapLayer,
  ColumnLayer,
  GeoJsonLayer,
  GridCellLayer,
  IconLayer,
  LineLayer,
  PathLayer,
  PointCloudLayer,
  PolygonLayer,
  ScatterplotLayer,
  SolidPolygonLayer,
  TextLayer,
} from '@deck.gl/layers';
import { ScenegraphLayer, SimpleMeshLayer } from '@deck.gl/mesh-layers';
import { extend } from './extend';

// IDEA: we can technically move this purely to userland so that a user is defining precisely
// the layers they are intending to use in their app. May help out with bundle size for a
// tradeoff on developer experience / maintainability.
extend({
  // @deck.gl/core
  MapView,
  OrthographicView,
  OrbitView,
  FirstPersonView,
  GlobeView,
  // @deck.gl/layers
  ArcLayer,
  BitmapLayer,
  IconLayer,
  LineLayer,
  PointCloudLayer,
  ScatterplotLayer,
  ColumnLayer,
  GridCellLayer,
  PathLayer,
  PolygonLayer,
  GeoJsonLayer,
  TextLayer,
  SolidPolygonLayer,
  // @deck.gl/geo-layers
  S2Layer,
  QuadkeyLayer,
  TileLayer,
  TripsLayer,
  H3ClusterLayer,
  H3HexagonLayer,
  Tile3DLayer,
  TerrainLayer,
  MVTLayer,
  MvtLayer: MVTLayer, // alias
  WMSLayer,
  WmsLayer: WMSLayer, // alias
  GeohashLayer,
  // @deck.gl/mesh-layers
  ScenegraphLayer,
  SimpleMeshLayer,
});
