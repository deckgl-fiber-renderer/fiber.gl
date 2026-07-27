## ADDED Requirements

<<<<<<< HEAD
### Requirement: View wrapper components accept view props
Each view wrapper component SHALL accept all props for its corresponding deck.gl view class.

#### Scenario: MapView accepts controller prop
- **WHEN** user provides `<MapView id="map" controller={true} />`
- **THEN** MapView instance is created with controller enabled

#### Scenario: View wrapper accepts children
- **WHEN** user provides `<MapView>{content}</MapView>`
- **THEN** children are preserved in React tree

### Requirement: View wrappers instantiate deck.gl views
Each view wrapper component SHALL instantiate the corresponding deck.gl view class and pass to reconciler.

#### Scenario: MapView creates deck.gl instance
- **WHEN** `<MapView id="map" />` renders
- **THEN** creates `new MapView({ id: 'map' })` and passes to `<view>` element

#### Scenario: View props are passed through
- **WHEN** user provides view-specific props
- **THEN** all props except children are passed to view constructor

### Requirement: Common views are wrapped
The compat package SHALL export wrapper components for common view types.

#### Scenario: Standard views are available
- **WHEN** user imports from compat package
- **THEN** MapView, FirstPersonView, OrthographicView, and OrbitView are exported

### Requirement: View wrappers use reconciler's view primitive
Each view wrapper SHALL use the `<view>` primitive to pass instances to the reconciler.

#### Scenario: Wrapper renders view element
- **WHEN** MapView wrapper renders
- **THEN** returns `<view view={viewInstance}>{children}</view>`

### Requirement: View wrappers preserve TypeScript types
View wrapper components SHALL preserve full TypeScript type safety for view props.

#### Scenario: MapView has correct prop types
- **WHEN** user types `<MapView` in editor
- **THEN** IntelliSense shows all MapView props with correct types

#### Scenario: Invalid props cause type errors
- **WHEN** user provides invalid prop for view type
- **THEN** TypeScript reports type error

### Requirement: View IDs are required
View wrapper components SHALL validate that id prop is provided in development mode.

#### Scenario: Warning for missing view ID
- **WHEN** user omits id prop from view in development mode
- **THEN** console.warn is called explaining ID is required
=======
### Requirement: Compat view wrappers are exported from the compat package root
The compat change SHALL define JSX view wrapper support from `@deckgl-fiber-renderer/compat`.

#### Scenario: Views remain at the compat package root
- **GIVEN** a consumer wants JSX view wrappers
- **WHEN** the supported import surface is specified
- **THEN** the wrappers are defined under `@deckgl-fiber-renderer/compat`
- **AND** the spec does not require an additional view-specific compat subpath in this change

### Requirement: Compat view wrapper coverage matches the approved wrapper matrix
The compat change SHALL explicitly support the finalized view wrapper inventory defined by the approved proposal and design.

#### Scenario: Supported view wrapper inventory is explicit
- **GIVEN** a consumer imports view wrappers from `@deckgl-fiber-renderer/compat`
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

#### Scenario: Excluded view APIs are called out for review
- **GIVEN** a compat view wrapper omits deck.gl view props or behaviors from the compat contract
- **WHEN** that view surface is documented
- **THEN** the omitted props or behaviors are explicitly called out for review rather than hidden by omission

#### Scenario: Interleaved caveats are not over-promised away
- **GIVEN** the renderer has existing interleaved-mode constraints around views
- **WHEN** compat view behavior is specified
- **THEN** the spec does not claim that compat view wrappers remove or redefine those native constraints implicitly
>>>>>>> d82a74ad398b62b1f1a62d6cb1242232059ae706
