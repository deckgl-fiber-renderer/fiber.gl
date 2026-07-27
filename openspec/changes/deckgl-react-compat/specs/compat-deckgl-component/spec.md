## ADDED Requirements

<<<<<<< HEAD
### Requirement: DeckGL component accepts official API props
The DeckGL component SHALL accept all props from the official `@deck.gl/react` DeckGL component except `canvas`, `gl`, `parent`, `Deck`, and `_customRender`.

#### Scenario: Basic usage with layers prop
- **WHEN** user provides layers as prop array
- **THEN** layers are passed to underlying Deckgl component and rendered

#### Scenario: JSX children are preserved
- **WHEN** user includes non-layer React children
- **THEN** children are rendered within the deck.gl canvas container

#### Scenario: Width and height props
- **WHEN** user provides width and height as string or number
- **THEN** container is sized according to width/height values

#### Scenario: Style prop application
- **WHEN** user provides style prop
- **THEN** styles are applied to container element

### Requirement: DeckGL component extracts JSX layers from children
The DeckGL component SHALL extract layer wrapper components from children and pass them to the reconciler.

#### Scenario: JSX layers are extracted
- **WHEN** user includes `<ScatterplotLayer>` as child
- **THEN** layer is extracted and passed to reconciler via layers prop

#### Scenario: Mix of layers prop and JSX layers
- **WHEN** user provides both layers prop and JSX layer children
- **THEN** both are combined and passed to reconciler

#### Scenario: Non-layer children are preserved
- **WHEN** user includes mix of layer and non-layer children
- **THEN** only layers are extracted, other children remain in tree

### Requirement: DeckGL component extracts JSX views from children
The DeckGL component SHALL extract view wrapper components from children and configure views.

#### Scenario: JSX views are extracted
- **WHEN** user includes `<MapView id="map">` as child
- **THEN** view is extracted and passed to Deckgl views prop

#### Scenario: Mix of views prop and JSX views
- **WHEN** user provides both views prop and JSX view children
- **THEN** JSX views take precedence for matching IDs

### Requirement: DeckGL component provides imperative ref handle
The DeckGL component SHALL expose imperative methods via ref matching the official API.

#### Scenario: Ref exposes deck instance
- **WHEN** user accesses `ref.current.deck`
- **THEN** returns the underlying Deck instance

#### Scenario: Ref exposes picking methods
- **WHEN** user calls `ref.current.pickObject({x, y})`
- **THEN** delegates to deck instance pickObject method and returns result

### Requirement: DeckGL component wraps children with DeckGLContext
The DeckGL component SHALL provide DeckGLContext to all children.

#### Scenario: Context is provided to children
- **WHEN** child component reads DeckGLContext
- **THEN** receives viewport, deck instance, and eventManager

#### Scenario: Custom ContextProvider is used
- **WHEN** user provides ContextProvider prop
- **THEN** custom provider is used instead of default DeckGLContext.Provider

### Requirement: DeckGL component warns about unsupported props in development
The DeckGL component SHALL warn in development mode when unsupported props are provided.

#### Scenario: Warning for custom Deck class
- **WHEN** user provides Deck prop in development mode
- **THEN** console.warn is called with migration guide link

#### Scenario: Warning for _customRender prop
- **WHEN** user provides _customRender prop in development mode
- **THEN** console.warn is called explaining it's not supported

#### Scenario: No warnings in production
- **WHEN** running in production mode
- **THEN** no warnings are emitted regardless of props
=======
### Requirement: Compat DeckGL exports a dedicated supported React wrapper package entrypoint
The compat change SHALL define `DeckGL` at `@deckgl-fiber-renderer/compat` as the supported React migration entrypoint for this change.

#### Scenario: Root compat package import is supported
- **GIVEN** an application currently imports `DeckGL` from `@deck.gl/react`
- **WHEN** the application switches to `import { DeckGL } from '@deckgl-fiber-renderer/compat'`
- **THEN** the change specification treats that root compat package import as supported
- **AND** the change specification keeps views, compat context, compat ref types, and shared compat types at the package root

### Requirement: Compat DeckGL scopes its migration promise to supported official patterns
The compat `DeckGL` wrapper SHALL promise migration assistance only for the supported official `@deck.gl/react` patterns defined in this change.

#### Scenario: Supported migration claim stays testable
- **GIVEN** an application uses supported `@deck.gl/react` patterns
- **WHEN** it swaps the `DeckGL` import to `@deckgl-fiber-renderer/compat`
- **THEN** the migration claim is limited to reduced React-surface rewrite work for supported patterns
- **AND** the specification does not claim full `@deck.gl/react` behavioral parity

#### Scenario: Unsupported official patterns are not implied as supported
- **GIVEN** an application uses official `Render callbacks` or widget React components
- **WHEN** the compat migration surface is documented
- **THEN** those patterns are called out as unsupported or deferred instead of being implied to work

### Requirement: Compat DeckGL aligns its public prop surface to the approved official-shaped boundary
The compat `DeckGL` wrapper SHALL define an official-shaped public prop boundary that matches the approved proposal and design for this change.

#### Scenario: Supported public prop boundary is explicit
- **GIVEN** the compat `DeckGL` public API is specified
- **WHEN** its prop surface is described
- **THEN** it includes the supported official-style React surface needed for this change
- **AND** it excludes low-level `gl`, `canvas`, `parent`, and `_customRender` from the supported compat API claim
- **AND** those exclusions are explicitly called out for review rather than implied only by omission

#### Scenario: ContextProvider remains part of the supported surface
- **GIVEN** a consumer uses the compat `DeckGL` wrapper
- **WHEN** the supported React-facing props are described
- **THEN** `ContextProvider` is included in the supported compat surface

### Requirement: Compat DeckGL supports supported JSX child composition through compat wrappers
The compat `DeckGL` wrapper SHALL support the approved migration path for JSX layer and view composition through the compat package and compat subpath wrapper inventory defined by this change.

#### Scenario: Compat layer children are supported
- **GIVEN** a consumer renders compat layer wrapper children under `DeckGL`
- **WHEN** those children correspond to wrappers included in this change's approved inventory
- **THEN** the spec treats that JSX composition pattern as supported

#### Scenario: Compat view children are supported
- **GIVEN** a consumer renders compat view wrapper children under `DeckGL`
- **WHEN** those children correspond to wrappers included in this change's approved inventory
- **THEN** the spec treats that JSX composition pattern as supported

#### Scenario: Layer IDs remain explicit in compat examples
- **GIVEN** a compat JSX layer example appears in the spec
- **WHEN** a layer wrapper is shown
- **THEN** the example includes an explicit stable `id`

### Requirement: Compat DeckGL documents unsupported official Render callbacks and detectable unsupported usage
The compat `DeckGL` wrapper SHALL explicitly exclude official `Render callbacks` from the supported scope of this change and define development-only warnings for detectable unsupported usage.

#### Scenario: Function children are documented as unsupported
- **GIVEN** a consumer provides `children` as a function such as `{({viewport}) => ...}`
- **WHEN** the compat behavior is specified
- **THEN** that pattern is described as unsupported in this change
- **AND** the spec uses the official term `Render callbacks`

#### Scenario: Development warnings are emitted for detectable unsupported props
- **GIVEN** a compat consumer provides a detectable unsupported prop or migration pattern
- **WHEN** compat `DeckGL` runs in development mode
- **THEN** the spec allows a runtime warning that points the user to migration guidance
- **AND** the same scenario remains silent in production mode

### Requirement: Compat DeckGL documents widgets and widget hooks as deferred from this change
The compat `DeckGL` wrapper SHALL explicitly describe widget React wrappers and `useWidget` as deferred from this change.

#### Scenario: Widget React components are documented as deferred
- **GIVEN** a consumer expects widget JSX such as `<ZoomWidget />` under compat `DeckGL`
- **WHEN** the compat scope is described
- **THEN** the spec marks widget wrapper support as deferred to a future change
- **AND** it does not claim widget JSX support in this change

#### Scenario: useWidget is documented as deferred
- **GIVEN** a consumer expects the upstream `useWidget` hook documented at `https://deck.gl/docs/api-reference/react/use-widget`
- **WHEN** the compat scope is described
- **THEN** the spec marks `useWidget` support as deferred to a future change
- **AND** it does not imply hook parity in this change
>>>>>>> d82a74ad398b62b1f1a62d6cb1242232059ae706
