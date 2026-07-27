## ADDED Requirements

<<<<<<< HEAD
### Requirement: Layer wrapper components accept layer props
Each layer wrapper component SHALL accept all props for its corresponding deck.gl layer class.

#### Scenario: ScatterplotLayer accepts getPosition prop
- **WHEN** user provides `<ScatterplotLayer id="points" data={[...]} getPosition={d => d.coordinates} />`
- **THEN** ScatterplotLayer instance is created with getPosition accessor

#### Scenario: Layer wrapper accepts children
- **WHEN** user provides `<ScatterplotLayer>{otherContent}</ScatterplotLayer>`
- **THEN** children are preserved in React tree

### Requirement: Layer wrappers instantiate deck.gl layers
Each layer wrapper component SHALL instantiate the corresponding deck.gl layer class and pass to reconciler.

#### Scenario: ScatterplotLayer creates deck.gl instance
- **WHEN** `<ScatterplotLayer id="points" data={data} />` renders
- **THEN** creates `new ScatterplotLayer({ id: 'points', data })` and passes to `<layer>` element

#### Scenario: Layer props are passed through
- **WHEN** user provides layer-specific props
- **THEN** all props except children are passed to layer constructor

### Requirement: Core layers from @deck.gl/layers are wrapped
The compat package SHALL export wrapper components for common core layers.

#### Scenario: Essential layers are available
- **WHEN** user imports from compat package
- **THEN** ScatterplotLayer, ArcLayer, LineLayer, GeoJsonLayer, PolygonLayer, PathLayer, IconLayer, TextLayer, ColumnLayer, GridCellLayer, PointCloudLayer, BitmapLayer, and SolidPolygonLayer are exported

### Requirement: Geo layers from @deck.gl/geo-layers are wrapped
The compat package SHALL export wrapper components for common geo layers.

#### Scenario: Geo layers are available
- **WHEN** user imports from compat package
- **THEN** H3HexagonLayer, S2Layer, GreatCircleLayer, TileLayer, and MVTLayer are exported

### Requirement: Layer wrappers use reconciler's layer primitive
Each layer wrapper SHALL use the `<layer>` primitive to pass instances to the reconciler.

#### Scenario: Wrapper renders layer element
- **WHEN** ScatterplotLayer wrapper renders
- **THEN** returns `<layer layer={layerInstance}>{children}</layer>`

### Requirement: Layer wrappers preserve TypeScript types
Layer wrapper components SHALL preserve full TypeScript type safety for layer props.

#### Scenario: ScatterplotLayer has correct prop types
- **WHEN** user types `<ScatterplotLayer` in editor
- **THEN** IntelliSense shows all ScatterplotLayer props with correct types

#### Scenario: Invalid props cause type errors
- **WHEN** user provides invalid prop for layer type
- **THEN** TypeScript reports type error

### Requirement: Missing layer wrappers are documented
The compat package SHALL document how to create wrappers for layers not included.

#### Scenario: User needs unwrapped layer
- **WHEN** user needs layer not in compat package
- **THEN** documentation shows 3-line pattern to create wrapper
=======
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
>>>>>>> d82a74ad398b62b1f1a62d6cb1242232059ae706
