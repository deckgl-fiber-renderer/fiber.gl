## 1. Main README (Marketing Landing Page)

- [x] 1.1 Use accelint-readme-writer skill to generate main README with marketing focus
- [x] 1.2 Write hero section with "A React renderer for deck.gl" tagline and quick links
- [x] 1.3 Write "Why This Exists" section with comparison table (official bindings vs ours)
- [x] 1.4 Write "What It Looks Like" section with hooks + nesting code example
- [x] 1.5 Write features bullet list highlighting v2 improvements
- [x] 1.6 Write Quick Start section with installation and minimal example
- [x] 1.7 Write Examples Gallery section with categorized links to examples/
- [x] 1.8 Add Requirements, Contributing, License, and Acknowledgments sections
- [x] 1.9 Use humanizer skill to remove AI-sounding prose from README.md
- [x] 1.10 Verify main README is under 250 lines
- [x] 1.11 Run ultracite fix on README.md

## 2. Dom Package README (Focused Reference)

### 2.1 Setup and Header

- [x] 2.1.1 Write header section with package name and tagline
- [x] 2.1.2 Add installation instructions (pnpm/npm/yarn)
- [x] 2.1.3 Add requirements notice (React 19, deck.gl ^9.1.0)
- [x] 2.1.4 Write table of contents with anchor links

### 2.2 Quick Start

- [x] 2.2.1 Write single "Hello World" example with ScatterplotLayer
- [x] 2.2.2 Add link to examples directory for more patterns

### 2.3 Core Concepts: Deckgl Component

- [x] 2.3.1 Write <Deckgl> component overview (root container)
- [x] 2.3.2 Document interleaved prop for basemap integration
- [x] 2.3.3 Document common props (width, height, parameters)

### 2.4 Core Concepts: Layer Element

- [x] 2.4.1 Write <layer> element introduction
- [x] 2.4.2 Add "Why this syntax?" explanation (no registration, code-splitting)
- [x] 2.4.3 Add Layer IDs Are Critical section with good/bad examples
- [x] 2.4.4 Explain what happens when IDs are missing (performance issues)

### 2.5 Core Concepts: View Element

- [x] 2.5.1 Write <view> element introduction
- [x] 2.5.2 Add simple multi-view example with MapView
- [x] 2.5.3 Add note about no automatic layer filtering

### 2.6 Core Concepts: Validation

- [x] 2.6.1 Inline Development Mode Validation section from docs/VALIDATION.md
- [x] 2.6.2 Document validation warnings (missing IDs, duplicate IDs)
- [x] 2.6.3 Add note about production vs development behavior

### 2.7 API Reference: Deckgl Props

- [x] 2.7.1 Create props table for <Deckgl /> component
- [x] 2.7.2 Document interleaved prop
- [x] 2.7.3 Document width, height, parameters props
- [x] 2.7.4 Document other common props (onLoad, onViewStateChange, etc.)

### 2.8 API Reference: useDeckgl Hook

- [x] 2.8.1 Write useDeckgl() hook documentation
- [x] 2.8.2 Add code example showing hook usage
- [x] 2.8.3 Add note about checking for null before using instance

### 2.9 API Reference: Layer and View Props

- [x] 2.9.1 Document <layer> element props (layer prop is required)
- [x] 2.9.2 Document <view> element props (view prop is required)
- [x] 2.9.3 Add TypeScript generic note for type safety

### 2.10 Common Patterns: Basemap Integration

- [x] 2.10.1 Write basemap integration introduction
- [x] 2.10.2 Add react-map-gl integration example
- [x] 2.10.3 Add note about wrapping pattern (Map wraps Deckgl, not vice versa)
- [x] 2.10.4 Link to examples/react-map-gl

### 2.11 Common Patterns: Multiple Views

- [x] 2.11.1 Write multiple views pattern introduction
- [x] 2.11.2 Add code example with MapView and OrthographicView
- [x] 2.11.3 Link to examples/views

### 2.12 Common Patterns: Custom Layers

- [x] 2.12.1 Write custom layers introduction (v2 vs v1)
- [x] 2.12.2 Document v2 approach: <layer layer={new CustomLayer()} />
- [x] 2.12.3 Add TypeScript declaration example (IntrinsicElements)
- [x] 2.12.4 Document v1 approach: extend() function (deprecated)
- [x] 2.12.5 Link to examples/custom-layer

### 2.13 Migration from v1

- [x] 2.13.1 Inline migration overview from docs/MIGRATION.md
- [x] 2.13.2 Add syntax comparison table (v1 vs v2)
- [x] 2.13.3 Document key changes (universal <layer>, no registration)
- [x] 2.13.4 Add migration steps (install, update imports, replace elements)
- [x] 2.13.5 Document deprecations (extend(), side-effects import)

### 2.14 Backwards Compatibility

- [x] 2.14.1 Write backwards compatibility notice (v1 syntax deprecated)
- [x] 2.14.2 Document v1 syntax still works (ScatterplotLayer element)
- [x] 2.14.3 Add deprecation timeline notice
- [x] 2.14.4 Encourage migration to v2 syntax

### 2.15 Polish and Cleanup

- [x] 2.15.1 Use humanizer skill to remove AI-sounding prose
- [x] 2.15.2 Remove all emoji usage
- [x] 2.15.3 Verify all anchor links work correctly
- [x] 2.15.4 Verify all external links are valid
- [x] 2.15.5 Run ultracite fix on packages/dom/README.md
- [x] 2.15.6 Verify README is between 600-800 lines

## 3. Reconciler Package README (Architecture Deep-Dive)

### 3.1 Setup and Header

- [x] 3.1.1 Write header with "internal package" notice
- [x] 3.1.2 Add installation instructions (usually not needed directly)
- [x] 3.1.3 Write table of contents

### 3.2 Architecture Overview

- [x] 3.2.1 Write "What is a React Reconciler?" introduction
- [x] 3.2.2 Explain persistence mode vs mutation mode
- [x] 3.2.3 Add deck.gl quote about descriptor objects
- [x] 3.2.4 Write reconciler pipeline overview

### 3.3 Key Concepts: Instance Nodes

- [x] 3.3.1 Document instance node structure
- [x] 3.3.2 Add type definition example
- [x] 3.3.3 Explain how nodes map to deck.gl objects

### 3.4 Key Concepts: Tree Flattening

- [x] 3.4.1 Write tree flattening explanation
- [x] 3.4.2 Add input/output example (nested JSX to flat array)
- [x] 3.4.3 Explain why this matters for deck.gl

### 3.5 Key Concepts: ID-Based Diffing

- [x] 3.5.1 Explain deck.gl's ID-based diffing
- [x] 3.5.2 Document why missing IDs break diffing
- [x] 3.5.3 Document why duplicate IDs cause bugs

### 3.6 Development Mode Features

- [x] 3.6.1 Document validation system (missing IDs, duplicates)
- [x] 3.6.2 Document warning messages
- [x] 3.6.3 Add note about production behavior (no validation)

### 3.7 v2 Changes

- [x] 3.7.1 Write pass-through architecture section (v2 vs v1)
- [x] 3.7.2 Document universal <layer> and <view> elements
- [x] 3.7.3 Document removed registration requirement
- [x] 3.7.4 Document deprecated APIs (extend, side-effects)

### 3.8 Implementation Details

- [x] 3.8.1 Document reconciler configuration
- [x] 3.8.2 Document suspense support (concurrent mode ready)
- [x] 3.8.3 Document refs behavior

### 3.9 Polish and Cleanup

- [x] 3.9.1 Add related packages section (link to dom, types)
- [x] 3.9.2 Add references section (React reconciler docs, deck.gl docs)
- [x] 3.9.3 Use humanizer skill to remove AI-sounding prose
- [x] 3.9.4 Remove all emoji usage
- [x] 3.9.5 Run ultracite fix on packages/reconciler/README.md
- [x] 3.9.6 Verify README is between 250-300 lines

## 4. Types Package README (TypeScript Guide)

### 4.1 Setup and Header

- [x] 4.1.1 Write header with "auto-included" notice
- [x] 4.1.2 Add installation notice (comes with dom package)
- [x] 4.1.3 Write table of contents

### 4.2 Overview

- [x] 4.2.1 Write overview of what types package provides
- [x] 4.2.2 Explain auto-inclusion with @deckgl-fiber-renderer/dom

### 4.3 Generic Type Parameters

- [x] 4.3.1 Write generic type parameters introduction
- [x] 4.3.2 Add with/without generics comparison example
- [x] 4.3.3 Show autocomplete benefits

### 4.4 JSX Element Types

- [x] 4.4.1 Document <layer> element TypeScript support
- [x] 4.4.2 Document <view> element TypeScript support
- [x] 4.4.3 Add code example with IntelliSense comments

### 4.5 Custom Layer Typing

- [x] 4.5.1 Write custom layer typing introduction
- [x] 4.5.2 Add example extending IntrinsicElements
- [x] 4.5.3 Document no JSX declaration needed for v2

### 4.6 v2 Type System

- [x] 4.6.1 Document universal elements type support
- [x] 4.6.2 Add v2 vs v1 type system comparison
- [x] 4.6.3 Document deprecated element types with @deprecated tags

### 4.7 TypeScript Configuration

- [x] 4.7.1 Add tsconfig.json example
- [x] 4.7.2 Document required compiler options (jsx, moduleResolution)

### 4.8 Polish and Cleanup

- [x] 4.8.1 Add related packages section (link to dom, reconciler)
- [x] 4.8.2 Use humanizer skill to remove AI-sounding prose
- [x] 4.8.3 Remove all emoji usage
- [x] 4.8.4 Run ultracite fix on packages/types/README.md
- [x] 4.8.5 Verify README is between 150-200 lines

## 5. Delete Old Documentation Files

- [x] 5.1 Delete docs/REACT_PATTERNS.md
- [x] 5.2 Delete docs/MIGRATION.md
- [x] 5.3 Delete docs/VALIDATION.md
- [x] 5.4 Verify docs/ directory state

## 6. Verification and Quality

- [x] 6.1 Verify cross-references between READMEs
- [x] 6.2 Verify all internal anchor links work
- [x] 6.3 Verify all external links are valid
- [x] 6.4 Check markdown renders correctly on GitHub
- [x] 6.5 Search for references to deleted docs/ files
- [x] 6.6 Run pnpm exec oxfmt on all changed files
- [x] 6.7 Verify git diff shows only intended changes

## 7. Final Review

- [x] 7.1 Review main README (clear value prop, under 250 lines)
- [x] 7.2 Review dom README (focused, essential content, 600-800 lines)
- [x] 7.3 Review reconciler README (architecture focus, 250-300 lines)
- [x] 7.4 Review types README (TypeScript showcase, 150-200 lines)
- [x] 7.5 Verify v2 syntax is prominent throughout
- [x] 7.6 Verify v1 syntax is in "Backwards Compatibility" sections only
- [x] 7.7 Verify comparison tables show our advantages clearly
