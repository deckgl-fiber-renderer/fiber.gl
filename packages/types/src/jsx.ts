import type {
  FirstPersonView,
  _GlobeView as GlobeView,
  MapView,
  OrbitView,
  OrthographicView,
  View,
} from '@deck.gl/core';
import type {
  H3ClusterLayerProps,
  H3HexagonLayerProps,
  MVTLayerProps,
  QuadkeyLayerProps,
  S2LayerProps,
  TerrainLayerProps,
  Tile3DLayerProps,
  TileLayerProps,
  GeohashLayerProps,
  GreatCircleLayerProps,
  TripsLayerProps,
  WMSLayerProps,
} from '@deck.gl/geo-layers';
import type {
  ArcLayerProps,
  BitmapLayerProps,
  ColumnLayerProps,
  GeoJsonLayerProps,
  GridCellLayerProps,
  IconLayerProps,
  LineLayerProps,
  PathLayerProps,
  PointCloudLayerProps,
  PolygonLayerProps,
  ScatterplotLayerProps,
  SolidPolygonLayerProps,
  TextLayerProps,
} from '@deck.gl/layers';
import type {
  ScenegraphLayerProps,
  SimpleMeshLayerProps,
} from '@deck.gl/mesh-layers';

type ExtractViewProps<T> = T extends View<any, infer P> ? P : never;

// TODO: allow for `children` type for React children
export interface DeckglElements {
  // @deck.gl/core
  mapView: ExtractViewProps<MapView>;
  orthographicView: ExtractViewProps<OrthographicView>;
  orbitView: ExtractViewProps<OrbitView>;
  firstPersonView: ExtractViewProps<FirstPersonView>;
  globeView: ExtractViewProps<GlobeView>;

  // @deck.gl/layers
  arcLayer: ArcLayerProps;
  bitmapLayer: BitmapLayerProps;
  iconLayer: IconLayerProps;
  lineLayer: LineLayerProps;
  pointCloudLayer: PointCloudLayerProps;
  scatterplotLayer: ScatterplotLayerProps;
  columnLayer: ColumnLayerProps;
  gridCellLayer: GridCellLayerProps;
  pathLayer: PathLayerProps;
  polygonLayer: PolygonLayerProps;
  geoJsonLayer: GeoJsonLayerProps;
  textLayer: TextLayerProps;
  solidPolygonLayer: SolidPolygonLayerProps;

  // @deck.gl/geo-layers
  s2Layer: S2LayerProps;
  quadkeyLayer: QuadkeyLayerProps;
  tileLayer: TileLayerProps;
  h3ClusterLayer: H3ClusterLayerProps;
  h3HexagonLayer: H3HexagonLayerProps;
  tile3DLayer: Tile3DLayerProps;
  terrainLayer: TerrainLayerProps;
  geohashLayer: GeohashLayerProps;
  greatCircleLayer: GreatCircleLayerProps;
  tripsLayer: TripsLayerProps;
  mVTLayer: MVTLayerProps;
  mvtLayer: MVTLayerProps; // alias
  wMSLayer: WMSLayerProps;
  wmsLayer: WMSLayerProps; // alias

  // @deck.gl/mesh-layers
  scenegraphLayer: ScenegraphLayerProps;
  simpleMeshLayer: SimpleMeshLayerProps;
}

declare global {
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
      interface IntrinsicElements extends DeckglElements {}
    }
  }
}
