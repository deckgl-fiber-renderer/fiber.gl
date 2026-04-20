## 1. Repository Setup

- [ ] 1.1 Rename current `examples/` directory to `examples-old/` for backup
- [ ] 1.2 Create new example directories: `examples/nextjs/`, `examples/vite/`, `examples/tanstack-start/`, `examples/react-router/`
- [ ] 1.3 Update root `pnpm-workspace.yaml` if needed to include new examples
- [ ] 1.4 Verify pnpm workspace catalog has required dependencies (deck.gl, react, maplibre-gl, zustand)

## 2. Next.js Example - Setup

- [ ] 2.1 Create `examples/nextjs/package.json` with dependencies (next canary, nuqs, server-only, client-only, zustand)
- [ ] 2.2 Create Next.js config files (`next.config.ts`, `tsconfig.json`)
- [ ] 2.3 Create App Router structure: `app/layout.tsx`, `app/page.tsx`, `app/loading.tsx`, `app/error.tsx`
- [ ] 2.4 Import maplibre CSS in `app/layout.tsx`
- [ ] 2.5 Run `pnpm install --filter=@deckgl-fiber-renderer/nextjs` to verify setup

## 3. Next.js Example - Data Layer

- [ ] 3.1 Create `src/dal/airports/index.ts` with `airports()` function using "use cache"
- [ ] 3.2 Implement `airportById()` function in DAL for single airport fetch
- [ ] 3.3 Add server-side filtering logic to DAL (search query → API where clause)
- [ ] 3.4 Add `unstable_cacheTag()` for cache invalidation

## 4. Next.js Example - State Management

- [ ] 4.1 Create `src/utils/params.ts` with nuqs parsers for selected and search
- [ ] 4.2 Create `src/hooks/use-selected.ts` hook wrapping nuqs
- [ ] 4.3 Create `src/hooks/use-search.ts` hook wrapping nuqs
- [ ] 4.4 Create `src/stores/hover.ts` Zustand store for transient hover state
- [ ] 4.5 Create `src/hooks/use-hover.ts` hook wrapping Zustand store

## 5. Next.js Example - Map Components

- [ ] 5.1 Create `src/components/map/constants.ts` with PARAMETERS config
- [ ] 5.2 Create `src/components/map/maplibre.ts` with `connect()` function
- [ ] 5.3 Create `src/components/map/client.tsx` MapClient component with Deckgl + maplibre integration
- [ ] 5.4 Add onClick handler to MapClient for background click (clear selection)
- [ ] 5.5 Add StatsWidget to MapClient

## 6. Next.js Example - AirportsLayer (Five-File Pattern)

- [ ] 6.1 Create `src/components/airports-layer/index.tsx` orchestrator with Suspense + ErrorBoundary
- [ ] 6.2 Create `src/components/airports-layer/server.tsx` fetching data from DAL
- [ ] 6.3 Create `src/components/airports-layer/client.tsx` with ScatterplotLayer implementation
- [ ] 6.4 Add onClick and onHover handlers to layer with state management
- [ ] 6.5 Implement highlighting logic (selected → red + larger, hovered → visual change)
- [ ] 6.6 Create `src/components/airports-layer/error.tsx` error boundary
- [ ] 6.7 Add updateTriggers for selected and hovered state

## 7. Next.js Example - AirportsList (Five-File Pattern)

- [ ] 7.1 Create `src/components/airports-list/index.tsx` orchestrator with Suspense + ErrorBoundary
- [ ] 7.2 Create `src/components/airports-list/server.tsx` fetching data from DAL
- [ ] 7.3 Create `src/components/airports-list/client.tsx` with scrollable list
- [ ] 7.4 Implement list item click handler (set selected state)
- [ ] 7.5 Implement list item hover handlers (set/clear hover state)
- [ ] 7.6 Add scroll-into-view effect for selected item
- [ ] 7.7 Create `src/components/airports-list/loading.tsx` skeleton fallback
- [ ] 7.8 Create `src/components/airports-list/error.tsx` error boundary

## 8. Next.js Example - AirportsCard (Five-File Pattern)

- [ ] 8.1 Create `src/components/airports-card/index.tsx` orchestrator with Suspense + ErrorBoundary
- [ ] 8.2 Create `src/components/airports-card/server.tsx` fetching single airport by ID
- [ ] 8.3 Create `src/components/airports-card/client.tsx` with card UI
- [ ] 8.4 Create `src/components/airports-card/loading.tsx` skeleton fallback
- [ ] 8.5 Create `src/components/airports-card/error.tsx` error boundary

## 9. Next.js Example - SearchBox

- [ ] 9.1 Create `src/components/search-box/client.tsx` with input element
- [ ] 9.2 Implement useDeferredValue for search input
- [ ] 9.3 Implement useTransition for pending state indicator
- [ ] 9.4 Connect to use-search hook for URL state

## 10. Next.js Example - Page Composition

- [ ] 10.1 Compose all components in `app/page.tsx` with proper layout
- [ ] 10.2 Add conditional rendering for AirportsCard based on selected state
- [ ] 10.3 Pass searchParams to components that need them
- [ ] 10.4 Verify all Suspense boundaries work correctly

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
- [ ] 11.11 Run build: `pnpm --filter=examples-nextjs build`
- [ ] 11.12 Check for TypeScript errors and Ultracite lint issues

## 12. Vite Example - Setup

- [ ] 12.1 Create `examples/vite/package.json` with dependencies (@tanstack/react-query, vite, @vitejs/plugin-react, zustand)
- [ ] 12.2 Create `vite.config.ts` with React plugin
- [ ] 12.3 Create `index.html` entry point
- [ ] 12.4 Create `tsconfig.json` for Vite
- [ ] 12.5 Run `pnpm install --filter=@deckgl-fiber-renderer/vite` to verify setup

## 13. Vite Example - Data Layer

- [ ] 13.1 Create `src/api/airports.ts` with `fetchAirports()` function
- [ ] 13.2 Implement `fetchAirportById()` function
- [ ] 13.3 Add server-side filtering via API query parameters

## 14. Vite Example - State Management

- [ ] 14.1 Create `src/store/index.ts` Zustand store with selected, search, and hovered state
- [ ] 14.2 Implement manual URL sync in setSelected action
- [ ] 14.3 Implement manual URL sync in setSearch action
- [ ] 14.4 Add URL initialization logic on store creation
- [ ] 14.5 Create `src/hooks/use-airports.ts` with useSuspenseQuery calling fetchAirports

## 15. Vite Example - Components

- [ ] 15.1 Create `src/main.tsx` entry point with ReactDOM.createRoot
- [ ] 15.2 Create `src/app.tsx` with QueryClientProvider wrapper
- [ ] 15.3 Create `src/page.tsx` composition root
- [ ] 15.4 Create `src/components/map.tsx` MapClient (copy maplibre integration from Next.js)
- [ ] 15.5 Create `src/components/airports-layer.tsx` with ScatterplotLayer + state
- [ ] 15.6 Create `src/components/airports-list.tsx` with scrollable list + interactions
- [ ] 15.7 Create `src/components/airports-card.tsx` with detail card + fetch
- [ ] 15.8 Create `src/components/search-box.tsx` with useDeferredValue

## 16. Vite Example - Testing

- [ ] 16.1 Run dev server: `pnpm --filter=examples-vite dev`
- [ ] 16.2 Test all interactions (hover, click, search, selection, browser history)
- [ ] 16.3 Verify TanStack Query caching works (check Network tab)
- [ ] 16.4 Verify URL sync works with manual state updates
- [ ] 16.5 Run build: `pnpm --filter=examples-vite build`
- [ ] 16.6 Check for TypeScript errors and Ultracite lint issues

## 17. Tanstack Start Example - Setup

- [ ] 17.1 Create `examples/tanstack-start/package.json` with dependencies (@tanstack/start, @tanstack/react-router, @tanstack/react-query, zustand)
- [ ] 17.2 Create Tanstack Start config files
- [ ] 17.3 Create `tsconfig.json` for Tanstack Start
- [ ] 17.4 Run `pnpm install --filter=@deckgl-fiber-renderer/tanstack-start` to verify setup

## 18. Tanstack Start Example - Server Functions

- [ ] 18.1 Create `app/server/airports.ts` with `getAirports` server function using createServerFn
- [ ] 18.2 Add validator for search parameter
- [ ] 18.3 Implement server-side filtering in handler
- [ ] 18.4 Create `getAirportById` server function

## 19. Tanstack Start Example - Components

- [ ] 19.1 Create `app/routes/index.tsx` with createFileRoute and HomePage component
- [ ] 19.2 Create Zustand store with URL sync (copy from Vite)
- [ ] 19.3 Create `app/hooks/use-airports.ts` calling getAirports server function
- [ ] 19.4 Create `app/components/map.tsx` MapClient (copy from Vite)
- [ ] 19.5 Create `app/components/airports-layer.tsx` (copy from Vite, adjust data source)
- [ ] 19.6 Create `app/components/airports-list.tsx` (copy from Vite)
- [ ] 19.7 Create `app/components/airports-card.tsx` (copy from Vite, call getAirportById)
- [ ] 19.8 Create `app/components/search-box.tsx` (copy from Vite)

## 20. Tanstack Start Example - Testing

- [ ] 20.1 Run dev server: `pnpm --filter=examples-tanstack-start dev`
- [ ] 20.2 Test all interactions (verify identical behavior to Vite)
- [ ] 20.3 Verify server functions execute on server (check logs)
- [ ] 20.4 Test SSR works (view page source)
- [ ] 20.5 Run build: `pnpm --filter=examples-tanstack-start build`
- [ ] 20.6 Check for TypeScript errors and Ultracite lint issues

## 21. React Router Example - Setup

- [ ] 21.1 Create `examples/react-router/package.json` with dependencies (@react-router/dev, @react-router/node, @react-router/serve, nuqs, zustand)
- [ ] 21.2 Create `react-router.config.ts` configuration
- [ ] 21.3 Create `tsconfig.json` for React Router
- [ ] 21.4 Run `pnpm install --filter=@deckgl-fiber-renderer/react-router` to verify setup

## 22. React Router Example - Route with Loader

- [ ] 22.1 Create `app/routes/home.tsx` with loader function
- [ ] 22.2 Implement server-side data fetching in loader
- [ ] 22.3 Implement server-side filtering based on ?q= parameter
- [ ] 22.4 Create typed route component receiving loaderData

## 23. React Router Example - State Management

- [ ] 23.1 Create `app/hooks/use-selected.ts` with nuqs
- [ ] 23.2 Create `app/hooks/use-search.ts` with nuqs
- [ ] 23.3 Configure nuqs for React Router compatibility (history: "push", shallow: false)
- [ ] 23.4 Create `app/store/hover.ts` Zustand store for hover state
- [ ] 23.5 Create `app/hooks/use-hover.ts` wrapping Zustand

## 24. React Router Example - Components

- [ ] 24.1 Create `app/components/map.tsx` MapClient (copy from Vite)
- [ ] 24.2 Create `app/components/airports-layer.tsx` receiving data as props
- [ ] 24.3 Create `app/components/airports-list.tsx` receiving data as props
- [ ] 24.4 Create `app/components/airports-card.tsx` with client-side fetch by ID
- [ ] 24.5 Create `app/components/search-box.tsx` with useDeferredValue

## 25. React Router Example - Testing

- [ ] 25.1 Run dev server: `pnpm --filter=examples-react-router dev`
- [ ] 25.2 Test all interactions (verify identical behavior to other examples)
- [ ] 25.3 Verify loader functions execute on navigation
- [ ] 25.4 Verify nuqs integration works with React Router
- [ ] 25.5 Run build: `pnpm --filter=examples-react-router build`
- [ ] 25.6 Check for TypeScript errors and Ultracite lint issues

## 26. Cross-Example Verification

- [ ] 26.1 Verify all four examples implement identical feature set
- [ ] 26.2 Verify all examples use v2 syntax exclusively (no v1 patterns)
- [ ] 26.3 Verify all layer IDs are explicit and stable
- [ ] 26.4 Test URL patterns are consistent across examples
- [ ] 26.5 Verify Maplibre attribution appears in all examples
- [ ] 26.6 Check bundle sizes are reasonable for each framework

## 27. Documentation and Cleanup

- [ ] 27.1 Update root README with links to new examples
- [ ] 27.2 Add brief description of each example and what patterns it demonstrates
- [ ] 27.3 Run `pnpm run format` at repo root
- [ ] 27.4 Run `pnpm run lint` at repo root and fix any issues
- [ ] 27.5 Remove `examples-old/` directory after verification
- [ ] 27.6 Create changeset if needed (examples are not versioned packages, likely not needed)

## 28. Final Integration Testing

- [ ] 28.1 Build all examples: `pnpm exec turbo build --filter='examples-*'`
- [ ] 28.2 Run all examples in dev mode and smoke test each
- [ ] 28.3 Verify CI/CD passes with new examples
- [ ] 28.4 Test examples serve as integration tests for @deckgl-fiber-renderer/dom package
