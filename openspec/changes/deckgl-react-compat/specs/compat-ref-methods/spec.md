## ADDED Requirements

<<<<<<< HEAD
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
=======
### Requirement: Compat DeckGL ref surface matches the approved supported method inventory
The compat `DeckGL` ref surface exported from `@deckgl-fiber-renderer/compat` SHALL be limited to the approved official-style method inventory for this change.

#### Scenario: Approved ref inventory is explicit
- **GIVEN** a consumer uses a ref with compat `DeckGL`
- **WHEN** the supported ref surface is described
- **THEN** it includes exactly `deck`, `pickObject`, `pickObjects`, `pickMultipleObjects`, `pickObjectAsync`, and `pickObjectsAsync`

### Requirement: Compat ref claims are scoped to the approved official subset
The compat ref spec SHALL avoid promising broader imperative APIs than the approved official subset.

#### Scenario: Additional imperative APIs are not implied
- **GIVEN** a consumer expects arbitrary imperative mutation APIs through the compat ref
- **WHEN** the ref behavior is specified
- **THEN** the spec limits support claims to `deck`, `pickObject`, `pickObjects`, `pickMultipleObjects`, `pickObjectAsync`, and `pickObjectsAsync`

#### Scenario: Excluded imperative APIs are called out for review
- **GIVEN** deck.gl exposes imperative methods beyond the approved compat subset
- **WHEN** the compat ref surface is documented
- **THEN** the omitted methods are explicitly called out for review rather than hidden by omission

### Requirement: Compat ref supports official-style picking flows for the approved methods
The compat `DeckGL` ref SHALL support the approved picking methods as part of the supported migration surface.

#### Scenario: Sync picking methods are part of the supported migration story
- **GIVEN** a consumer uses the supported picking API through a compat ref
- **WHEN** the compat migration surface is described
- **THEN** `pickObject`, `pickObjects`, and `pickMultipleObjects` are included as supported methods

#### Scenario: Async picking methods are part of the supported migration story
- **GIVEN** a consumer uses the supported async picking API through a compat ref
- **WHEN** the compat migration surface is described
- **THEN** `pickObjectAsync` and `pickObjectsAsync` are included as supported methods

### Requirement: Compat ref method inventory remains tied to the supported upstream deck.gl range
The compat ref spec SHALL keep its claims aligned to the approved upstream deck.gl range already targeted by this repo.

#### Scenario: Ref inventory is version-scoped
- **GIVEN** this repo targets the approved upstream deck.gl range for the change
- **WHEN** the compat ref inventory is specified
- **THEN** the supported inventory is defined against that approved range rather than against undocumented broader parity assumptions
>>>>>>> d82a74ad398b62b1f1a62d6cb1242232059ae706
