## Context

The current documentation is fragmented across multiple locations with significant duplication and unclear information architecture. The main `README.md` and `packages/dom/README.md` contain ~80% duplicate content, while excellent standalone guides in `docs/` (REACT_PATTERNS.md, MIGRATION.md, VALIDATION.md) are disconnected from the primary documentation. Users discovering the library need different information than users installing from npm, but the current structure doesn't serve either audience well.

With v2's significant improvements (TypeScript generics, no layer registration, automatic code-splitting), the documentation needs to clearly communicate value propositions and differentiate from deck.gl's official React bindings, which have significant limitations (direct children only, no hooks support, no TypeScript generics).

**Current State:**

- `README.md` (145 lines): Basic intro + links
- `packages/dom/README.md` (292 lines): Mostly duplicates main README
- `docs/REACT_PATTERNS.md` (499 lines): Excellent pattern guide
- `docs/MIGRATION.md` (570 lines): Comprehensive migration guide
- `docs/VALIDATION.md` (235 lines): Validation system explanation
- `packages/reconciler/README.md` (149 lines): Technical but sparse
- `packages/types/README.md` (52 lines): Minimal

**Inspiration from Similar Projects:**

- react-three-fiber: Clear hero section, "Does it have limitations?" upfront, minimal reconciler explanation
- pixi-react: Feature list, clear positioning vs base library
- Official deck.gl React bindings: Documented limitations we need to contrast against

## Goals / Non-Goals

**Goals:**

- Create distinct documentation roles: marketing landing (main README) vs comprehensive reference (dom README)
- Eliminate duplication by consolidating scattered guides into single comprehensive reference
- Clearly differentiate from official deck.gl React bindings with feature comparison table
- Position v2 syntax prominently with v1 legacy syntax at bottom as deprecated
- Use placeholder examples that will be replaced after examples overhaul
- Provide architecture deep-dive for contributors (reconciler README)
- Showcase TypeScript generic support prominently (types README)
- Inline all content from `docs/` guides and delete those files

**Non-Goals:**

- Updating actual example code in `examples/` directory (separate future work)
- Creating new example projects
- Changing any code implementation
- Modifying package.json descriptions or keywords
- Creating API documentation beyond what exists
- Adding screenshots or diagrams (future enhancement)

## Decisions

### Decision 1: Main README as Marketing Landing Page (~200 lines)

**Choice:** Rewrite `README.md` as a concise marketing-focused page that clearly differentiates from official bindings and funnels to comprehensive docs.

**Rationale:**

- GitHub visitors need persuasion, not detailed docs
- react-three-fiber pattern: simple hero, clear value prop, quick start
- Must answer "why not use official bindings?" immediately
- Short attention span - get to value quickly

**Structure:**

```
- Hero: "A React renderer for deck.gl"
- Why This Exists: Comparison table (official bindings vs ours)
- What It Looks Like: Code example showing hooks + nesting
- Features: Bullet list of killer features
- Quick Start: Minimal example
- Examples Gallery: Links
- Links to comprehensive docs
```

**Alternatives considered:**

- Keep comprehensive: Rejected - creates duplication, wrong audience
- Remove entirely: Rejected - GitHub landing page is critical for discovery

### Decision 2: Dom Package README as Focused Reference (~600-800 lines)

**Choice:** Expand `packages/dom/README.md` to cover essentials by inlining critical patterns from `docs/REACT_PATTERNS.md`, `docs/MIGRATION.md`, and `docs/VALIDATION.md`. Focus on what developers need to know upfront; let TypeScript and examples teach the rest.

**Rationale:**

- npm visitors have already decided to try it - they need essential documentation
- Three separate guides are hard to discover and navigate
- Pattern guides (IDs, lifecycle, update triggers) are core concepts, not optional reading
- Consolidation makes content searchable in one place
- TypeScript provides discovery for props and types
- Examples directory provides pattern exploration
- Documentation should be reference, not tutorial

**Structure:**

```
- Installation & Requirements
- Quick Start (single example)
- Core Concepts (~200 lines) ← Key patterns from REACT_PATTERNS
  - <Deckgl> component
  - <layer> element (why this syntax?)
  - <view> element
  - Layer IDs Are Critical
  - Development Mode Validation ← From VALIDATION.md
- API Reference (~150 lines)
  - <Deckgl /> props
  - useDeckgl() hook
  - <layer> and <view> props
- Common Patterns (~150 lines) ← Essential patterns only
  - Basemap Integration
  - Multiple Views
  - Custom Layers
- Migration from v1 (~100 lines) ← Inline from MIGRATION.md
- Backwards Compatibility (v1 Syntax) (~50 lines) ← At bottom, deprecated
```

**Alternatives considered:**

- Keep separate guides: Rejected - fragmentation hurts discoverability
- Create mega-doc with 1500+ lines: Rejected - too much, becomes a dissertation
- Keep links to docs/ guides: Rejected - we're deleting those files

### Decision 3: Keep Examples Minimal, Link to Examples Directory

**Choice:** Use minimal, focused code snippets in documentation and link to the `examples/` directory for comprehensive patterns.

**Rationale:**

- Examples directory is the source of truth for working code
- Documentation should show essential patterns only
- TypeScript IntelliSense provides prop discovery
- Linking to examples avoids duplication and coupling
- Developers learn best from working examples they can run
- Keeps documentation focused on concepts, not exhaustive tutorials

**Approach:**

```tsx
// Minimal example showing the concept
<layer
  layer={
    new ScatterplotLayer({
      id: "points",
      data: myData,
      getPosition: (d) => d.coordinates,
      getRadius: 100,
    })
  }
/>

// See examples/basic-app for complete working example
```

**Alternatives considered:**

- Use placeholder examples with TODOs: Rejected - creates maintenance burden
- Embed complete examples: Rejected - makes docs too long, creates duplication
- Use no examples: Rejected - code snippets are essential for understanding

### Decision 4: Reconciler README as Architecture Deep-Dive (~250-300 lines)

**Choice:** Rewrite `packages/reconciler/README.md` with focus on architecture explanation for contributors and curious users.

**Rationale:**

- Most users don't need reconciler internals (they use `@deckgl-fiber-renderer/dom`)
- Contributors need to understand persistence mode, tree flattening, ID-based diffing
- Helps maintainers onboard new contributors
- Positions package correctly: "internal package, most users want dom"

**Structure:**

```
- "This is an internal package" notice
- Architecture Overview
  - What is a React reconciler?
  - Why persistence mode?
  - Reconciler pipeline diagram
- Key Concepts (instance nodes, tree flattening, ID-based diffing)
- Development Mode Features (validation, warnings)
- v2 Changes (pass-through architecture, universal elements)
- Implementation Details
```

### Decision 5: Types README Showcasing TypeScript Generics (~150-200 lines)

**Choice:** Rewrite `packages/types/README.md` to prominently feature TypeScript generic support as the killer feature.

**Rationale:**

- TypeScript generics are a major v2 improvement over v1
- This is the differentiator from official bindings (they have no generic support)
- Type-safe accessor functions are compelling for TypeScript users
- "Auto-included with dom" notice prevents confusion

**Structure:**

```
- "Auto-included with dom package" notice
- Generic Type Parameters (with/without comparison)
- JSX Element Types (<layer>, <view>)
- Custom Layer Typing (no JSX declaration needed!)
- v2 Type System (universal elements)
- TypeScript Configuration
```

### Decision 6: Delete docs/ Guides After Inlining

**Choice:** Delete `docs/REACT_PATTERNS.md`, `docs/MIGRATION.md`, and `docs/VALIDATION.md` after their content is inlined into `packages/dom/README.md`.

**Rationale:**

- Prevents documentation drift (one source of truth)
- Eliminates confusion about which doc is authoritative
- Makes it clear that dom README is the comprehensive guide
- Reduces maintenance burden

**Rollback:** If this causes issues, the files are in git history and can be restored.

### Decision 7: V2 Syntax Prominently, V1 at Bottom

**Choice:** Show v2 syntax (`<layer layer={new LayerClass({...})} />`) in all primary examples, with v1 syntax relegated to a "Backwards Compatibility" section at the bottom marked deprecated.

**Rationale:**

- V2 is the current version, should be default
- New users should learn v2 patterns, not v1
- V1 syntax is deprecated and will be removed in v3
- Existing users can find v1 info if needed, but it's clearly marked as legacy
- Following deprecation best practices: support but discourage

## Risks / Trade-offs

### Risk: Dom Package README May Feel Incomplete

**Impact:** `packages/dom/README.md` at 600-800 lines may not cover every edge case or pattern.

**Mitigation:**

- Clear table of contents with anchor links
- Focus on essential patterns that developers need immediately
- TypeScript provides prop discovery and type safety
- Examples directory demonstrates advanced patterns
- Users can explore through IntelliSense and examples
- Documentation should be reference, not tutorial

**Trade-off accepted:** Focused documentation that guides to TypeScript and examples is better than exhaustive documentation that becomes a dissertation.

### Risk: Deleting docs/ Guides Loses Discoverability

**Impact:** Users who bookmarked or linked to `docs/REACT_PATTERNS.md` will get 404s.

**Mitigation:**

- GitHub shows deleted file with link to latest commit where it existed
- Most traffic comes from main README links, which we'll update
- Content is preserved in dom README, just relocated
- Can add redirect comment in git if needed

**Trade-off accepted:** Consolidation benefit outweighs bookmarking risk.

### Risk: Main README May Not Convince Users

**Impact:** Marketing approach in main README might not provide enough detail for users to evaluate the library.

**Mitigation:**

- Include comparison table showing clear feature differences
- Link to comprehensive docs immediately
- Show compelling code example with hooks + nesting (what official bindings can't do)
- Quick start section provides enough to try it

**Trade-off accepted:** GitHub landing page should be concise, detail comes after click-through.

## Migration Plan

This is a documentation-only change with no code modifications, so deployment is straightforward:

1. **Create all new README content:**
   - Write main README with marketing focus
   - Write comprehensive dom README with inlined guides
   - Write reconciler README with architecture focus
   - Write types README showcasing generics

2. **Delete old guides:**
   - Remove `docs/REACT_PATTERNS.md`
   - Remove `docs/MIGRATION.md`
   - Remove `docs/VALIDATION.md`

3. **Verification:**
   - All links within READMEs point to valid anchors
   - No broken cross-references between packages
   - Markdown renders correctly on GitHub and npmjs.com
   - Table of contents is accurate

4. **Rollback strategy:**
   - If issues found, revert commit (docs only, safe to roll back)
   - All deleted files are in git history and can be restored
   - No code dependencies on documentation files

5. **Post-deployment:**
   - Monitor GitHub issues for documentation feedback
   - Update inline example placeholders when examples are overhauled
   - Consider adding "this doc has moved" notice to deleted file locations if users report 404s

## Open Questions

None - design is complete and ready for implementation.
