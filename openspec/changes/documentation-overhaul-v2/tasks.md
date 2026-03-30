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

- [ ] 2.1.1 Write header section with package name and tagline
- [ ] 2.1.2 Add installation instructions (pnpm/npm/yarn)
- [ ] 2.1.3 Add requirements notice (React 19, deck.gl ^9.1.0)
- [ ] 2.1.4 Write table of contents with anchor links

### 2.2 Quick Start

- [ ] 2.2.1 Write single "Hello World" example with ScatterplotLayer
- [ ] 2.2.2 Add link to examples directory for more patterns

### 2.3 Core Concepts: Deckgl Component

- [ ] 2.3.1 Write <Deckgl> component overview (root container)
- [ ] 2.3.2 Document interleaved prop for basemap integration
- [ ] 2.3.3 Document common props (width, height, parameters)

### 2.4 Core Concepts: Layer Element

- [ ] 2.4.1 Write <layer> element introduction
- [ ] 2.4.2 Add "Why this syntax?" explanation (no registration, code-splitting)
- [ ] 2.4.3 Add Layer IDs Are Critical section with good/bad examples
- [ ] 2.4.4 Explain what happens when IDs are missing (performance issues)

### 2.5 Core Concepts: View Element

- [ ] 2.5.1 Write <view> element introduction
- [ ] 2.5.2 Add simple multi-view example with MapView
- [ ] 2.5.3 Add note about no automatic layer filtering

### 2.6 Core Concepts: Validation

- [ ] 2.6.1 Inline Development Mode Validation section from docs/VALIDATION.md
- [ ] 2.6.2 Document validation warnings (missing IDs, duplicate IDs)
- [ ] 2.6.3 Add note about production vs development behavior

### 2.7 API Reference: Deckgl Props

- [ ] 2.7.1 Create props table for <Deckgl /> component
- [ ] 2.7.2 Document interleaved prop
- [ ] 2.7.3 Document width, height, parameters props
- [ ] 2.7.4 Document other common props (onLoad, onViewStateChange, etc.)

### 2.8 API Reference: useDeckgl Hook

- [ ] 2.8.1 Write useDeckgl() hook documentation
- [ ] 2.8.2 Add code example showing hook usage
- [ ] 2.8.3 Add note about checking for null before using instance

### 2.9 API Reference: Layer and View Props

- [ ] 2.9.1 Document <layer> element props (layer prop is required)
- [ ] 2.9.2 Document <view> element props (view prop is required)
- [ ] 2.9.3 Add TypeScript generic note for type safety

### 2.10 Common Patterns: Basemap Integration

- [ ] 2.10.1 Write basemap integration introduction
- [ ] 2.10.2 Add react-map-gl integration example
- [ ] 2.10.3 Add note about wrapping pattern (Map wraps Deckgl, not vice versa)
- [ ] 2.10.4 Link to examples/react-map-gl

### 2.11 Common Patterns: Multiple Views

- [ ] 2.11.1 Write multiple views pattern introduction
- [ ] 2.11.2 Add code example with MapView and OrthographicView
- [ ] 2.11.3 Link to examples/views

### 2.12 Common Patterns: Custom Layers

- [ ] 2.12.1 Write custom layers introduction (v2 vs v1)
- [ ] 2.12.2 Document v2 approach: <layer layer={new CustomLayer()} />
- [ ] 2.12.3 Add TypeScript declaration example (IntrinsicElements)
- [ ] 2.12.4 Document v1 approach: extend() function (deprecated)
- [ ] 2.12.5 Link to examples/custom-layer

### 2.13 Migration from v1

- [ ] 2.13.1 Inline migration overview from docs/MIGRATION.md
- [ ] 2.13.2 Add syntax comparison table (v1 vs v2)
- [ ] 2.13.3 Document key changes (universal <layer>, no registration)
- [ ] 2.13.4 Add migration steps (install, update imports, replace elements)
- [ ] 2.13.5 Document deprecations (extend(), side-effects import)

### 2.14 Backwards Compatibility

- [ ] 2.14.1 Write backwards compatibility notice (v1 syntax deprecated)
- [ ] 2.14.2 Document v1 syntax still works (ScatterplotLayer element)
- [ ] 2.14.3 Add deprecation timeline notice
- [ ] 2.14.4 Encourage migration to v2 syntax

### 2.15 Polish and Cleanup

- [ ] 2.15.1 Use humanizer skill to remove AI-sounding prose
- [ ] 2.15.2 Remove all emoji usage
- [ ] 2.15.3 Verify all anchor links work correctly
- [ ] 2.15.4 Verify all external links are valid
- [ ] 2.15.5 Run ultracite fix on packages/dom/README.md
- [ ] 2.15.6 Verify README is between 600-800 lines

## 3. Reconciler Package README (Architecture Deep-Dive)

### 3.1 Setup and Header

- [ ] 3.1.1 Write header with "internal package" notice
- [ ] 3.1.2 Add installation instructions (usually not needed directly)
- [ ] 3.1.3 Write table of contents

### 3.2 Architecture Overview

- [ ] 3.2.1 Write "What is a React Reconciler?" introduction
- [ ] 3.2.2 Explain persistence mode vs mutation mode
- [ ] 3.2.3 Add deck.gl quote about descriptor objects
- [ ] 3.2.4 Write reconciler pipeline overview

### 3.3 Key Concepts: Instance Nodes

- [ ] 3.3.1 Document instance node structure
- [ ] 3.3.2 Add type definition example
- [ ] 3.3.3 Explain how nodes map to deck.gl objects

### 3.4 Key Concepts: Tree Flattening

- [ ] 3.4.1 Write tree flattening explanation
- [ ] 3.4.2 Add input/output example (nested JSX to flat array)
- [ ] 3.4.3 Explain why this matters for deck.gl

### 3.5 Key Concepts: ID-Based Diffing

- [ ] 3.5.1 Explain deck.gl's ID-based diffing
- [ ] 3.5.2 Document why missing IDs break diffing
- [ ] 3.5.3 Document why duplicate IDs cause bugs

### 3.6 Development Mode Features

- [ ] 3.6.1 Document validation system (missing IDs, duplicates)
- [ ] 3.6.2 Document warning messages
- [ ] 3.6.3 Add note about production behavior (no validation)

### 3.7 v2 Changes

- [ ] 3.7.1 Write pass-through architecture section (v2 vs v1)
- [ ] 3.7.2 Document universal <layer> and <view> elements
- [ ] 3.7.3 Document removed registration requirement
- [ ] 3.7.4 Document deprecated APIs (extend, side-effects)

### 3.8 Implementation Details

- [ ] 3.8.1 Document reconciler configuration
- [ ] 3.8.2 Document suspense support (concurrent mode ready)
- [ ] 3.8.3 Document refs behavior

### 3.9 Polish and Cleanup

- [ ] 3.9.1 Add related packages section (link to dom, types)
- [ ] 3.9.2 Add references section (React reconciler docs, deck.gl docs)
- [ ] 3.9.3 Use humanizer skill to remove AI-sounding prose
- [ ] 3.9.4 Remove all emoji usage
- [ ] 3.9.5 Run ultracite fix on packages/reconciler/README.md
- [ ] 3.9.6 Verify README is between 250-300 lines

## 4. Types Package README (TypeScript Guide)

### 4.1 Setup and Header

- [ ] 4.1.1 Write header with "auto-included" notice
- [ ] 4.1.2 Add installation notice (comes with dom package)
- [ ] 4.1.3 Write table of contents

### 4.2 Overview

- [ ] 4.2.1 Write overview of what types package provides
- [ ] 4.2.2 Explain auto-inclusion with @deckgl-fiber-renderer/dom

### 4.3 Generic Type Parameters

- [ ] 4.3.1 Write generic type parameters introduction
- [ ] 4.3.2 Add with/without generics comparison example
- [ ] 4.3.3 Show autocomplete benefits

### 4.4 JSX Element Types

- [ ] 4.4.1 Document <layer> element TypeScript support
- [ ] 4.4.2 Document <view> element TypeScript support
- [ ] 4.4.3 Add code example with IntelliSense comments

### 4.5 Custom Layer Typing

- [ ] 4.5.1 Write custom layer typing introduction
- [ ] 4.5.2 Add example extending IntrinsicElements
- [ ] 4.5.3 Document no JSX declaration needed for v2

### 4.6 v2 Type System

- [ ] 4.6.1 Document universal elements type support
- [ ] 4.6.2 Add v2 vs v1 type system comparison
- [ ] 4.6.3 Document deprecated element types with @deprecated tags

### 4.7 TypeScript Configuration

- [ ] 4.7.1 Add tsconfig.json example
- [ ] 4.7.2 Document required compiler options (jsx, moduleResolution)

### 4.8 Polish and Cleanup

- [ ] 4.8.1 Add related packages section (link to dom, reconciler)
- [ ] 4.8.2 Use humanizer skill to remove AI-sounding prose
- [ ] 4.8.3 Remove all emoji usage
- [ ] 4.8.4 Run ultracite fix on packages/types/README.md
- [ ] 4.8.5 Verify README is between 150-200 lines

## 5. Delete Old Documentation Files

- [ ] 5.1 Delete docs/REACT_PATTERNS.md
- [ ] 5.2 Delete docs/MIGRATION.md
- [ ] 5.3 Delete docs/VALIDATION.md
- [ ] 5.4 Verify docs/ directory state

## 6. Verification and Quality

- [ ] 6.1 Verify cross-references between READMEs
- [ ] 6.2 Verify all internal anchor links work
- [ ] 6.3 Verify all external links are valid
- [ ] 6.4 Check markdown renders correctly on GitHub
- [ ] 6.5 Search for references to deleted docs/ files
- [ ] 6.6 Run pnpm exec oxfmt on all changed files
- [ ] 6.7 Verify git diff shows only intended changes

## 7. Final Review

- [ ] 7.1 Review main README (clear value prop, under 250 lines)
- [ ] 7.2 Review dom README (focused, essential content, 600-800 lines)
- [ ] 7.3 Review reconciler README (architecture focus, 250-300 lines)
- [ ] 7.4 Review types README (TypeScript showcase, 150-200 lines)
- [ ] 7.5 Verify v2 syntax is prominent throughout
- [ ] 7.6 Verify v1 syntax is in "Backwards Compatibility" sections only
- [ ] 7.7 Verify comparison tables show our advantages clearly
