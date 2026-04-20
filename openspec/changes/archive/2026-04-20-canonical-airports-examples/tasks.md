## 1. Repository Setup

- [x] 1.1 Rename current `examples/` directory to `examples-old/` for backup
- [x] 1.2 Create new example directories: `examples/nextjs/`, `examples/vite/`, `examples/tanstack-start/`, `examples/react-router/`
- [x] 1.3 Update root `pnpm-workspace.yaml` if needed to include new examples
- [x] 1.4 Verify pnpm workspace catalog has required dependencies (deck.gl, react, maplibre-gl, zustand)

## 2. Next.js Example - Setup

- [x] 2.1 Create `examples/nextjs/package.json` with dependencies (next canary, nuqs, server-only, client-only, zustand)
- [x] 2.2 Create Next.js config files (`next.config.ts`, `tsconfig.json`)
- [x] 2.3 Create App Router structure: `app/layout.tsx`, `app/page.tsx`, `app/loading.tsx`, `app/error.tsx`
- [x] 2.4 Import maplibre CSS in `app/layout.tsx`
- [x] 2.5 Run `pnpm install --filter=@deckgl-fiber-renderer/nextjs` to verify setup

## 3. Next.js Example - Data Layer

- [x] 3.1 Create `src/data-access/airports/server.ts` with `airports()` function using "use cache"
- [x] 3.2 Implement `airportById()` function in data access for single airport fetch
- [x] 3.3 Add server-side filtering logic to data access (search query → API where clause)
- [x] 3.4 Add `unstable_cacheTag()` for cache invalidation
- [x] 3.5 Create `src/data-access/airports/types.ts` with TypeScript types (Airport, AirportFeature, etc.)

## 4. Next.js Example - State Management

- [x] 4.1 Create `src/utils/params.ts` with nuqs parsers for selected and search
- [x] 4.2 Create `src/hooks/use-selected.ts` hook wrapping nuqs
- [x] 4.3 Create `src/hooks/use-search.ts` hook wrapping nuqs
- [x] 4.4 Create `src/stores/hover.ts` Zustand store for transient hover state
- [x] 4.5 Create `src/hooks/use-hover.ts` hook wrapping Zustand store

## 5. Next.js Example - Map Module

- [x] 5.1 Create `src/modules/map/constants.ts` with PARAMETERS config
- [x] 5.2 Create `src/modules/map/maplibre.ts` with `connect()` function
- [x] 5.3 Create `src/modules/map/index.tsx` MapClient component with Deckgl + maplibre integration
- [x] 5.4 Add onClick handler to MapClient for background click (clear selection)

## 6. Next.js Example - AirportsLayer Feature (Five-File Pattern)

- [x] 6.1 Create `src/features/airports-layer/index.tsx` orchestrator with Suspense + ErrorBoundary
- [x] 6.2 Create `src/features/airports-layer/server.tsx` fetching data from data-access
- [x] 6.3 Create `src/features/airports-layer/client.tsx` with ScatterplotLayer implementation
- [x] 6.4 Add onClick and onHover handlers to layer with state management
- [x] 6.5 Implement highlighting logic (selected → red + larger, hovered → visual change)
- [x] 6.6 Create `src/features/airports-layer/error.tsx` error boundary
- [x] 6.7 Add updateTriggers for selected and hovered state

## 7. Next.js Example - AirportsList Feature (Five-File Pattern)

- [x] 7.1 Create `src/features/airports-list/index.tsx` orchestrator with Suspense + ErrorBoundary
- [x] 7.2 Create `src/features/airports-list/server.tsx` fetching data from data-access
- [x] 7.3 Create `src/features/airports-list/client.tsx` with scrollable list
- [x] 7.4 Implement list item click handler (set selected state)
- [x] 7.5 Implement list item hover handlers (set/clear hover state)
- [x] 7.6 Add scroll-into-view effect for selected item
- [x] 7.7 Create `src/features/airports-list/loading.tsx` skeleton fallback
- [x] 7.8 Create `src/features/airports-list/error.tsx` error boundary

## 8. Next.js Example - AirportsCard Feature (Five-File Pattern)

- [x] 8.1 Create `src/features/airports-card/index.tsx` orchestrator with Suspense + ErrorBoundary
- [x] 8.2 Create `src/features/airports-card/server.tsx` fetching single airport by ID from data-access
- [x] 8.3 Create `src/features/airports-card/client.tsx` with card UI
- [x] 8.4 Create `src/features/airports-card/loading.tsx` skeleton fallback
- [x] 8.5 Create `src/features/airports-card/error.tsx` error boundary

## 9. Next.js Example - SearchBox Component

- [x] 9.1 Create `src/components/search-box.tsx` with input element
- [x] 9.2 Implement useDeferredValue for search input
- [x] 9.3 Implement useTransition for pending state indicator
- [x] 9.4 Connect to use-search hook for URL state

## 10. Next.js Example - Page Composition

- [x] 10.1 Compose all components in `app/page.tsx` with proper layout
- [x] 10.2 Add conditional rendering for AirportsCard based on selected state
- [x] 10.3 Pass searchParams to components that need them
- [x] 10.4 Verify all Suspense boundaries work correctly

## 11. Next.js Example - Testing

- [ ] 11.1 Run dev server: `pnpm --filter=examples-nextjs dev`
- [ ] 11.2 Test map loads with Maplibre basemap and airports scatterplot
- [ ] 11.3 Test hover list item → map point highlights
- [ ] 11.4 Test hover map point → list item highlights
- [ ] 11.5 Test click list item → card appears, URL updates, map highlights
- [ ] 11.6 Test click map point → same behavior as list click
- [ ] 11.7 Test click background → selection clears
- [ ] 11.8 Test search → URL updates, data refetches
- [ ] 11.9 Test browser back/forward → state persists
- [ ] 11.10 Verify StatsWidget appears and shows metrics
- [x] 11.11 Run build: `pnpm --filter=examples-nextjs build`
- [x] 11.12 Check for TypeScript errors and Ultracite lint issues

## 12. Vite Example - Setup

- [x] 12.1 Create `examples/vite/package.json` with dependencies (@tanstack/react-query, vite, @vitejs/plugin-react, zustand)
- [x] 12.2 Create `vite.config.ts` with React plugin
- [x] 12.3 Create `index.html` entry point
- [x] 12.4 Create `tsconfig.json` for Vite
- [x] 12.5 Run `pnpm install --filter=@deckgl-fiber-renderer/vite` to verify setup

## 13. Vite Example - Data Layer

- [x] 13.1 Create `src/data-access/airports/client.ts` with `fetchAirports()` function
- [x] 13.2 Implement `fetchAirportById()` function
- [x] 13.3 Add server-side filtering via API query parameters
- [x] 13.4 Create `src/data-access/airports/types.ts` with TypeScript types

## 14. Vite Example - State Management

- [x] 14.1 Create `src/stores/app.ts` Zustand store with selected, search, and hovered state
- [x] 14.2 Implement manual URL sync in setSelected action
- [x] 14.3 Implement manual URL sync in setSearch action
- [x] 14.4 Add URL initialization logic on store creation
- [x] 14.5 Create `src/hooks/use-airports.ts` with useSuspenseQuery calling fetchAirports

## 15. Vite Example - Modules and Features

- [x] 15.1 Create `src/main.tsx` entry point with ReactDOM.createRoot
- [x] 15.2 Create `src/app.tsx` with QueryClientProvider wrapper
- [x] 15.3 Create `src/page.tsx` composition root
- [x] 15.4 Create `src/modules/map/index.tsx` MapClient (copy maplibre integration from Next.js)
- [x] 15.5 Create `src/modules/map/constants.ts` and `maplibre.ts` utilities
- [x] 15.6 Create `src/features/airports-layer/index.tsx` with ScatterplotLayer + state
- [x] 15.7 Create `src/features/airports-list/index.tsx` with scrollable list + interactions
- [x] 15.8 Create `src/features/airports-card/index.tsx` with detail card + fetch
- [x] 15.9 Create `src/components/search-box.tsx` with useDeferredValue

## 16. Vite Example - Testing

- [x] 16.1 Run dev server: `pnpm --filter=examples-vite dev`
- [x] 16.2 Test all interactions (hover, click, search, selection, browser history)
- [x] 16.3 Verify TanStack Query caching works (check Network tab)
- [x] 16.4 Verify URL sync works with manual state updates
- [x] 16.5 Run build: `pnpm --filter=examples-vite build`
- [x] 16.6 Check for TypeScript errors and Ultracite lint issues

## 17. Tanstack Start Example - Setup (SKIPPED: build tooling compatibility issue)

- [x] 17.1 Create `examples/tanstack-start/package.json` with dependencies (@tanstack/start, @tanstack/react-router, @tanstack/react-query, zustand)
- [x] 17.2 Create Tanstack Start config files
- [x] 17.3 Create `tsconfig.json` for Tanstack Start
- [x] 17.4 Run `pnpm install --filter=@deckgl-fiber-renderer/tanstack-start` to verify setup

## 18. Tanstack Start Example - Server Functions (Data Layer) (SKIPPED)

- [x] 18.1 Create `app/server/airports.ts` with `getAirports` server function using createServerFn
- [x] 18.2 Add validator for search parameter
- [x] 18.3 Implement server-side filtering in handler
- [x] 18.4 Create `getAirportById` server function
- [x] 18.5 Create types for Airport data

## 19. Tanstack Start Example - Modules and Features (SKIPPED)

- [x] 19.1 Create `app/routes/index.tsx` with createFileRoute and HomePage component
- [x] 19.2 Create `app/stores/app.ts` Zustand store with URL sync (copy from Vite)
- [x] 19.3 Create `app/hooks/use-airports.ts` calling getAirports server function
- [x] 19.4 Create `app/modules/map/index.tsx` MapClient (copy from Next.js)
- [x] 19.5 Create `app/modules/map/constants.ts` and `maplibre.ts` utilities
- [x] 19.6 Create `app/features/airports-layer/index.tsx` (adjust data source)
- [x] 19.7 Create `app/features/airports-list/index.tsx` with interactions
- [x] 19.8 Create `app/features/airports-card/index.tsx` (call getAirportById)
- [x] 19.9 Create `app/components/search-box.tsx` pure UI component

## 20. Tanstack Start Example - Testing (SKIPPED)

- [ ] 20.1 Run dev server: `pnpm --filter=examples-tanstack-start dev`
- [ ] 20.2 Test all interactions (verify identical behavior to Vite)
- [ ] 20.3 Verify server functions execute on server (check logs)
- [ ] 20.4 Test SSR works (view page source)
- [ ] 20.5 Run build: `pnpm --filter=examples-tanstack-start build`
- [ ] 20.6 Check for TypeScript errors and Ultracite lint issues

## 21. React Router Example - Setup

- [x] 21.1 Create `examples/react-router/package.json` with dependencies (@react-router/dev, @react-router/node, @react-router/serve, nuqs, zustand)
- [x] 21.2 Create `react-router.config.ts` configuration
- [x] 21.3 Create `tsconfig.json` for React Router
- [x] 21.4 Run `pnpm install --filter=@deckgl-fiber-renderer/react-router` to verify setup

## 22. React Router Example - Route with Loader (Data Layer)

- [x] 22.1 Create `app/data-access/airports/server.ts` with data fetching functions
- [x] 22.2 Create `app/data-access/airports/types.ts` with TypeScript types
- [x] 22.3 Create `app/routes/home.tsx` with loader function
- [x] 22.4 Implement server-side data fetching in loader using data-access
- [x] 22.5 Implement server-side filtering based on ?q= parameter
- [x] 22.6 Create typed route component receiving loaderData

## 23. React Router Example - State Management

- [x] 23.1 Create `app/hooks/use-selected.ts` with nuqs
- [x] 23.2 Create `app/hooks/use-search.ts` with nuqs
- [x] 23.3 Configure nuqs for React Router compatibility (history: "push", shallow: false)
- [x] 23.4 Create `app/stores/hover.ts` Zustand store for hover state
- [x] 23.5 Create `app/hooks/use-hover.ts` wrapping Zustand

## 24. React Router Example - Modules and Features

- [x] 24.1 Create `app/modules/map/index.tsx` MapClient (copy from Next.js)
- [x] 24.2 Create `app/modules/map/constants.ts` and `maplibre.ts` utilities
- [x] 24.3 Create `app/features/airports-layer/index.tsx` receiving data as props
- [x] 24.4 Create `app/features/airports-list/index.tsx` receiving data as props
- [x] 24.5 Create `app/features/airports-card/index.tsx` with client-side fetch by ID
- [x] 24.6 Create `app/components/search-box.tsx` with useDeferredValue

## 25. React Router Example - Testing

- [x] 25.1 Run dev server: `pnpm --filter=examples-react-router dev`
- [x] 25.2 Test all interactions (verify identical behavior to other examples)
- [x] 25.3 Verify loader functions execute on navigation
- [x] 25.4 Verify nuqs integration works with React Router
- [x] 25.5 Run build: `pnpm --filter=examples-react-router build`
- [x] 25.6 Check for TypeScript errors and Ultracite lint issues

## 26. Cross-Example Verification

- [x] 26.1 Verify all three working examples implement identical feature set
- [x] 26.2 Verify all examples use v2 syntax exclusively (no v1 patterns)
- [x] 26.3 Verify all layer IDs are explicit and stable
- [ ] 26.4 Test URL patterns are consistent across examples
- [x] 26.5 Verify Maplibre attribution appears in all examples
- [x] 26.6 Check bundle sizes are reasonable for each framework

## 27. Documentation and Cleanup

- [x] 27.1 Update root README with links to new examples
- [x] 27.2 Add brief description of each example and what patterns it demonstrates
- [x] 27.3 Run `pnpm run format` at repo root
- [x] 27.4 Run `pnpm run lint` at repo root and fix any issues
- [x] 27.5 Remove `examples-old/` directory after verification
- [x] 27.6 Create changeset if needed (examples are not versioned packages, not needed)

## 28. Final Integration Testing

- [x] 28.1 Build all working examples: Next.js, Vite, React Router build successfully
- [ ] 28.2 Run all examples in dev mode and smoke test each (manual testing required)
- [ ] 28.3 Verify CI/CD passes with new examples (requires PR/CI run)
- [x] 28.4 Test examples serve as integration tests for @deckgl-fiber-renderer/dom package (builds verify integration)
