import type {
  FirstPersonView,
  _GlobeView as GlobeView,
  Layer,
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
import type { ReactNode } from 'react';

type ExtractViewProps<T> = T extends View<any, infer P> ? P : never;

export interface DeckglElements {
  // Universal layer element (new in v2)
  layer: {
    layer: Layer;
    children?: ReactNode;
  };

  // View element (new in v2)
  view: {
    view: View;
    children?: ReactNode;
  };

  // @deck.gl/core
  /** @deprecated Use <view view={new MapView({...})} /> instead */
  mapView: ExtractViewProps<MapView> & { children: ReactNode };
  /** @deprecated Use <view view={new OrthographicView({...})} /> instead */
  orthographicView: ExtractViewProps<OrthographicView> & {
    children: ReactNode;
  };
  /** @deprecated Use <view view={new OrbitView({...})} /> instead */
  orbitView: ExtractViewProps<OrbitView> & { children: ReactNode };
  /** @deprecated Use <view view={new FirstPersonView({...})} /> instead */
  firstPersonView: ExtractViewProps<FirstPersonView> & { children: ReactNode };
  /** @deprecated Use <view view={new GlobeView({...})} /> instead */
  globeView: ExtractViewProps<GlobeView> & { children: ReactNode };

  // @deck.gl/layers
  /** @deprecated Use <layer layer={new ArcLayer({...})} /> instead */
  arcLayer: ArcLayerProps;
  /** @deprecated Use <layer layer={new BitmapLayer({...})} /> instead */
  bitmapLayer: BitmapLayerProps;
  /** @deprecated Use <layer layer={new IconLayer({...})} /> instead */
  iconLayer: IconLayerProps;
  /** @deprecated Use <layer layer={new LineLayer({...})} /> instead */
  lineLayer: LineLayerProps;
  /** @deprecated Use <layer layer={new PointCloudLayer({...})} /> instead */
  pointCloudLayer: PointCloudLayerProps;
  /** @deprecated Use <layer layer={new ScatterplotLayer({...})} /> instead */
  scatterplotLayer: ScatterplotLayerProps;
  /** @deprecated Use <layer layer={new ColumnLayer({...})} /> instead */
  columnLayer: ColumnLayerProps;
  /** @deprecated Use <layer layer={new GridCellLayer({...})} /> instead */
  gridCellLayer: GridCellLayerProps;
  /** @deprecated Use <layer layer={new PathLayer({...})} /> instead */
  pathLayer: PathLayerProps;
  /** @deprecated Use <layer layer={new PolygonLayer({...})} /> instead */
  polygonLayer: PolygonLayerProps;
  /** @deprecated Use <layer layer={new GeoJsonLayer({...})} /> instead */
  geoJsonLayer: GeoJsonLayerProps;
  /** @deprecated Use <layer layer={new TextLayer({...})} /> instead */
  textLayer: TextLayerProps;
  /** @deprecated Use <layer layer={new SolidPolygonLayer({...})} /> instead */
  solidPolygonLayer: SolidPolygonLayerProps;

  // @deck.gl/geo-layers
  /** @deprecated Use <layer layer={new S2Layer({...})} /> instead */
  s2Layer: S2LayerProps;
  /** @deprecated Use <layer layer={new QuadkeyLayer({...})} /> instead */
  quadkeyLayer: QuadkeyLayerProps;
  /** @deprecated Use <layer layer={new TileLayer({...})} /> instead */
  tileLayer: TileLayerProps;
  /** @deprecated Use <layer layer={new H3ClusterLayer({...})} /> instead */
  h3ClusterLayer: H3ClusterLayerProps;
  /** @deprecated Use <layer layer={new H3HexagonLayer({...})} /> instead */
  h3HexagonLayer: H3HexagonLayerProps;
  /** @deprecated Use <layer layer={new Tile3DLayer({...})} /> instead */
  tile3DLayer: Tile3DLayerProps;
  /** @deprecated Use <layer layer={new TerrainLayer({...})} /> instead */
  terrainLayer: TerrainLayerProps;
  /** @deprecated Use <layer layer={new GeohashLayer({...})} /> instead */
  geohashLayer: GeohashLayerProps;
  /** @deprecated Use <layer layer={new GreatCircleLayer({...})} /> instead */
  greatCircleLayer: GreatCircleLayerProps;
  /** @deprecated Use <layer layer={new TripsLayer({...})} /> instead */
  tripsLayer: TripsLayerProps;
  /** @deprecated Use <layer layer={new MVTLayer({...})} /> instead */
  mVTLayer: MVTLayerProps;
  /** @deprecated Use <layer layer={new MVTLayer({...})} /> instead */
  mvtLayer: MVTLayerProps; // alias
  /** @deprecated Use <layer layer={new WMSLayer({...})} /> instead */
  wMSLayer: WMSLayerProps;
  /** @deprecated Use <layer layer={new WMSLayer({...})} /> instead */
  wmsLayer: WMSLayerProps; // alias

  // @deck.gl/mesh-layers
  /** @deprecated Use <layer layer={new ScenegraphLayer({...})} /> instead */
  scenegraphLayer: ScenegraphLayerProps;
  /** @deprecated Use <layer layer={new SimpleMeshLayer({...})} /> instead */
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
