## MODIFIED Requirements

### Requirement: Layer element accepts Layer instances only

The `<layer>` element SHALL only accept Layer instances, not View instances. The type `layer: Layer | View` SHALL be changed to `layer: Layer`.

#### Scenario: Layer instance accepted

- **GIVEN** a valid deck.gl Layer instance (ScatterplotLayer, GeoJsonLayer, etc.)
- **WHEN** user provides `<layer layer={layerInstance} />`
- **THEN** the element SHALL render the layer without errors

#### Scenario: TypeScript error for View instance

- **GIVEN** a View instance (MapView, OrbitView, etc.)
- **WHEN** user attempts `<layer layer={new MapView({...})} />`
- **THEN** TypeScript SHALL show a compile-time error "MapView is not assignable to type Layer"

#### Scenario: Development warning for View passed to layer

- **GIVEN** a View instance incorrectly passed to `<layer>` (TypeScript bypassed)
- **WHEN** rendered in development mode
- **THEN** console.error SHALL warn to use `<view view={...} />` instead

### Requirement: Layer-only type constraint

The `@deckgl-fiber-renderer/types` package SHALL define `layer` element type as accepting only Layer instances.

#### Scenario: ScatterplotLayer accepted

- **GIVEN** `new ScatterplotLayer({ id: 'points', data: [] })`
- **WHEN** passed to `<layer layer={...} />`
- **THEN** TypeScript SHALL compile without errors

#### Scenario: GeoJsonLayer accepted

- **GIVEN** `new GeoJsonLayer({ id: 'geojson', data: {...} })`
- **WHEN** passed to `<layer layer={...} />`
- **THEN** TypeScript SHALL compile without errors

#### Scenario: MapView rejected

- **GIVEN** `new MapView({ id: 'main' })`
- **WHEN** passed to `<layer layer={...} />`
- **THEN** TypeScript SHALL show compile-time error

#### Scenario: OrbitView rejected

- **GIVEN** `new OrbitView({ id: 'orbit' })`
- **WHEN** passed to `<layer layer={...} />`
- **THEN** TypeScript SHALL show compile-time error

### Requirement: Update JSDoc deprecation messages

All JSDoc `@deprecated` tags for layer-specific elements SHALL continue pointing to `<layer>` element (unchanged from single-layer-element).

#### Scenario: scatterplotLayer deprecation unchanged

- **GIVEN** JSDoc on `scatterplotLayer` intrinsic element
- **WHEN** viewed in IDE
- **THEN** message SHALL read `@deprecated Use <layer layer={new ScatterplotLayer({...})} /> instead`

#### Scenario: geoJsonLayer deprecation unchanged

- **GIVEN** JSDoc on `geoJsonLayer` intrinsic element
- **WHEN** viewed in IDE
- **THEN** message SHALL reference `<layer>` element (not `<view>`)

### Requirement: Reconciler layer validation

The reconciler SHALL validate that Layer instances (not Views) are passed to `<layer>` element in development mode.

#### Scenario: No warning for Layer instance

- **GIVEN** `<layer layer={new ScatterplotLayer({ id: 'points', data: [] })} />`
- **WHEN** rendered in development mode
- **THEN** no type-related warnings SHALL be emitted (only ID validation)

#### Scenario: Error for View instance in development

- **GIVEN** `<layer layer={new MapView({ id: 'main' })} />` (TypeScript bypassed via any cast)
- **WHEN** rendered in development mode
- **THEN** console.error SHALL warn "View instance passed to <layer> element. Use <view view={...} /> instead."

#### Scenario: No errors in production

- **GIVEN** any instance passed to `<layer>` (even if View)
- **WHEN** rendered in production mode
- **THEN** no type-checking warnings SHALL be emitted (performance optimization)

### Requirement: Backwards compatibility unchanged

The reconciler SHALL continue supporting legacy layer-specific elements exactly as before (no changes to catalogue system).

#### Scenario: Legacy scatterplotLayer works

- **GIVEN** `<scatterplotLayer id="points" data={[]} />`
- **WHEN** rendered
- **THEN** it SHALL create ScatterplotLayer instance via catalogue (unchanged behavior)

#### Scenario: Deprecation warnings unchanged for layers

- **GIVEN** `<scatterplotLayer id="points" data={[]} />`
- **WHEN** rendered in development mode
- **THEN** deprecation warning SHALL reference `<layer layer={new ScatterplotLayer(...)} />`
