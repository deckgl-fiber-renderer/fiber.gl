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

### Requirement: Server Functions for Data Fetching
Data fetching SHALL use Tanstack Start server functions with `createServerFn`.

#### Scenario: Define airports server function
- **WHEN** creating data fetching logic
- **THEN** use `createServerFn({ method: "GET" }).validator(...).handler(async ({ data }) => { ... })`

#### Scenario: Server-side filtering
- **WHEN** search query parameter exists
- **THEN** server function handler MUST filter API results based on search term

#### Scenario: Return GeoJSON features
- **WHEN** server function fetches data
- **THEN** return `data.features` array from GeoJSON response

### Requirement: TanStack Query with Server Functions
Client components SHALL use TanStack Query to call server functions.

#### Scenario: Call server function from hook
- **WHEN** fetching airports data
- **THEN** use `useSuspenseQuery({ queryKey: ["airports", search], queryFn: () => getAirports({ data: { search } }) })`

#### Scenario: Query cache configuration
- **WHEN** setting up QueryClient
- **THEN** configure `staleTime: 5 * 60 * 1000` (5 minutes)

#### Scenario: Type-safe server function calls
- **WHEN** calling server functions
- **THEN** pass data via `{ data: { ... } }` parameter object

### Requirement: File-Based Routing
Example SHALL use Tanstack Router file-based routing with `createFileRoute`.

#### Scenario: Define index route
- **WHEN** creating homepage
- **THEN** use `export const Route = createFileRoute("/")({ component: HomePage })`

#### Scenario: Route component structure
- **WHEN** implementing route component
- **THEN** wrap in Suspense and compose MapClient + sidebar + detail card

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

### Requirement: Single-File Components
Components SHALL be organized as single files (not five-file pattern).

#### Scenario: AirportsLayer component
- **WHEN** implementing airports layer
- **THEN** create single file `app/components/airports-layer.tsx` with all logic

#### Scenario: Component hooks usage
- **WHEN** component needs data
- **THEN** call `useAirports()` hook which internally calls server function

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
- **THEN** use `useSuspenseQuery` calling `getAirportById` server function

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
- **WHEN** rendering route component
- **THEN** wrap content in `<Suspense fallback={...}>`

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

#### Scenario: Tanstack Start specific dependencies
- **WHEN** setting up package.json
- **THEN** MUST include: `@tanstack/react-query: "^5.67.3"`, `@tanstack/react-router: "^1.100.0"`, `@tanstack/start: "^1.100.0"`, `zustand: "catalog:"`

### Requirement: Directory Structure
Example SHALL follow Tanstack Start conventions.

#### Scenario: App directory structure
- **WHEN** organizing files
- **THEN** use `app/` with subdirectories: `routes/`, `server/`, `components/`, `hooks/`, `store/`

#### Scenario: Server functions location
- **WHEN** creating server functions
- **THEN** place in `app/server/airports.ts` with `createServerFn` exports

#### Scenario: Route files
- **WHEN** creating routes
- **THEN** use `app/routes/index.tsx` with `createFileRoute` export
