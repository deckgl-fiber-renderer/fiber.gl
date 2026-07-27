## ADDED Requirements

### Requirement: Compat types are exported from the compat package root and related family subpaths
The compat change SHALL define its public compat types at `@deckgl-fiber-renderer/compat`, with family-specific wrapper exports available from the related compat layer subpaths.

#### Scenario: Compat shared type imports use the root compat package entrypoint
- **GIVEN** a consumer imports compat shared types
- **WHEN** the public type surface is described
- **THEN** the spec defines shared types under `@deckgl-fiber-renderer/compat`
- **AND** it keeps `DeckGLProps`, `DeckGLRef`, and `DeckGLContextValue` at the package root

### Requirement: Compat types mirror the approved supported surface without depending on @deck.gl/react
The compat change SHALL define `DeckGL`-style public types that match the approved supported surface of this change without claiming a dependency on `@deck.gl/react`.

#### Scenario: DeckGLProps reflects the approved compat prop boundary
- **GIVEN** a consumer uses the compat public prop type
- **WHEN** `DeckGLProps` is described
- **THEN** the type reflects the approved supported compat prop boundary for this change
- **AND** it does not claim low-level `gl`, `canvas`, `parent`, or `_customRender` as supported compat props

#### Scenario: DeckGLRef reflects the approved ref inventory
- **GIVEN** a consumer uses the compat public ref type
- **WHEN** `DeckGLRef` is described
- **THEN** the type includes exactly the approved ref inventory of `deck`, `pickObject`, `pickObjects`, `pickMultipleObjects`, `pickObjectAsync`, and `pickObjectsAsync`

#### Scenario: DeckGLContextValue reflects partial context parity
- **GIVEN** a consumer uses the compat public context type
- **WHEN** `DeckGLContextValue` is described
- **THEN** the type reflects the partial and explicit context parity approved for this change
- **AND** it does not over-promise unsupported official context fields or update semantics

### Requirement: Compat types support the approved wrapper matrices explicitly
The compat type surface SHALL reflect the approved layer and view wrapper inventories defined for this change.

#### Scenario: Layer wrapper types cover the approved layer matrix
- **GIVEN** a consumer uses compat JSX layer wrappers in TypeScript
- **WHEN** the wrapper type surface is described
- **THEN** the spec aligns those types to the approved wrapper matrix for `@deck.gl/layers`, `@deck.gl/geo-layers`, and `@deck.gl/mesh-layers`

#### Scenario: View wrapper types cover the approved view matrix
- **GIVEN** a consumer uses compat JSX view wrappers in TypeScript
- **WHEN** the wrapper type surface is described
- **THEN** the spec aligns those types to the approved wrapper matrix for `MapView`, `OrthographicView`, `OrbitView`, `FirstPersonView`, and `GlobeView`

### Requirement: Compat types do not include widget compat APIs in this change
The compat type surface SHALL keep widget-related APIs out of scope for this change and explicitly call those exclusions out for review.

#### Scenario: Widget hook types are not part of the supported compat type surface
- **GIVEN** widgets are deferred from this change
- **WHEN** the compat type surface is specified
- **THEN** the spec does not include `useWidget` or widget wrapper types as supported compat APIs

#### Scenario: Excluded shared types are called out for review
- **GIVEN** official or deck.gl-adjacent public types are omitted from the compat package contract
- **WHEN** the compat type surface is specified
- **THEN** the omitted types are explicitly called out for review rather than hidden by omission
