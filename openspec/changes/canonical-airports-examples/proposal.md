## Why

The current examples directory contains 11 disparate examples with inconsistent patterns, outdated v1 syntax, and varying levels of complexity. Users struggle to find production-ready patterns for their chosen framework, and maintainers lack a canonical reference for testing integration across React ecosystems. Consolidating to four focused, canonical examples showcasing modern React patterns (RSC, Suspense, URL state) provides clear migration paths and demonstrates `@deckgl-fiber-renderer/dom` best practices across the most popular React frameworks.

## What Changes

- **Consolidate**: Replace 11 existing examples with 4 canonical framework examples (Next.js, Vite, Tanstack Start, React Router v7)
- **V2 Syntax Only**: All examples use single-element pattern `<layer layer={new ScatterplotLayer()} />` (no v1 `extend()` or side-effects)
- **Consistent Feature Set**: Each example implements identical functionality:
  - Airports scatterplot (20k FAA dataset)
  - Scrollable sidebar with bidirectional hover/click interactions
  - Search with URL state + server-side filtering
  - Detail card on selection
  - Maplibre base map (interleaved mode)
  - Deck.gl StatsWidget
- **Modern React Patterns**: Showcase `useDeferredValue`, `useOptimistic`, Suspense boundaries
- **Framework-Idiomatic Patterns**:
  - Next.js: Five-file RSC pattern with "use cache" DAL
  - Vite: Client-only with TanStack Query
  - Tanstack Start: Server functions with file-based routing
  - React Router v7: Loaders with nuqs URL state
- **Directory Restructure**: `examples/{nextjs,vite,tanstack-start,react-router}/` (simple names, no "airports" suffix)

## Capabilities

### New Capabilities
- `nextjs-airports-example`: Next.js 15 App Router example with RSC, five-file pattern, and "use cache" data fetching
- `vite-airports-example`: Vite client-only example with TanStack Query and Zustand
- `tanstack-start-airports-example`: Tanstack Start example with server functions and file-based routing
- `react-router-airports-example`: React Router v7 example with loaders and nuqs URL state management

### Modified Capabilities
<!-- No existing specs are changing - these are new examples -->

## Impact

- **Breaking**: None - examples are not published packages
- **Code**: 
  - Remove `examples/` directory (~11 old examples)
  - Create 4 new example projects (~83 new files total)
  - Update root README with new example links
- **Dependencies**: 
  - Add framework-specific deps (Next.js canary, Tanstack Start, React Router v7)
  - Add shared deps (nuqs, zustand, TanStack Query, maplibre-gl)
  - Use pnpm workspace catalog for version consistency
- **Testing**: Examples become integration test suite for `@deckgl-fiber-renderer/dom` across frameworks
- **Documentation**: Users get production-ready patterns for their framework of choice
- **Maintenance**: Reduced surface area (4 maintained examples vs 11)
