## Context

The `@deckgl-fiber-renderer/dom` package needs canonical examples that demonstrate integration patterns across major React frameworks. Current examples (~11 projects) use inconsistent patterns, outdated v1 syntax (`extend()`), and vary in complexity. Users need clear, framework-idiomatic references for production use.

**Data Source**: FAA airports GeoJSON API (~20k airports)
```
https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/US_Airport/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson
```

**Target Frameworks**: Next.js 15, Vite, Tanstack Start, React Router v7

**Constraints**:
- All examples must use v2 syntax only: `<layer layer={new LayerClass()} />`
- Layer IDs are mandatory (critical for deck.gl diffing - missing IDs cause expensive re-initialization)
- Examples are not published packages (no semver concerns)
- Must showcase modern React patterns (Suspense, URL state, deferred values)

## Goals / Non-Goals

**Goals:**
- Provide one canonical example per major React framework
- Demonstrate `@deckgl-fiber-renderer/dom` v2 API exclusively
- Showcase framework-idiomatic patterns (RSC for Next.js, loaders for React Router, etc.)
- Implement identical feature set across all examples for fair comparison
- Reduce maintenance burden (4 examples vs 11)
- Serve as integration test suite for library

**Non-Goals:**
- Backward compatibility with v1 syntax
- Supporting every React framework (focus on top 4)
- Production-ready deployment configurations (CI/CD, monitoring, etc.)
- Advanced deck.gl features beyond scatterplot + interleaved Maplibre
- Comprehensive error handling or loading states (beyond basic Suspense)

## Decisions

### 1. Server-Side Data Filtering

**Decision**: Implement server-side filtering via API query parameters for search functionality.

**Rationale**: 
- Dataset is ~20k airports - server-side filtering keeps initial bundle small
- Demonstrates proper data fetching patterns for each framework
- Realistic pattern users will need in production

**Alternatives Considered**:
- Client-side filtering: Simpler but less realistic for large datasets
- Paginated API: More complex, overkill for example purposes

**Implementation**:
- URL param: `?q=search-term`
- Next.js: Filter in DAL before returning (`"use cache"` with search param)
- Vite: Filter via API query string in fetch
- Tanstack Start: Filter in server function
- React Router: Filter in loader function

### 2. State Management Strategy

**Decision**: Split state by persistence needs - URL for shareable state, Zustand for transient state.

| State Type | Storage | Rationale |
|------------|---------|-----------|
| Selected airport | URL (nuqs/searchParams) | Shareable links, browser back/forward support |
| Search query | URL (nuqs/searchParams) | Same as above |
| Hovered airport | Zustand store | Transient interaction, no persistence needed |
| Filtered data | Server cache/TanStack Query | Derived from search query, refetched on change |

**Rationale**:
- URL state enables deep linking and browser history integration
- Transient hover state in Zustand avoids polluting URL
- Framework-appropriate tools (nuqs for Next.js/RR, Zustand+manual sync for Vite)

**Alternatives Considered**:
- All state in URL: Pollutes URL with transient data
- All state in Zustand: Loses shareability and browser history
- React Context: Unnecessary for examples, adds boilerplate

### 3. Suspense Boundary Usage

**Decision**: Include full Suspense boundaries in all examples (the Suspense bug is now fixed).

**Rationale**:
- Previous Suspense bug in reconciler has been resolved
- Demonstrates modern React async patterns
- Shows proper loading/error boundary structure
- Next.js five-file pattern naturally includes Suspense

**Pattern**:
- Each data-fetching feature gets own Suspense boundary
- Map/layer features CAN use Suspense (bug fixed)
- Loading fallbacks show skeleton states (Next.js) or simple spinners (others)

### 4. V2 Syntax Enforcement

**Decision**: All examples use only v2 single-element pattern, no v1 syntax.

**Syntax**:
```tsx
<layer layer={new ScatterplotLayer({ id: "airports", ... })} />
```

**Prohibited**:
- v1 `extend()` pattern
- Side-effects imports
- Any v1 API references

**Rationale**:
- V2 is the current API surface
- Avoids confusion with deprecated patterns
- TypeScript generics work properly with layer constructors
- Layer IDs are explicit and visible (critical for correctness)

### 5. Framework-Idiomatic Patterns

**Decision**: Each example follows framework best practices, even when patterns diverge.

**Next.js**: Five-file RSC pattern
- `index.tsx`: Server-only orchestrator with Suspense
- `server.tsx`: Data fetching with "use cache"
- `client.tsx`: Interactive component
- `loading.tsx`: Suspense fallback
- `error.tsx`: Error boundary

**Vite**: Single-file components with TanStack Query
- Client-only architecture
- `useSuspenseQuery` for data fetching
- Zustand with manual URL sync middleware

**Tanstack Start**: Server functions with file-based routing
- `createServerFn()` for data fetching
- `createFileRoute()` for routing
- TanStack Query calls server functions

**React Router v7**: Loaders with typed routes
- Loader functions for data fetching
- `useLoaderData()` with typed props
- nuqs for URL state (compatible with RR7)

**Rationale**: Users learn framework-appropriate patterns, not generic lowest-common-denominator code.

### 6. Folder Architecture

**Decision**: Follow definitive-react.md import hierarchy and semantic organization for all examples.

**Structure**:
```
src/
├── data-access/    # CRUD/data fetching (domain-based)
├── utils/          # Pure utility functions
├── hooks/          # Reusable React hooks  
├── stores/         # Zustand stores
├── modules/        # Shared infrastructure (map integration)
├── features/       # Five-file RSC pattern components (data-fetching)
└── components/     # Pure UI components (no data fetching)
```

**Next.js Example Structure**:
```
src/
  data-access/
    airports/
      server.ts      # Server-side data access (airports, airportById)
      types.ts       # TypeScript types (Airport, AirportFeature, etc.)
  
  utils/
    params.ts        # URL param parsers (nuqs)
  
  hooks/
    use-selected.ts  # Selected state hook
    use-search.ts    # Search state hook
    use-hover.ts     # Hover state hook
  
  stores/
    hover.ts         # Transient hover state
  
  modules/
    map/
      constants.ts   # Map view parameters
      maplibre.ts    # Maplibre integration utility
      index.tsx      # Map wrapper component
  
  features/
    airports-layer/  # Five-file pattern
    airports-list/   # Five-file pattern
    airports-card/   # Five-file pattern
  
  components/
    search-box.tsx   # Pure UI component
```

**Rationale**:
- **Clear boundaries**: Features fetch data and use five-file pattern; components are pure UI
- **Import hierarchy compliance**: Follows the 8-tier system from definitive-react.md, preventing circular dependencies
- **Modules vs Features**: Map is infrastructure/integration (module), airports are business features
- **Domain-based data-access**: Airport-related data logic is colocated, enabling independent refactoring
- **Consistency**: All four examples follow the same organizational principles

**Framework Adaptations**:
- **Next.js**: `data-access/` uses "use cache" for server-side fetching
- **Vite**: `data-access/` contains client-side fetch functions, features composed as single files
- **Tanstack Start**: `data-access/` replaced by server functions in `app/server/`
- **React Router v7**: `data-access/` provides functions called from loaders, features receive data via props

**Import Hierarchy Tiers** (from definitive-react.md):
| Tier | Directories | Can Import From |
|------|-------------|-----------------|
| 1 | `types/` | Nothing |
| 2 | `utils/` | Tier 1 |
| 3 | (configs) | Tiers 1–2 |
| 4 | `components/`, `stores/`, `hooks/` | Tiers 1–3 |
| 5 | `modules/` | Tiers 1–4 |
| 6 | `data-access/` | Tiers 1–5 |
| 7 | `features/` | Tiers 1–6 |
| 8 | `app/` | Tiers 1–7 |

This hierarchy prevents circular dependencies and makes the codebase easier to reason about.

**Alternatives Considered**:
- **Flat components/ directory**: Simpler but loses semantic meaning. Can't tell which components fetch data and which are pure UI.
- **Feature-based grouping** (all airports code together): Works for single-feature apps but breaks down when features share infrastructure. Map module is used by multiple features.
- **No modules/ directory**: Colocate map with features. Problem: which feature owns it? Map is infrastructure, not a business feature.

### 7. Directory Naming Convention

**Decision**: Simple framework names without "airports" suffix.

```
examples/nextjs/
examples/vite/
examples/tanstack-start/
examples/react-router/
```

**Rationale**:
- Framework identity is primary (users browse by framework)
- "airports" is implementation detail
- Shorter paths, clearer structure
- Allows future examples to be added per framework if needed

**Alternatives Considered**:
- `examples/airports-nextjs/`: Redundant, harder to scan
- `examples/frameworks/nextjs/`: Extra nesting, no benefit

## Risks / Trade-offs

### Risk: Examples Drift Out of Sync
**Description**: Four examples implementing identical features risk diverging over time.

**Mitigation**:
- Shared interaction patterns documented in design (this file)
- Verification checklist ensures all features work identically
- Examples serve as integration tests - failures are caught in CI

### Risk: Framework Updates Break Examples
**Description**: Next.js canary, Tanstack Start, React Router v7 are actively developed - breaking changes possible.

**Mitigation**:
- Pin versions in pnpm workspace catalog
- Update examples together when upgrading framework versions
- Examples are not published packages - no semver constraints

### Risk: Maplibre Integration Complexity
**Description**: Interleaved mode with Maplibre base map adds integration complexity.

**Mitigation**:
- Shared `maplibre.ts` connection utility across all examples
- Copy proven pattern from existing advanced example
- Clear separation of concerns (map setup vs deck.gl layers)

### Trade-off: Five-File Pattern Verbosity
**Description**: Next.js five-file pattern creates more files for simple features.

**Acceptance**: 
- Verbosity demonstrates RSC patterns properly
- Other frameworks use simpler single-file approach
- Trade-off is intentional - showcases framework strengths
- Users learn proper separation of server/client concerns

### Trade-off: Duplicate Code Across Examples
**Description**: Four examples mean ~4x the code for identical features.

**Acceptance**:
- Code duplication is intentional - examples are self-contained
- Reduces maintenance complexity (no shared abstraction layer)
- Users can copy/paste framework-specific code directly
- Examples demonstrate patterns, not reusable libraries
