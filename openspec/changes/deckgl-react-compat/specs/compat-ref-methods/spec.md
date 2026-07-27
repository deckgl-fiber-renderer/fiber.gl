## ADDED Requirements

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
