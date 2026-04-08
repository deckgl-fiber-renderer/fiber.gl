# main-readme Specification

## Purpose

TBD - created by archiving change documentation-overhaul-v2. Update Purpose after archive.

## Requirements

### Requirement: Marketing-focused landing page structure

The main README.md SHALL serve as a marketing-focused landing page that clearly communicates value proposition and differentiates from official deck.gl React bindings.

#### Scenario: GitHub visitor discovers the library

- **WHEN** a developer visits the GitHub repository
- **THEN** they see a clear hero section explaining "A React renderer for deck.gl"
- **AND** they immediately understand the key differentiators from official bindings

#### Scenario: User evaluates alternatives

- **WHEN** a developer is choosing between this library and official deck.gl React bindings
- **THEN** they see a comparison table showing feature differences
- **AND** they understand this library provides full React reconciler capabilities

### Requirement: Clear differentiation from official bindings

The main README SHALL include a comparison table contrasting features with official deck.gl React bindings.

#### Scenario: Feature comparison displayed

- **WHEN** user reads "Why This Exists" section
- **THEN** they see a table with official bindings limitations marked with ❌
- **AND** they see deckgl-fiber-renderer capabilities marked with ✅
- **AND** the table includes: composition depth, hooks support, TypeScript generics, custom layer registration, code-splitting

### Requirement: Code example showcasing unique capabilities

The main README SHALL include a code example demonstrating hooks usage and deep nesting that official bindings cannot support.

#### Scenario: Hooks and nesting example shown

- **WHEN** user views "What It Looks Like" section
- **THEN** they see a code example using `useState` inside a layer-rendering component
- **AND** the example shows layers nested arbitrarily deep in component tree
- **AND** the example includes TypeScript generic type parameter on layer constructor

### Requirement: Quick start with minimal friction

The main README SHALL provide installation commands and a minimal working example.

#### Scenario: First-time user wants to try it

- **WHEN** user reaches Quick Start section
- **THEN** they see installation command for main package
- **AND** they see peer dependency installation command
- **AND** they see a basic working example under 20 lines
- **AND** the example includes explicit layer ID with ⚠️ importance notice

### Requirement: Examples gallery with links

The main README SHALL include an examples gallery section with links to working example projects.

#### Scenario: User wants to see real usage

- **WHEN** user looks for examples
- **THEN** they find an Examples Gallery section with categorized links
- **AND** each link includes: Basic Standalone, MapLibre Integration, Custom Layers, Multiple Views, Next.js, and framework-specific examples

### Requirement: Funnel to comprehensive documentation

The main README SHALL clearly direct users to `packages/dom/README.md` for complete API documentation.

#### Scenario: User needs detailed docs

- **WHEN** user finishes reading main README
- **THEN** they see prominent link to "Complete API Reference" in dom package
- **AND** they understand that npmjs.com page has comprehensive docs

### Requirement: Concise length constraint

The main README SHALL be approximately 200 lines or less to maintain focus and readability.

#### Scenario: Landing page remains scannable

- **WHEN** page is rendered
- **THEN** total length is under 250 lines
- **AND** all essential information fits without scrolling more than 2-3 screens

### Requirement: Use accelint-readme-writer and humanizer skills

The main README MUST be generated using the accelint-readme-writer skill and processed with the humanizer skill to remove AI-sounding prose.

#### Scenario: Implementation uses required skills

- **WHEN** implementing the main README
- **THEN** the accelint-readme-writer skill is invoked to generate the content
- **AND** the humanizer skill is invoked to remove AI-generated writing patterns
- **AND** the final content sounds natural and human-written
