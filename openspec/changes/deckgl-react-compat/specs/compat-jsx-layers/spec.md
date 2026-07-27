## ADDED Requirements

### Requirement: Compat layer wrappers are exported only from the flat compat entrypoint
The compat change SHALL define JSX layer wrapper support only from `@deckgl-fiber-renderer/dom/compat`.

#### Scenario: No family layer compat entrypoints are required
- **GIVEN** a consumer wants JSX layer wrappers
- **WHEN** the supported import surface is specified
- **THEN** the wrappers are defined under `@deckgl-fiber-renderer/dom/compat`
- **AND** the spec does not claim `/compat/layers`-style family entrypoints

### Requirement: Compat layer wrapper coverage matches the approved wrapper matrix
The compat change SHALL explicitly support the finalized layer wrapper inventory defined by the approved proposal and design.

#### Scenario: Core layer wrapper inventory is explicit
- **GIVEN** a consumer imports layer wrappers from `@deckgl-fiber-renderer/dom/compat`
- **WHEN** the supported `@deck.gl/layers` coverage is described
- **THEN** the supported wrappers are exactly `ArcLayer`, `BitmapLayer`, `IconLayer`, `LineLayer`, `PointCloudLayer`, `ScatterplotLayer`, `ColumnLayer`, `GridCellLayer`, `PathLayer`, `PolygonLayer`, `GeoJsonLayer`, `TextLayer`, and `SolidPolygonLayer`

#### Scenario: Geo layer wrapper inventory is explicit
- **GIVEN** a consumer imports layer wrappers from `@deckgl-fiber-renderer/dom/compat`
- **WHEN** the supported `@deck.gl/geo-layers` coverage is described
- **THEN** the supported wrappers are exactly `S2Layer`, `QuadkeyLayer`, `TileLayer`, `H3ClusterLayer`, `H3HexagonLayer`, `Tile3DLayer`, `TerrainLayer`, `GeohashLayer`, `GreatCircleLayer`, `TripsLayer`, `MVTLayer`, and `WMSLayer`

#### Scenario: Mesh layer wrapper inventory is explicit
- **GIVEN** a consumer imports layer wrappers from `@deckgl-fiber-renderer/dom/compat`
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
