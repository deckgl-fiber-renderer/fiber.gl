## ADDED Requirements

### Requirement: Compat view wrappers are exported only from the flat compat entrypoint
The compat change SHALL define JSX view wrapper support only from `@deckgl-fiber-renderer/dom/compat`.

#### Scenario: No family view compat entrypoints are required
- **GIVEN** a consumer wants JSX view wrappers
- **WHEN** the supported import surface is specified
- **THEN** the wrappers are defined under `@deckgl-fiber-renderer/dom/compat`
- **AND** the spec does not claim additional `/compat/*` view family entrypoints

### Requirement: Compat view wrapper coverage matches the approved wrapper matrix
The compat change SHALL explicitly support the finalized view wrapper inventory defined by the approved proposal and design.

#### Scenario: Supported view wrapper inventory is explicit
- **GIVEN** a consumer imports view wrappers from `@deckgl-fiber-renderer/dom/compat`
- **WHEN** the supported coverage is described
- **THEN** the supported wrappers are exactly `MapView`, `OrthographicView`, `OrbitView`, `FirstPersonView`, and `GlobeView`

### Requirement: Compat view wrappers support migration from official React child syntax
The compat view wrappers SHALL define the supported JSX migration path for official-style React view composition.

#### Scenario: Supported view wrapper usage is described with explicit ID
- **GIVEN** a consumer currently renders React view children
- **WHEN** the compat migration pattern is documented
- **THEN** the spec supports official-style JSX view composition through compat wrappers
- **AND** the example includes an explicit view ID such as `<MapView id="main" />`

#### Scenario: View wrappers may contain child layers
- **GIVEN** a consumer nests compat layer wrappers under a compat view wrapper
- **WHEN** the supported composition patterns are specified
- **THEN** the spec treats view-plus-layer composition as supported within the approved wrapper inventory

### Requirement: Compat view coverage stays scoped to the approved migration surface
The compat view wrapper spec SHALL avoid promising broader parity than the approved wrapper inventory and current renderer constraints support.

#### Scenario: Unsupported view coverage is not implied
- **GIVEN** a consumer expects a view wrapper outside the approved inventory
- **WHEN** the supported compat coverage is described
- **THEN** the spec limits support claims to `MapView`, `OrthographicView`, `OrbitView`, `FirstPersonView`, and `GlobeView`

#### Scenario: Interleaved caveats are not over-promised away
- **GIVEN** the renderer has existing interleaved-mode constraints around views
- **WHEN** compat view behavior is specified
- **THEN** the spec does not claim that compat view wrappers remove or redefine those native constraints implicitly
