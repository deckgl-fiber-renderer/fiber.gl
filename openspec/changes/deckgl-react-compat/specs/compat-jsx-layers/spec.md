## ADDED Requirements

### Requirement: Compat layer wrappers are exported from compat family subpaths
The compat change SHALL define JSX layer wrapper support from `@deckgl-fiber-renderer/compat/layers`, `@deckgl-fiber-renderer/compat/geo-layers`, `@deckgl-fiber-renderer/compat/aggregation-layers`, and `@deckgl-fiber-renderer/compat/mesh-layers`.

#### Scenario: Family layer compat entrypoints are supported
- **GIVEN** a consumer wants JSX layer wrappers
- **WHEN** the supported import surface is specified
- **THEN** the wrappers are defined under compat family subpaths rather than only at the package root
- **AND** the subpaths intentionally mirror existing deck.gl package families where that mapping is natural

### Requirement: Compat layer wrapper coverage matches the approved wrapper matrix
The compat change SHALL explicitly support the finalized layer wrapper inventory defined by the approved proposal and design.

#### Scenario: Core layer wrapper inventory is explicit
- **GIVEN** a consumer imports layer wrappers from `@deckgl-fiber-renderer/compat/layers`
- **WHEN** the supported `@deck.gl/layers` coverage is described
- **THEN** the supported wrappers are exactly `ArcLayer`, `BitmapLayer`, `IconLayer`, `LineLayer`, `PointCloudLayer`, `ScatterplotLayer`, `ColumnLayer`, `GridCellLayer`, `PathLayer`, `PolygonLayer`, `GeoJsonLayer`, `TextLayer`, and `SolidPolygonLayer`

#### Scenario: Geo layer wrapper inventory is explicit
- **GIVEN** a consumer imports layer wrappers from `@deckgl-fiber-renderer/compat/geo-layers`
- **WHEN** the supported `@deck.gl/geo-layers` coverage is described
- **THEN** the supported wrappers are exactly `S2Layer`, `QuadkeyLayer`, `TileLayer`, `H3ClusterLayer`, `H3HexagonLayer`, `Tile3DLayer`, `TerrainLayer`, `GeohashLayer`, `GreatCircleLayer`, `TripsLayer`, `MVTLayer`, and `WMSLayer`

#### Scenario: Aggregation layer wrapper inventory is explicit
- **GIVEN** a consumer imports layer wrappers from `@deckgl-fiber-renderer/compat/aggregation-layers`
- **WHEN** the supported `@deck.gl/aggregation-layers` coverage is described
- **THEN** the supported wrappers are exactly `ScreenGridLayer`, `HexagonLayer`, `ContourLayer`, `GridLayer`, and `HeatmapLayer`

#### Scenario: Mesh layer wrapper inventory is explicit
- **GIVEN** a consumer imports layer wrappers from `@deckgl-fiber-renderer/compat/mesh-layers`
- **WHEN** the supported `@deck.gl/mesh-layers` coverage is described
- **THEN** the supported wrappers are exactly `ScenegraphLayer` and `SimpleMeshLayer`

### Requirement: Compat layer wrappers support migration from official React child syntax
The compat layer wrappers SHALL define the supported JSX migration path for official-style React layer composition.

#### Scenario: Supported layer wrapper usage is described with stable ID
- **GIVEN** a consumer currently renders React layer children
- **WHEN** the compat migration pattern is documented
- **THEN** the spec supports official-style JSX layer composition through compat wrappers
- **AND** the example includes a stable layer ID such as `<ScatterplotLayer id="points" data={data} />`

#### Scenario: Official deck.gl class imports remain supported alongside compat wrappers
- **GIVEN** a consumer continues importing deck.gl classes from official packages such as `@deck.gl/layers`
- **WHEN** the migration scope is described
- **THEN** the spec does not require replacing official deck.gl class imports to use the compat `DeckGL` entrypoint

#### Scenario: Aggregation layer family exclusions are explicit
- **GIVEN** a consumer imports layer wrappers from `@deckgl-fiber-renderer/compat/aggregation-layers`
- **WHEN** aggregation-layer wrapper coverage is described
- **THEN** the spec limits supported aggregation-layer wrappers to exactly `ScreenGridLayer`, `HexagonLayer`, `ContourLayer`, `GridLayer`, and `HeatmapLayer`
- **AND** it does not imply that `_AggregationLayer`, `WebGLAggregator`, `CPUAggregator`, or aggregator helper/type exports are JSX wrapper components in this change

### Requirement: Compat layer wrappers retain documented alias compatibility where approved
The compat layer wrapper matrix SHALL explicitly document the approved deprecated alias mappings without turning them into new wrapper families.

#### Scenario: MVT aliases map to the canonical wrapper
- **GIVEN** the compat wrapper matrix is documented
- **WHEN** deprecated alias compatibility is described
- **THEN** `mVTLayer` and `mvtLayer` are documented as compatibility aliases that map to `MVTLayer`

#### Scenario: WMS aliases map to the canonical wrapper
- **GIVEN** the compat wrapper matrix is documented
- **WHEN** deprecated alias compatibility is described
- **THEN** `wMSLayer` and `wmsLayer` are documented as compatibility aliases that map to `WMSLayer`

### Requirement: Compat layer wrappers keep migration claims scoped to supported wrappers only
The compat layer wrapper spec SHALL avoid claiming blanket parity for wrappers outside the approved matrix.

#### Scenario: Unsupported layer wrappers are not implied
- **GIVEN** a consumer wants a layer wrapper not listed in the approved matrix
- **WHEN** the supported compat coverage is described
- **THEN** the spec limits support claims to the explicit wrapper inventory in this change
- **AND** it does not imply universal wrapper coverage

#### Scenario: Excluded layer props or APIs are called out for review
- **GIVEN** a supported wrapper omits deck.gl layer props or behaviors from the compat contract
- **WHEN** that wrapper surface is documented
- **THEN** the omitted props or behaviors are explicitly called out for review rather than hidden by omission
