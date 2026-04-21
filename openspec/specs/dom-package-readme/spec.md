# dom-package-readme Specification

## Purpose

TBD - created by archiving change documentation-overhaul-v2. Update Purpose after archive.

## Requirements

### Requirement: Comprehensive single-source-of-truth documentation

The packages/dom/README.md SHALL consolidate all user-facing documentation by inlining content from docs/REACT_PATTERNS.md, docs/MIGRATION.md, and docs/VALIDATION.md.

#### Scenario: User finds complete docs in one place

- **WHEN** user visits npmjs.com package page for @deckgl-fiber-renderer/dom
- **THEN** they see comprehensive documentation covering all concepts, patterns, and migration guide
- **AND** they do not need to navigate to separate docs/ files

### Requirement: Core concepts section with pattern explanations

The packages/dom/README.md SHALL include a Core Concepts section (~300 lines) explaining critical patterns inline.

#### Scenario: User learns about layer IDs

- **WHEN** user reads Core Concepts section
- **THEN** they see "Layer IDs Are Critical ⚠️" subsection explaining why explicit IDs matter
- **AND** they see good vs bad examples with ✅ and ❌ markers
- **AND** they understand missing IDs cause expensive reinitialization

#### Scenario: User understands layer lifecycle

- **WHEN** user reads Core Concepts section
- **THEN** they see "Layer Lifecycle Pattern" subsection explaining why creating new instances each render is correct
- **AND** they understand deck.gl layers are cheap descriptor objects
- **AND** they see examples showing inline layer creation vs memoization anti-pattern

#### Scenario: User learns about update triggers

- **WHEN** user reads Core Concepts section
- **THEN** they see "Update Triggers" subsection explaining when to use updateTriggers
- **AND** they see table showing accessor patterns requiring updateTriggers
- **AND** they understand updateTriggers notify deck.gl to recompute attributes

#### Scenario: User understands development validation

- **WHEN** user reads Core Concepts section
- **THEN** they see "Development Mode Validation" subsection explaining missing ID warnings and duplicate ID errors
- **AND** they understand validations are stripped in production builds

### Requirement: Common patterns section with React integration

The packages/dom/README.md SHALL include a Common Patterns section (~400 lines) with React-specific integration examples.

#### Scenario: User integrates with MapLibre basemap

- **WHEN** user reads Common Patterns section
- **THEN** they see "Basemap Integration" subsection with interleaved pattern example
- **AND** the example shows using react-map-gl with useControl hook

#### Scenario: User renders dynamic layer lists

- **WHEN** user reads Common Patterns section
- **THEN** they see "Dynamic Layer Lists" subsection explaining both React key and deck.gl id requirements
- **AND** they understand why both are needed and what happens when missing

#### Scenario: User toggles layer visibility

- **WHEN** user reads Common Patterns section
- **THEN** they see "Conditional Rendering vs Visibility" subsection comparing performance
- **AND** they see table showing when to use visible prop vs conditional rendering

### Requirement: Migration guide inlined from docs/MIGRATION.md

The packages/dom/README.md SHALL include a "Migration from v1" section (~200 lines) with complete migration instructions.

#### Scenario: V1 user wants to migrate

- **WHEN** user reads Migration from v1 section
- **THEN** they see "Why Migrate?" explaining v2 improvements
- **AND** they see syntax comparison table showing v1 vs v2 patterns
- **AND** they see step-by-step migration instructions
- **AND** they see troubleshooting subsection for common migration issues

### Requirement: Comparison with official deck.gl React bindings

The packages/dom/README.md SHALL include a comparison section (~100 lines) contrasting with official bindings.

#### Scenario: User evaluates library choice

- **WHEN** user reads Comparison with Official Bindings section
- **THEN** they see feature comparison table
- **AND** they see "When to use official bindings" guidance
- **AND** they see "When to use deckgl-fiber-renderer" guidance

### Requirement: V2 syntax prominently positioned

The packages/dom/README.md SHALL show v2 syntax in all primary examples with v1 syntax relegated to bottom section marked deprecated.

#### Scenario: New user learns correct patterns

- **WHEN** user reads any example in Core Concepts, Common Patterns, or API Reference sections
- **THEN** they see v2 syntax using `<layer layer={new LayerClass({...})} />`
- **AND** they do not see v1 syntax in primary sections

#### Scenario: V1 user finds backward compatibility info

- **WHEN** user scrolls to bottom of documentation
- **THEN** they see "Backwards Compatibility (v1 Syntax)" section
- **AND** the section is marked "⚠️ Deprecated"
- **AND** the section explains v1 syntax is supported in v2 but removed in v3

### Requirement: Placeholder examples marked for future update

The packages/dom/README.md SHALL use placeholder code examples marked with `[TODO: Update after examples overhaul]`.

#### Scenario: Example placeholder is clear

- **WHEN** contributor reads example code
- **THEN** they see `[TODO: Update after examples overhaul]` comment at top of code block
- **AND** the placeholder contains minimal but valid example code

### Requirement: API reference with complete prop documentation

The packages/dom/README.md SHALL include an API Reference section (~200 lines) documenting all exports.

#### Scenario: User looks up Deckgl props

- **WHEN** user reads API Reference section
- **THEN** they see `<Deckgl />` props table with all properties
- **AND** each prop includes: name, type, and description

#### Scenario: User looks up useDeckgl hook

- **WHEN** user reads API Reference section
- **THEN** they see `useDeckgl()` hook documentation
- **AND** they see example showing hook returns null until initialized

#### Scenario: User looks up layer element

- **WHEN** user reads API Reference section
- **THEN** they see `<layer>` element props table
- **AND** they understand layer prop is required and accepts Layer instance

#### Scenario: User looks up view element

- **WHEN** user reads API Reference section
- **THEN** they see `<view>` element props table
- **AND** they understand view prop is required and accepts View instance

### Requirement: Troubleshooting section with solutions

The packages/dom/README.md SHALL include a Troubleshooting section (~150 lines) covering common issues.

#### Scenario: User's layer recreates every render

- **WHEN** user reads Troubleshooting section
- **THEN** they see "Layer recreates on every render" entry
- **AND** they see cause: missing or non-stable ID
- **AND** they see solution: always provide explicit, stable IDs

#### Scenario: User's accessor functions don't update

- **WHEN** user reads Troubleshooting section
- **THEN** they see "Colors don't update when state changes" entry
- **AND** they see cause: missing updateTriggers
- **AND** they see solution with example

### Requirement: Table of contents for navigation

The packages/dom/README.md SHALL include a table of contents with anchor links to all major sections.

#### Scenario: User navigates to specific section

- **WHEN** user views table of contents
- **THEN** they see links to all major sections: Installation, Getting Started, Core Concepts, API Reference, Common Patterns, Migration, Troubleshooting, Comparison, Advanced Topics, Backwards Compatibility
- **AND** each link jumps to correct section

### Requirement: Comprehensive length target

The packages/dom/README.md SHALL be approximately 1200-1500 lines to accommodate consolidated content.

#### Scenario: All content fits in comprehensive document

- **WHEN** all sections are written
- **THEN** total length is between 1100-1600 lines
- **AND** content remains well-organized with clear section boundaries

### Requirement: Use accelint-readme-writer and humanizer skills

The packages/dom/README.md MUST be generated using the accelint-readme-writer skill and processed with the humanizer skill to remove AI-sounding prose.

#### Scenario: Implementation uses required skills

- **WHEN** implementing the dom package README
- **THEN** the accelint-readme-writer skill is invoked to generate the content
- **AND** the humanizer skill is invoked to remove AI-generated writing patterns
- **AND** the final content sounds natural and human-written
