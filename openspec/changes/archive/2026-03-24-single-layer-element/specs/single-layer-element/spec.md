## ADDED Requirements

### Requirement: Single layer JSX element

The `@deckgl-fiber-renderer/types` package SHALL define a single `layer` intrinsic element in the JSX namespace that accepts pre-instantiated Deck.gl Layer or View instances.

#### Scenario: Layer instance accepted

- **WHEN** user provides a `<layer layer={layerInstance} />` element with a valid Deck.gl Layer instance
- **THEN** the element SHALL render the layer without errors

#### Scenario: View instance accepted

- **WHEN** user provides a `<layer layer={viewInstance} />` element with a valid Deck.gl View instance
- **THEN** the element SHALL render the view without errors

#### Scenario: Children supported for views

- **WHEN** user provides a `<layer layer={viewInstance}>` element with child layers
- **THEN** the children SHALL be rendered within the view's context

#### Scenario: Missing layer prop error

- **WHEN** user provides a `<layer />` element without the `layer` prop
- **THEN** the system SHALL throw an error with message "<layer> element requires a 'layer' prop"

### Requirement: TypeScript generic support

Layer instances passed to the `<layer>` element SHALL preserve TypeScript generic type parameters for accessor functions.

#### Scenario: Generic accessor type inference

- **WHEN** user creates `new ScatterplotLayer<DataType>({ getPosition: d => ... })`
- **THEN** the `d` parameter SHALL be typed as `DataType` with full autocomplete

#### Scenario: Type error on wrong accessor type

- **WHEN** user provides accessor function with incorrect return type
- **THEN** TypeScript SHALL show a compile-time error

### Requirement: Reconciler layer extraction

The `@deckgl-fiber-renderer/reconciler` package SHALL extract the pre-instantiated layer from `props.layer` instead of constructing it from a catalogue.

#### Scenario: Pass-through for layer element

- **WHEN** reconciler receives a `<layer>` element with type="layer"
- **THEN** it SHALL extract `props.layer` and wrap it in an Instance object without modification

#### Scenario: Layer ID preserved

- **WHEN** user provides a layer with `id: 'my-layer'`
- **THEN** the ID SHALL be preserved through reconciliation to Deck.gl

### Requirement: Backwards compatibility

The reconciler SHALL continue to support legacy layer-specific elements (e.g., `<scatterplotLayer>`) during the v2 migration period.

#### Scenario: Legacy element still works

- **WHEN** user provides `<scatterplotLayer id="points" data={[]} />`
- **THEN** the element SHALL render using the catalogue system

#### Scenario: Both syntaxes coexist

- **WHEN** user mixes `<layer layer={...} />` and `<scatterplotLayer />` in the same tree
- **THEN** both SHALL render correctly in the same scene

#### Scenario: Deprecation warning shown

- **WHEN** user uses a legacy layer-specific element
- **THEN** the system SHALL log a deprecation warning to console (suppressible via config)

### Requirement: Remove layer registration

Users SHALL NOT be required to call `extend()` or import side-effects to use custom or built-in layers.

#### Scenario: Custom layer works without registration

- **WHEN** user creates a custom layer class `MyCustomLayer extends Layer`
- **THEN** user can use `<layer layer={new MyCustomLayer({...})} />` without calling `extend()`

#### Scenario: No automatic imports

- **WHEN** user imports `@deckgl-fiber-renderer/reconciler`
- **THEN** no Deck.gl layer classes SHALL be imported or instantiated automatically

### Requirement: Code splitting support

Users SHALL be able to import only the Deck.gl layer classes they use, enabling tree-shaking and code-splitting.

#### Scenario: Tree-shaking unused layers

- **WHEN** user only imports and uses `ScatterplotLayer`
- **THEN** other layer classes (e.g., `GeoJsonLayer`, `HeatmapLayer`) SHALL NOT be included in the bundle

#### Scenario: Dynamic layer imports

- **WHEN** user dynamically imports a layer class `const { TileLayer } = await import('@deck.gl/geo-layers')`
- **THEN** the layer class SHALL work with `<layer layer={new TileLayer({...})} />` without additional setup
