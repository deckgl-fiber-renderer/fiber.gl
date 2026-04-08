# reconciler-package-readme Specification

## Purpose

TBD - created by archiving change documentation-overhaul-v2. Update Purpose after archive.

## Requirements

### Requirement: Internal package positioning

The packages/reconciler/README.md SHALL clearly position itself as an internal package with notice directing most users to @deckgl-fiber-renderer/dom.

#### Scenario: User discovers reconciler package

- **WHEN** user visits npmjs.com page for @deckgl-fiber-renderer/reconciler
- **THEN** they see prominent notice stating "This is an internal package"
- **AND** they see recommendation to install @deckgl-fiber-renderer/dom instead
- **AND** they understand this package is for contributors and curious users

### Requirement: React reconciler explanation

The packages/reconciler/README.md SHALL explain what a React reconciler is and how it differs from React core.

#### Scenario: Contributor learns about reconcilers

- **WHEN** contributor reads Architecture Overview section
- **THEN** they see "What is a React Reconciler?" subsection
- **AND** they see comparison: react-dom → Browser DOM, react-native → Native components, deckgl-fiber-renderer → deck.gl layers
- **AND** they understand reconcilers handle where React renders

### Requirement: Persistence mode explanation

The packages/reconciler/README.md SHALL explain why persistence mode is used and how it aligns with deck.gl's layer design.

#### Scenario: Contributor understands persistence mode choice

- **WHEN** contributor reads Architecture Overview section
- **THEN** they see "Persistence Mode" subsection explaining every update creates new tree
- **AND** they see quote from deck.gl docs: "layers are descriptor objects that are very cheap to instantiate"
- **AND** they understand persistence mode aligns with deck.gl's immutable descriptor philosophy

### Requirement: Reconciler pipeline visualization

The packages/reconciler/README.md SHALL include a diagram showing the reconciler pipeline from React elements to deck.setProps.

#### Scenario: Contributor traces render flow

- **WHEN** contributor reads Architecture Overview section
- **THEN** they see reconciler pipeline diagram showing: React Element Tree → createElement → createInstance → appendChild → flattenTree → organizeList → commitUpdate → deck.setProps
- **AND** they understand how JSX becomes deck.gl layer arrays

### Requirement: Tree flattening explanation

The packages/reconciler/README.md SHALL explain how JSX hierarchy is flattened before passing to deck.gl.

#### Scenario: Contributor understands flattening

- **WHEN** contributor reads Key Concepts section
- **THEN** they see "Tree Flattening" subsection with input JSX hierarchy example
- **AND** they see flattened output showing views and layers arrays
- **AND** they understand hierarchy is organizational only unless using layerFilter

### Requirement: ID-based diffing explanation

The packages/reconciler/README.md SHALL explain why explicit layer IDs are critical for deck.gl's diffing.

#### Scenario: Contributor understands ID importance

- **WHEN** contributor reads Key Concepts section
- **THEN** they see "ID-Based Diffing" subsection
- **AND** they understand reconciler doesn't diff layers, deck.gl does
- **AND** they understand missing IDs cause deck.gl to treat layers as new

### Requirement: Development mode features documentation

The packages/reconciler/README.md SHALL document all development-mode validation features.

#### Scenario: Contributor learns about validations

- **WHEN** contributor reads Development Mode Features section
- **THEN** they see "Missing ID Validation" subsection with warning message example
- **AND** they see "Duplicate ID Detection" subsection with error message example
- **AND** they see "Deprecation Warnings" subsection for v1 syntax
- **AND** they understand all validations are stripped in production builds

### Requirement: V2 architecture changes explanation

The packages/reconciler/README.md SHALL explain v2's pass-through architecture vs v1's catalogue system.

#### Scenario: Contributor understands v2 changes

- **WHEN** contributor reads v2 Changes section
- **THEN** they see "Pass-Through Architecture" subsection comparing v1 vs v2
- **AND** they see v1 reconciler constructed layers from catalogue
- **AND** they see v2 reconciler extracts user-instantiated layers
- **AND** they see benefits: preserves TypeScript generics, no registration, explicit lifecycle

### Requirement: Deprecated APIs documentation

The packages/reconciler/README.md SHALL document deprecated side-effects import and extend() function.

#### Scenario: Contributor sees deprecated APIs

- **WHEN** contributor reads Deprecated APIs section
- **THEN** they see side-effects import marked "❌ Deprecated in v2, removed in v3"
- **AND** they see extend() function marked "❌ Deprecated in v2, removed in v3"
- **AND** they understand layer registration is no longer needed

### Requirement: Ref behavior documentation

The packages/reconciler/README.md SHALL document that refs expose actual deck.gl Layer/View instances.

#### Scenario: Contributor learns about refs

- **WHEN** contributor reads Implementation Details section
- **THEN** they see "Refs" subsection
- **AND** they see example showing ref exposes actual deck.gl layer
- **AND** they understand layerRef.current is the Layer instance with all methods

### Requirement: Moderate length target

The packages/reconciler/README.md SHALL be approximately 250-300 lines.

#### Scenario: Architecture docs remain focused

- **WHEN** all sections are written
- **THEN** total length is between 225-325 lines
- **AND** content covers architecture without excessive implementation detail

### Requirement: Use accelint-readme-writer and humanizer skills

The packages/reconciler/README.md MUST be generated using the accelint-readme-writer skill and processed with the humanizer skill to remove AI-sounding prose.

#### Scenario: Implementation uses required skills

- **WHEN** implementing the reconciler package README
- **THEN** the accelint-readme-writer skill is invoked to generate the content
- **AND** the humanizer skill is invoked to remove AI-generated writing patterns
- **AND** the final content sounds natural and human-written
