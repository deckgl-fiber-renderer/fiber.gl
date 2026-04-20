## ADDED Requirements

### Requirement: V2 Syntax Layer Declaration
The example SHALL use only v2 single-element syntax for declaring deck.gl layers.

#### Scenario: ScatterplotLayer declaration
- **WHEN** declaring an airports scatterplot layer
- **THEN** use `<layer layer={new ScatterplotLayer({ id: "airports", ... })} />`

#### Scenario: No v1 syntax
- **WHEN** implementing any layer
- **THEN** MUST NOT use `extend()` or side-effects imports

### Requirement: Mandatory Layer IDs
All deck.gl layers SHALL specify explicit stable IDs to enable proper deck.gl diffing.

#### Scenario: ScatterplotLayer with ID
- **WHEN** creating ScatterplotLayer instance
- **THEN** MUST include `id: "airports"` in layer constructor

### Requirement: Client-Only Architecture
Example SHALL be fully client-side with no server-side rendering.

#### Scenario: Single entry point
- **WHEN** application starts
- **THEN** render from `src/main.tsx` using `ReactDOM.createRoot()`

#### Scenario: No SSR configuration
- **WHEN** setting up Vite config
- **THEN** MUST NOT include SSR plugins or server configuration

### Requirement: TanStack Query Data Fetching
Data fetching SHALL use TanStack Query with Suspense.

#### Scenario: Fetch airports with useSuspenseQuery
- **WHEN** fetching airports data
- **THEN** use `useSuspenseQuery({ queryKey: ["airports", search], queryFn: () => fetchAirports(search) })`

#### Scenario: Query cache configuration
- **WHEN** setting up QueryClient
- **THEN** configure `staleTime: 5 * 60 * 1000` (5 minutes)

#### Scenario: Refetch on search change
- **WHEN** search query changes
- **THEN** queryKey MUST include search term to trigger refetch

### Requirement: Zustand State Management with URL Sync
State management SHALL use Zustand store with manual URL synchronization.

#### Scenario: Selected airport in store and URL
- **WHEN** user selects airport
- **THEN** update Zustand store AND push to URL with `window.history.pushState()`

#### Scenario: Search query in store and URL
- **WHEN** user types search
- **THEN** update Zustand store AND push to URL parameter `?q={term}`

#### Scenario: Transient hover state
- **WHEN** user hovers airport
- **THEN** update Zustand store only (no URL sync)

#### Scenario: Initialize from URL
- **WHEN** application loads
- **THEN** parse URL parameters and initialize Zustand store

### Requirement: Single-File Components
Components SHALL be organized as single files (not five-file pattern).

#### Scenario: AirportsLayer component
- **WHEN** implementing airports layer
- **THEN** create single file `src/components/airports-layer.tsx` with all logic

#### Scenario: Component hooks usage
- **WHEN** component needs data
- **THEN** call `useAirports()` hook directly in component

### Requirement: API Layer for Data Fetching
Data fetching logic SHALL be abstracted in dedicated API layer.

#### Scenario: Fetch function structure
- **WHEN** creating fetch functions
- **THEN** organize in `src/api/airports.ts` with `fetchAirports()` and `fetchAirportById()` exports

#### Scenario: Server-side filtering via API
- **WHEN** search query exists
- **THEN** modify API URL with query parameter: `&where=NAME LIKE '%${search}%'`

### Requirement: Bidirectional Map-List Interactions
Map clicks and list clicks SHALL synchronize selection and hover state.

#### Scenario: Click map point selects in list
- **WHEN** user clicks airport on map
- **THEN** corresponding list item MUST highlight and scroll into view

#### Scenario: Click list item selects on map
- **WHEN** user clicks list item
- **THEN** corresponding map point MUST highlight (red, larger radius)

#### Scenario: Hover list highlights map
- **WHEN** user hovers list item
- **THEN** corresponding map point MUST change appearance

#### Scenario: Click background clears selection
- **WHEN** user clicks map background (no airport picked)
- **THEN** selected state MUST clear and detail card MUST hide

### Requirement: Detail Card on Selection
Detail card SHALL display when airport is selected.

#### Scenario: Show card on selection
- **WHEN** `selected` state is not null
- **THEN** AirportsCard component MUST render with airport details

#### Scenario: Fetch single airport
- **WHEN** detail card renders
- **THEN** use `useSuspenseQuery` to fetch single airport by ID

#### Scenario: Hide card on deselection
- **WHEN** `selected` state is null
- **THEN** detail card MUST not render

### Requirement: Maplibre Base Map Integration
Example SHALL render Maplibre base map with deck.gl in interleaved mode.

#### Scenario: Initialize Maplibre with deck.gl
- **WHEN** MapClient component mounts
- **THEN** create Maplibre map instance and add Deckgl instance as control in `useEffect`

#### Scenario: Interleaved rendering
- **WHEN** rendering deck.gl layers
- **THEN** `<Deckgl>` MUST have `interleaved` prop set to true

#### Scenario: Cleanup on unmount
- **WHEN** MapClient unmounts
- **THEN** remove deck.gl control and destroy Maplibre map instance

### Requirement: Deck.gl StatsWidget Display
Example SHALL display deck.gl StatsWidget showing FPS and memory metrics.

#### Scenario: Render StatsWidget
- **WHEN** MapClient renders
- **THEN** `<Deckgl>` MUST include `widgets={[new StatsWidget({ id: "stats" })]}` prop

#### Scenario: Widget visible in UI
- **WHEN** map loads
- **THEN** stats widget MUST appear in bottom-left corner

### Requirement: Modern React Patterns
Example SHALL showcase modern React patterns including Suspense and useDeferredValue.

#### Scenario: Suspense wrapper
- **WHEN** rendering application root
- **THEN** wrap Page component in `<Suspense fallback={...}>`

#### Scenario: Deferred search input
- **WHEN** implementing search box
- **THEN** use `useDeferredValue()` to debounce search updates

#### Scenario: Transition pending state
- **WHEN** search query changes
- **THEN** use `useTransition()` to show pending indicator

### Requirement: Package Dependencies
Example SHALL use pnpm workspace catalog for version consistency.

#### Scenario: Core dependencies
- **WHEN** setting up package.json
- **THEN** MUST include: `@deckgl-fiber-renderer/dom: "workspace:*"`, `@deck.gl/core: "catalog:"`, `@deck.gl/layers: "catalog:"`, `@deck.gl/widgets: "catalog:"`, `maplibre-gl: "catalog:"`

#### Scenario: Vite specific dependencies
- **WHEN** setting up package.json
- **THEN** MUST include: `@tanstack/react-query: "^5.67.3"`, `@vitejs/plugin-react: "^4.3.4"`, `vite: "^6.2.1"`, `zustand: "catalog:"`

### Requirement: Directory Structure
Example SHALL follow standard Vite project conventions.

#### Scenario: Source directory structure
- **WHEN** organizing files
- **THEN** use `src/` with subdirectories: `api/`, `components/`, `hooks/`, `store/`

#### Scenario: Entry point
- **WHEN** setting up application
- **THEN** MUST have `src/main.tsx` (entry), `src/app.tsx` (QueryClient wrapper), `src/page.tsx` (composition root)

#### Scenario: Single-file components
- **WHEN** creating components
- **THEN** use flat structure: `src/components/map.tsx`, `src/components/airports-layer.tsx`, etc.
