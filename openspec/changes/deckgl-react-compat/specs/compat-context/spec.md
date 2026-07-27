## ADDED Requirements

<<<<<<< HEAD
### Requirement: DeckGLContext provides viewport access
The DeckGLContext SHALL expose the current viewport to child components.

#### Scenario: Child reads viewport from context
- **WHEN** child component calls `useContext(DeckGLContext)`
- **THEN** receives context with viewport property containing current viewport

#### Scenario: Viewport updates when deck updates
- **WHEN** deck instance changes or updates
- **THEN** context value is updated with new viewport

### Requirement: DeckGLContext provides deck instance access
The DeckGLContext SHALL expose the deck instance to child components.

#### Scenario: Child reads deck from context
- **WHEN** child component accesses context.deck
- **THEN** receives the underlying Deck instance

#### Scenario: Deck instance is available after mount
- **WHEN** component mounts and deck is initialized
- **THEN** context.deck is populated with Deck instance

### Requirement: DeckGLContext provides eventManager access
The DeckGLContext SHALL expose the eventManager to child components.

#### Scenario: Child reads eventManager from context
- **WHEN** child component accesses context.eventManager
- **THEN** receives the deck.gl EventManager instance

### Requirement: DeckGLContext provides container element access
The DeckGLContext SHALL expose the container HTML element to child components.

#### Scenario: Child reads container from context
- **WHEN** child component accesses context.container
- **THEN** receives the HTMLElement that contains the deck.gl canvas

### Requirement: DeckGLContext provides onViewStateChange callback
The DeckGLContext SHALL expose the onViewStateChange callback to child components.

#### Scenario: Child reads onViewStateChange from context
- **WHEN** child component accesses context.onViewStateChange
- **THEN** receives the callback function that handles view state changes

### Requirement: DeckGLContext provides widgets array access
The DeckGLContext SHALL expose the current widgets array to child components.

#### Scenario: Child reads widgets from context
- **WHEN** child component accesses context.widgets
- **THEN** receives array of currently registered Widget instances

### Requirement: CompatContextProvider wraps children
The CompatContextProvider component SHALL wrap its children with DeckGLContext.Provider.

#### Scenario: Context is provided to descendants
- **WHEN** component tree includes CompatContextProvider
- **THEN** all descendant components can access DeckGLContext

### Requirement: CompatContextProvider supports custom provider
The CompatContextProvider SHALL accept custom ContextProvider prop.

#### Scenario: Custom provider is used
- **WHEN** CompatContextProvider receives ContextProvider prop
- **THEN** uses custom provider instead of default DeckGLContext.Provider

### Requirement: Context value is memoized
The CompatContextProvider SHALL memoize context value to prevent unnecessary re-renders.

#### Scenario: Context value only updates when deck changes
- **WHEN** parent component re-renders but deck instance unchanged
- **THEN** context value reference remains stable and children don't re-render

### Requirement: Context sources data from store
The CompatContextProvider SHALL read deck instance and properties from the existing store via useDeckgl hook.

#### Scenario: Context reads from store
- **WHEN** CompatContextProvider renders
- **THEN** calls useDeckgl() to get deck instance and derives context properties
=======
### Requirement: Compat context parity is partial and explicit
The compat change SHALL describe its official-style context surface at `@deckgl-fiber-renderer/compat` as partial rather than fully equivalent to official `@deck.gl/react` context.

#### Scenario: Partial context claim is explicit
- **GIVEN** a consumer reads the compat context specification
- **WHEN** supported context behavior is described
- **THEN** the spec states that context parity is partial in this change
- **AND** it does not claim full official context update semantics

### Requirement: Compat context includes deck parity as the required supported field
The compat context SHALL include `deck` as the required supported parity field for this change.

#### Scenario: Deck field is supported
- **GIVEN** a consumer accesses compat context from a supported child
- **WHEN** the supported context shape is described
- **THEN** the context includes `deck`

### Requirement: Additional official context fields are not promised unless their support is explicitly verified
The compat context spec SHALL not over-promise official context fields or timing semantics beyond the verified scope of this change.

#### Scenario: Viewport parity is not claimed as fully supported by default
- **GIVEN** official `@deck.gl/react` context includes `viewport`
- **WHEN** the compat context surface is specified
- **THEN** the spec does not claim full `viewport` parity or official update semantics unless explicitly verified elsewhere in the change

#### Scenario: Container parity is not claimed as fully supported by default
- **GIVEN** official `@deck.gl/react` context includes `container`
- **WHEN** the compat context surface is specified
- **THEN** the spec does not claim full `container` parity or official update semantics unless explicitly verified elsewhere in the change

#### Scenario: Event manager parity is not claimed as fully supported by default
- **GIVEN** official `@deck.gl/react` context includes `eventManager`
- **WHEN** the compat context surface is specified
- **THEN** the spec does not claim full `eventManager` parity or official update semantics unless explicitly verified elsewhere in the change

#### Scenario: onViewStateChange parity is not claimed as fully supported by default
- **GIVEN** official `@deck.gl/react` context includes `onViewStateChange`
- **WHEN** the compat context surface is specified
- **THEN** the spec does not claim full `onViewStateChange` parity or official update semantics unless explicitly verified elsewhere in the change

#### Scenario: Widgets are not claimed as supported context content
- **GIVEN** official `@deck.gl/react` context includes `widgets`
- **WHEN** the compat context surface is specified
- **THEN** the spec does not claim widget parity in this change
- **AND** widget-related context support remains out of scope with widgets deferred

#### Scenario: Unsupported context fields are called out for review
- **GIVEN** an official `@deck.gl/react` context field is omitted from the compat context contract
- **WHEN** the compat context surface is specified
- **THEN** the omitted field is explicitly called out for review rather than hidden by omission

### Requirement: Compat context may integrate with ContextProvider without implying full context parity
The compat context spec SHALL allow `ContextProvider` participation in the supported surface without implying unsupported official context completeness.

#### Scenario: ContextProvider support does not expand unsupported fields implicitly
- **GIVEN** a consumer uses `ContextProvider` with compat `DeckGL`
- **WHEN** the compat context behavior is specified
- **THEN** the spec keeps support claims limited to the explicit partial context surface of this change
>>>>>>> d82a74ad398b62b1f1a62d6cb1242232059ae706
