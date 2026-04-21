## ADDED Requirements

### Requirement: DeckGL ref exposes deck instance
The DeckGL ref SHALL provide access to the underlying Deck instance via deck property.

#### Scenario: Ref provides deck instance
- **WHEN** user accesses `ref.current.deck`
- **THEN** returns the Deck instance or undefined if not yet initialized

### Requirement: DeckGL ref exposes pickObject method
The DeckGL ref SHALL provide pickObject method that delegates to deck instance.

#### Scenario: pickObject is called
- **WHEN** user calls `ref.current.pickObject({x: 100, y: 200})`
- **THEN** calls deck.pickObject with same parameters and returns result

### Requirement: DeckGL ref exposes pickObjects method
The DeckGL ref SHALL provide pickObjects method that delegates to deck instance.

#### Scenario: pickObjects is called
- **WHEN** user calls `ref.current.pickObjects({x: 100, y: 200, width: 50, height: 50})`
- **THEN** calls deck.pickObjects with same parameters and returns result

### Requirement: DeckGL ref exposes pickMultipleObjects method
The DeckGL ref SHALL provide pickMultipleObjects method that delegates to deck instance.

#### Scenario: pickMultipleObjects is called
- **WHEN** user calls `ref.current.pickMultipleObjects({x: 100, y: 200})`
- **THEN** calls deck.pickMultipleObjects with same parameters and returns result

### Requirement: DeckGL ref exposes pickObjectAsync method
The DeckGL ref SHALL provide pickObjectAsync method that delegates to deck instance.

#### Scenario: pickObjectAsync is called
- **WHEN** user calls `await ref.current.pickObjectAsync({x: 100, y: 200})`
- **THEN** calls deck.pickObjectAsync with same parameters and returns Promise

### Requirement: DeckGL ref exposes pickObjectsAsync method
The DeckGL ref SHALL provide pickObjectsAsync method that delegates to deck instance.

#### Scenario: pickObjectsAsync is called
- **WHEN** user calls `await ref.current.pickObjectsAsync({x: 100, y: 200, width: 50, height: 50})`
- **THEN** calls deck.pickObjectsAsync with same parameters and returns Promise

### Requirement: Ref methods match official API signature
All ref methods SHALL have identical signatures to official `@deck.gl/react` DeckGL ref.

#### Scenario: Type compatibility
- **WHEN** user types ref methods in TypeScript
- **THEN** signatures match official DeckGLRef type

### Requirement: Ref handle is stable across renders
The ref handle SHALL maintain stable identity across component re-renders.

#### Scenario: Ref identity preserved
- **WHEN** DeckGL component re-renders
- **THEN** ref.current maintains same object identity

### Requirement: Ref methods throw error if deck not initialized
Ref methods SHALL throw descriptive error if called before deck is initialized.

#### Scenario: Method called before initialization
- **WHEN** user calls `ref.current.pickObject({x, y})` before deck ready
- **THEN** throws error explaining deck is not yet initialized
