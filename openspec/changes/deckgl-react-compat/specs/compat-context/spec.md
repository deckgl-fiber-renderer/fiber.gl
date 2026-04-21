## ADDED Requirements

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
