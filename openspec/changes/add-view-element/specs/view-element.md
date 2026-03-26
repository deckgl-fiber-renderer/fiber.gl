## ADDED Requirements

### Requirement: View element JSX interface

The `@deckgl-fiber-renderer/types` package SHALL define a `view` intrinsic element in the JSX namespace that accepts pre-instantiated deck.gl View instances.

#### Scenario: View instance accepted

- **GIVEN** a valid deck.gl View instance (MapView, OrbitView, etc.)
- **WHEN** user provides `<view view={viewInstance} />`
- **THEN** the element SHALL render the view without errors

#### Scenario: Children supported

- **GIVEN** a `<view>` element with child layers
- **WHEN** user provides `<view view={viewInstance}><layer .../></view>`
- **THEN** the children SHALL be rendered (flattened into layers array)

#### Scenario: Missing view prop error

- **GIVEN** a `<view>` element without the `view` prop
- **WHEN** reconciler attempts to create instance
- **THEN** the system SHALL throw an error with message "<view> element requires a 'view' prop"

#### Scenario: TypeScript error for Layer instance

- **GIVEN** a Layer instance (not a View)
- **WHEN** user attempts `<view view={new ScatterplotLayer({...})} />`
- **THEN** TypeScript SHALL show a compile-time error "Layer is not assignable to type View"

### Requirement: View-only type constraint

The `view` element SHALL only accept View instances, not Layer instances, enforced at the TypeScript type level.

#### Scenario: MapView accepted

- **GIVEN** `new MapView({ id: 'main' })`
- **WHEN** passed to `<view view={...} />`
- **THEN** TypeScript SHALL compile without errors

#### Scenario: OrbitView accepted

- **GIVEN** `new OrbitView({ id: 'orbit' })`
- **WHEN** passed to `<view view={...} />`
- **THEN** TypeScript SHALL compile without errors

#### Scenario: Layer rejected

- **GIVEN** `new ScatterplotLayer({ id: 'points', data: [] })`
- **WHEN** passed to `<view view={...} />`
- **THEN** TypeScript SHALL show compile-time error

### Requirement: Reconciler view extraction

The `@deckgl-fiber-renderer/reconciler` package SHALL extract the pre-instantiated View from `props.view` and wrap it in an Instance object.

#### Scenario: Pass-through for view element

- **GIVEN** a `<view>` element with `type="view"`
- **WHEN** reconciler calls `createInstance("view", { view: viewInstance }, ...)`
- **THEN** it SHALL return `{ node: viewInstance, children: [] }`

#### Scenario: View ID preserved

- **GIVEN** a View with `id: 'my-view-id'`
- **WHEN** passed through reconciler
- **THEN** the ID SHALL be preserved in the final View instance passed to deck.setProps

### Requirement: View ID validation

The reconciler SHALL validate View instances have explicit IDs in development mode.

#### Scenario: Warning for missing View ID

- **GIVEN** `new MapView({})` without explicit `id` prop
- **WHEN** rendered in development mode
- **THEN** console.warn SHALL be called with message about missing View ID

#### Scenario: Warning for default ID

- **GIVEN** `new MapView({ id: 'unknown' })`
- **WHEN** rendered in development mode
- **THEN** console.warn SHALL be called (deck.gl default ID is not explicit)

#### Scenario: No warning for explicit ID

- **GIVEN** `new MapView({ id: 'main-view' })`
- **WHEN** rendered in development mode
- **THEN** no warning SHALL be emitted

#### Scenario: No warnings in production

- **GIVEN** any View instance (with or without ID)
- **WHEN** rendered in production mode (`NODE_ENV=production`)
- **THEN** no warnings SHALL be emitted

### Requirement: Backwards compatibility for deprecated view elements

Deprecated view-specific elements SHALL point to `<view>` element in deprecation messages.

#### Scenario: mapView deprecation message

- **GIVEN** user uses `<mapView id="main" />`
- **WHEN** rendered in development mode
- **THEN** deprecation warning SHALL suggest `<view view={new MapView({...})} />`

#### Scenario: orbitView deprecation message

- **GIVEN** user uses `<orbitView id="orbit" />`
- **WHEN** rendered in development mode
- **THEN** deprecation warning SHALL suggest `<view view={new OrbitView({...})} />`

#### Scenario: All view types updated

- **GIVEN** any deprecated view element (orthographicView, firstPersonView, globeView)
- **WHEN** rendered in development mode
- **THEN** deprecation message SHALL reference `<view>` element, not `<layer>`

### Requirement: Flattening behavior unchanged

The reconciler SHALL flatten `<view>` elements the same way as current `<layer>` elements containing Views.

#### Scenario: Single view flattens correctly

- **GIVEN** `<view view={new MapView({ id: 'main' })} />`
- **WHEN** passed through `flattenTree()` and `organizeList()`
- **THEN** output SHALL be `{ views: [MapView('main')], layers: [] }`

#### Scenario: View with child layers flattens

- **GIVEN** `<view view={mapView}><layer layer={scatterLayer} /></view>`
- **WHEN** flattened
- **THEN** output SHALL be `{ views: [mapView], layers: [scatterLayer] }`

#### Scenario: Multiple views flatten to array

- **GIVEN** two `<view>` elements with different IDs
- **WHEN** flattened
- **THEN** both SHALL appear in `views` array passed to deck.setProps

#### Scenario: Hierarchy is organizational only

- **GIVEN** `<view><layer /></view>` and top-level `<layer />`
- **WHEN** flattened
- **THEN** all layers SHALL render in all views (hierarchy doesn't scope rendering)
