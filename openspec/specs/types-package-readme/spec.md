# types-package-readme Specification

## Purpose

TBD - created by archiving change documentation-overhaul-v2. Update Purpose after archive.

## Requirements

### Requirement: Auto-included package notice

The packages/types/README.md SHALL clearly state the package is automatically included with @deckgl-fiber-renderer/dom.

#### Scenario: User understands installation

- **WHEN** user visits npmjs.com page for @deckgl-fiber-renderer/types
- **THEN** they see notice stating "This package is automatically included when you install @deckgl-fiber-renderer/dom"
- **AND** they understand they don't need to install it separately
- **AND** they see recommendation to install @deckgl-fiber-renderer/dom instead

### Requirement: TypeScript generic support showcase

The packages/types/README.md SHALL prominently feature TypeScript generic type parameters as the key feature.

#### Scenario: TypeScript user discovers type safety

- **WHEN** user reads Key Features section
- **THEN** they see "Generic Type Parameters" subsection with with/without comparison
- **AND** they see example showing `<DataPoint>` generic on layer constructor
- **AND** they see comment showing TypeScript knows `d` is DataPoint with full autocomplete
- **AND** they see comparison example showing accessor without generic has `d` as `any`

### Requirement: JSX element type documentation

The packages/types/README.md SHALL document the JSX element types for `<layer>` and `<view>`.

#### Scenario: User understands layer element type

- **WHEN** user reads JSX Element Types section
- **THEN** they see `<layer>` element type definition showing `layer: Layer` prop
- **AND** they see `ref` and `children` optional props
- **AND** they understand layer prop accepts any deck.gl Layer instance

#### Scenario: User understands view element type

- **WHEN** user reads JSX Element Types section
- **THEN** they see `<view>` element type definition showing `view: View` prop
- **AND** they see `ref` and `children` optional props
- **AND** they understand view prop accepts any deck.gl View instance

### Requirement: Custom layer typing explanation

The packages/types/README.md SHALL explain that custom layers work without JSX declarations.

#### Scenario: User creates custom layer with types

- **WHEN** user reads Custom Layer Typing section
- **THEN** they see example defining custom layer with generic parameter
- **AND** they see usage example with `<layer layer={new MyCustomLayer<DataPoint>({...})} />`
- **AND** they see note stating "No JSX declaration needed!"
- **AND** they understand universal `<layer>` element accepts any Layer subclass

### Requirement: V2 type system explanation

The packages/types/README.md SHALL explain v2's universal element approach vs v1's layer-specific elements.

#### Scenario: User understands v2 type benefits

- **WHEN** user reads v2 Type System section
- **THEN** they see comparison: v2 universal `<layer>` vs v1 layer-specific `<scatterplotLayer>`
- **AND** they see benefits list: preserves generic type parameters, simpler definitions, no registration, works with any Layer subclass

### Requirement: Deprecated element types documentation

The packages/types/README.md SHALL document that v1 layer-specific elements are marked @deprecated.

#### Scenario: V1 user sees deprecation notice

- **WHEN** user reads v2 Type System section
- **THEN** they see Deprecated Element Types subsection
- **AND** they see example showing `@deprecated` JSDoc comment on scatterplotLayer
- **AND** they understand deprecated elements will be removed in v3

### Requirement: TypeScript configuration guidance

The packages/types/README.md SHALL provide TypeScript configuration guidance if needed.

#### Scenario: User checks TypeScript setup

- **WHEN** user reads TypeScript Configuration section
- **THEN** they see note stating "No special configuration needed!"
- **AND** they see example tsconfig.json with jsx and types settings
- **AND** they understand types are automatically picked up

### Requirement: Concise length target

The packages/types/README.md SHALL be approximately 150-200 lines.

#### Scenario: Type docs remain focused

- **WHEN** all sections are written
- **THEN** total length is between 130-220 lines
- **AND** content showcases TypeScript features without excessive detail

### Requirement: Use accelint-readme-writer and humanizer skills

The packages/types/README.md MUST be generated using the accelint-readme-writer skill and processed with the humanizer skill to remove AI-sounding prose.

#### Scenario: Implementation uses required skills

- **WHEN** implementing the types package README
- **THEN** the accelint-readme-writer skill is invoked to generate the content
- **AND** the humanizer skill is invoked to remove AI-generated writing patterns
- **AND** the final content sounds natural and human-written
