## Why

The current documentation is fragmented and doesn't effectively communicate the library's value proposition. The main README and `packages/dom/README.md` are ~80% duplicated, the standalone `docs/` guides (while excellent) are disconnected from the primary READMEs, and the documentation doesn't clearly differentiate from deck.gl's official React bindings. Users need to understand why they should use this library over the official bindings, and the current docs don't make that case clearly. With v2's improved features (TypeScript generics, no registration, code-splitting), now is the time to restructure documentation to showcase these improvements and provide a clear, cohesive learning path.

## What Changes

- **Restructure main `README.md`** as a marketing landing page (~200 lines) that clearly differentiates from official deck.gl React bindings and funnels to comprehensive docs
- **Expand `packages/dom/README.md`** into a focused reference (~600-800 lines) by inlining essential content from `docs/REACT_PATTERNS.md`, `docs/MIGRATION.md`, and `docs/VALIDATION.md`
- **Rewrite `packages/reconciler/README.md`** (~250-300 lines) to explain reconciler architecture, persistence mode, and development features for users interested in internals
- **Rewrite `packages/types/README.md`** (~150-200 lines) to showcase TypeScript generic support and type system features
- **Delete** `docs/REACT_PATTERNS.md`, `docs/MIGRATION.md`, and `docs/VALIDATION.md` after inlining their content
- **Position v2 syntax prominently** throughout docs with v1 legacy syntax relegated to bottom sections marked deprecated
- **Add comparison table** showing feature differences between official deck.gl React bindings and deckgl-fiber-renderer
- **Keep examples concise** - link to examples directory for pattern exploration, let TypeScript guide API discovery

## Capabilities

### New Capabilities

- `main-readme`: Marketing-focused landing page that differentiates from official bindings and showcases v2 features (~200 lines)
- `dom-package-readme`: Focused API reference consolidating essential patterns, letting TypeScript and examples teach the rest (~600-800 lines)
- `reconciler-package-readme`: Architecture deep-dive explaining reconciler internals and persistence mode (~250-300 lines)
- `types-package-readme`: TypeScript type system guide showcasing generic type parameter support (~150-200 lines)

### Modified Capabilities

<!-- No existing spec requirements are changing - this is purely documentation work -->

## Impact

**Files Modified:**

- `README.md` - Rewritten as marketing landing page
- `packages/dom/README.md` - Expanded to comprehensive reference
- `packages/reconciler/README.md` - Rewritten with architecture focus
- `packages/types/README.md` - Rewritten with TypeScript focus

**Files Deleted:**

- `docs/REACT_PATTERNS.md` - Content inlined into `packages/dom/README.md`
- `docs/MIGRATION.md` - Content inlined into `packages/dom/README.md`
- `docs/VALIDATION.md` - Content inlined into `packages/dom/README.md`

**No Breaking Changes:** This is purely documentation work with no code changes.

**User Impact:**

- Users get clearer understanding of library value vs official bindings
- Consolidated documentation reduces confusion from fragmented guides
- Prominent v2 syntax helps new users adopt best practices
- Internal package docs help contributors understand architecture
