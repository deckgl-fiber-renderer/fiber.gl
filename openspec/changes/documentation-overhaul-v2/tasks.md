## 1. Main README (Marketing Landing Page)

- [ ] 1.1 Use accelint-readme-writer skill to generate main README with marketing focus
- [ ] 1.2 Write hero section with "A React renderer for deck.gl" tagline and quick links
- [ ] 1.3 Write "Why This Exists" section with comparison table (official bindings vs ours)
- [ ] 1.4 Write "What It Looks Like" section with hooks + nesting code example
- [ ] 1.5 Write features bullet list highlighting v2 improvements
- [ ] 1.6 Write Quick Start section with installation and minimal example
- [ ] 1.7 Write Examples Gallery section with categorized links to examples/
- [ ] 1.8 Add Requirements, Contributing, License, and Acknowledgments sections
- [ ] 1.9 Use humanizer skill to remove AI-sounding prose from README.md
- [ ] 1.10 Verify main README is under 250 lines
- [ ] 1.11 Run ultracite fix on README.md

## 2. Dom Package README (Comprehensive Reference)

- [ ] 2.1 Use accelint-readme-writer skill to generate comprehensive dom package README
- [ ] 2.2 Write header with installation, requirements, and table of contents
- [ ] 2.3 Write Getting Started section with 4 quick examples (use placeholders with TODO markers)
- [ ] 2.4 Write Core Concepts: <Deckgl> component subsection
- [ ] 2.5 Write Core Concepts: <layer> element subsection with "Why this syntax?" explanation
- [ ] 2.6 Write Core Concepts: <view> element subsection with multi-view example
- [ ] 2.7 Inline content from docs/REACT_PATTERNS.md: "Layer IDs Are Critical" subsection
- [ ] 2.8 Inline content from docs/REACT_PATTERNS.md: "Layer Lifecycle Pattern" subsection
- [ ] 2.9 Inline content from docs/REACT_PATTERNS.md: "Update Triggers" subsection with table
- [ ] 2.10 Inline content from docs/VALIDATION.md: "Development Mode Validation" subsection
- [ ] 2.11 Write API Reference: <Deckgl /> props table
- [ ] 2.12 Write API Reference: useDeckgl() hook documentation
- [ ] 2.13 Write API Reference: <layer> and <view> element props tables
- [ ] 2.14 Write Common Patterns: Basemap Integration subsection (use placeholder examples)
- [ ] 2.15 Write Common Patterns: Multiple Views subsection (use placeholder examples)
- [ ] 2.16 Write Common Patterns: Custom Layers subsection (use placeholder examples)
- [ ] 2.17 Inline content from docs/REACT_PATTERNS.md: "Dynamic Layer Lists" subsection
- [ ] 2.18 Inline content from docs/REACT_PATTERNS.md: "Conditional Rendering vs Visibility" subsection
- [ ] 2.19 Write Common Patterns: Using Hooks, Server-Side Rendering, State Management subsections
- [ ] 2.20 Inline content from docs/MIGRATION.md: "Migration from v1" section with syntax comparison table
- [ ] 2.21 Inline content from docs/MIGRATION.md: v1 migration steps and troubleshooting
- [ ] 2.22 Write Troubleshooting section with common issues and solutions
- [ ] 2.23 Write "Comparison with Official deck.gl React Bindings" section with feature table
- [ ] 2.24 Write Advanced Topics section with reconciler architecture summary and links
- [ ] 2.25 Write "Backwards Compatibility (v1 Syntax)" section at bottom, marked deprecated
- [ ] 2.26 Add Related Packages links section (reconciler and types packages)
- [ ] 2.27 Use humanizer skill to remove AI-sounding prose from packages/dom/README.md
- [ ] 2.28 Verify dom README is between 1100-1600 lines
- [ ] 2.29 Run ultracite fix on packages/dom/README.md

## 3. Reconciler Package README (Architecture Deep-Dive)

- [ ] 3.1 Use accelint-readme-writer skill to generate reconciler package README
- [ ] 3.2 Write header with "internal package" notice and installation
- [ ] 3.3 Write Architecture Overview: "What is a React Reconciler?" subsection
- [ ] 3.4 Write Architecture Overview: "Persistence Mode" subsection with deck.gl quote
- [ ] 3.5 Write Architecture Overview: Reconciler Pipeline diagram (ASCII or code)
- [ ] 3.6 Write Key Concepts: "Instance Nodes" subsection with type definition
- [ ] 3.7 Write Key Concepts: "Tree Flattening" subsection with input/output example
- [ ] 3.8 Write Key Concepts: "ID-Based Diffing" subsection explaining why IDs matter
- [ ] 3.9 Write Development Mode Features: validation warnings subsections
- [ ] 3.10 Write v2 Changes: "Pass-Through Architecture" subsection comparing v1 vs v2
- [ ] 3.11 Write v2 Changes: "Universal <layer> and <view> Elements" subsection
- [ ] 3.12 Write Deprecated APIs section for side-effects import and extend() function
- [ ] 3.13 Write Implementation Details: reconciler configuration, suspense, refs subsections
- [ ] 3.14 Add Related Packages and References sections with links
- [ ] 3.15 Use humanizer skill to remove AI-sounding prose from packages/reconciler/README.md
- [ ] 3.16 Verify reconciler README is between 225-325 lines
- [ ] 3.17 Run ultracite fix on packages/reconciler/README.md

## 4. Types Package README (TypeScript Guide)

- [ ] 4.1 Use accelint-readme-writer skill to generate types package README
- [ ] 4.2 Write header with "auto-included" notice and installation
- [ ] 4.3 Write Overview section explaining what types package provides
- [ ] 4.4 Write Key Features: "Generic Type Parameters" subsection with with/without comparison
- [ ] 4.5 Write Key Features: "JSX Element Types" subsection documenting <layer> and <view>
- [ ] 4.6 Write Key Features: "Custom Layer Typing" subsection with example
- [ ] 4.7 Write v2 Type System: "Universal Elements" subsection comparing v2 vs v1
- [ ] 4.8 Write v2 Type System: "Deprecated Element Types" subsection with @deprecated examples
- [ ] 4.9 Write TypeScript Configuration section with tsconfig.json example
- [ ] 4.10 Add Related Packages links section
- [ ] 4.11 Use humanizer skill to remove AI-sounding prose from packages/types/README.md
- [ ] 4.12 Verify types README is between 130-220 lines
- [ ] 4.13 Run ultracite fix on packages/types/README.md

## 5. Delete Old Documentation Files

- [ ] 5.1 Delete docs/REACT_PATTERNS.md (content inlined into packages/dom/README.md)
- [ ] 5.2 Delete docs/MIGRATION.md (content inlined into packages/dom/README.md)
- [ ] 5.3 Delete docs/VALIDATION.md (content inlined into packages/dom/README.md)
- [ ] 5.4 Verify docs/ directory is empty or only contains files that should remain

## 6. Verification and Quality

- [ ] 6.1 Verify all cross-references between READMEs point to valid sections
- [ ] 6.2 Verify all internal anchor links work correctly
- [ ] 6.3 Verify all external links are valid (deck.gl docs, React reconciler docs, etc.)
- [ ] 6.4 Check that markdown renders correctly on GitHub preview
- [ ] 6.5 Search for any remaining references to deleted docs/ files and update them
- [ ] 6.6 Run pnpm exec oxfmt to format all changed files
- [ ] 6.7 Verify git diff shows only intended changes (4 READMEs modified, 3 docs deleted)

## 7. Final Review

- [ ] 7.1 Review main README: clear value prop, under 250 lines, funnels to dom README
- [ ] 7.2 Review dom README: comprehensive, all content inlined, v2 prominent, 1200-1500 lines
- [ ] 7.3 Review reconciler README: architecture focus, internal package notice, 250-300 lines
- [ ] 7.4 Review types README: TypeScript generics showcase, auto-included notice, 150-200 lines
- [ ] 7.5 Verify all placeholder examples are marked with [TODO: Update after examples overhaul]
- [ ] 7.6 Verify v1 syntax is only in "Backwards Compatibility" sections marked deprecated
- [ ] 7.7 Verify comparison tables clearly show official bindings limitations vs our features
