## ADDED Requirements

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
