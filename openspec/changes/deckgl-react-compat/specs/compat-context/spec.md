## ADDED Requirements

### Requirement: Compat context parity is partial and explicit
The compat change SHALL describe its official-style context surface as partial rather than fully equivalent to official `@deck.gl/react` context.

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

### Requirement: Compat context may integrate with ContextProvider without implying full context parity
The compat context spec SHALL allow `ContextProvider` participation in the supported surface without implying unsupported official context completeness.

#### Scenario: ContextProvider support does not expand unsupported fields implicitly
- **GIVEN** a consumer uses `ContextProvider` with compat `DeckGL`
- **WHEN** the compat context behavior is specified
- **THEN** the spec keeps support claims limited to the explicit partial context surface of this change
