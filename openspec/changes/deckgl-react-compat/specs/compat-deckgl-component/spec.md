## ADDED Requirements

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
