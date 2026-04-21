## ADDED Requirements

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
