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

#### Scenario: Missing ID validation
- **WHEN** layer ID is missing in development mode
- **THEN** reconciler should log validation warning

### Requirement: Five-File RSC Pattern
Each data-fetching feature SHALL follow Next.js five-file pattern with proper server/client separation.

#### Scenario: AirportsLayer structure
- **WHEN** implementing airports layer feature
- **THEN** create files: `index.tsx` (orchestrator), `server.tsx` (data fetch), `client.tsx` (interactive), `loading.tsx` (fallback), `error.tsx` (boundary)

#### Scenario: Server-only orchestrator
- **WHEN** creating feature index file
- **THEN** MUST include `"use server"` directive and wrap children in Suspense + ErrorBoundary

### Requirement: Use Cache Data Fetching
Data fetching SHALL use Next.js 15 "use cache" directive in Data Access Layer (DAL).

#### Scenario: Fetch airports with caching
- **WHEN** fetching airports data
- **THEN** DAL function MUST include `"use cache"` directive and `unstable_cacheTag()`

#### Scenario: Search-filtered data
- **WHEN** search query parameter exists
- **THEN** DAL MUST include search term in cache key and API query

### Requirement: URL State Management with nuqs
Selected airport and search query SHALL be stored in URL using nuqs library.

#### Scenario: Select airport
- **WHEN** user clicks airport on map or list
- **THEN** URL MUST update to `?selected={GLOBAL_ID}`

#### Scenario: Search airports
- **WHEN** user types in search box
- **THEN** URL MUST update to `?q={search-term}`

#### Scenario: Browser back/forward
- **WHEN** user navigates browser history
- **THEN** selected airport and search state MUST restore from URL

### Requirement: Transient Hover State with Zustand
Hover interactions SHALL use Zustand store without URL persistence.

#### Scenario: Hover list item
- **WHEN** user hovers over list item
- **THEN** set hover index in Zustand store (not URL)

#### Scenario: Highlight hovered airport
- **WHEN** hover state changes in store
- **THEN** corresponding map point MUST change size/color

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
Detail card SHALL display when airport is selected via URL state.

#### Scenario: Show card on selection
- **WHEN** `?selected={id}` URL parameter exists
- **THEN** AirportsCard component MUST render with airport details

#### Scenario: Fetch single airport
- **WHEN** detail card renders
- **THEN** DAL MUST fetch single airport by ID with `"use cache"`

#### Scenario: Hide card on deselection
- **WHEN** URL parameter `selected` is removed
- **THEN** detail card MUST not render

### Requirement: Maplibre Base Map Integration
Example SHALL render Maplibre base map with deck.gl in interleaved mode.

#### Scenario: Initialize Maplibre with deck.gl
- **WHEN** MapClient component mounts
- **THEN** create Maplibre map instance and add Deckgl instance as control

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
Example SHALL showcase modern React 19 patterns including Suspense and useDeferredValue.

#### Scenario: Suspense boundaries per feature
- **WHEN** implementing data-fetching features
- **THEN** wrap each in `<Suspense>` with loading fallback

#### Scenario: Deferred search input
- **WHEN** implementing search box
- **THEN** use `useDeferredValue()` to debounce search updates

#### Scenario: Transition pending state
- **WHEN** search query changes
- **THEN** use `useTransition()` to show pending indicator

### Requirement: Server-Side Search Filtering
Search filtering SHALL execute on server via API query parameters.

#### Scenario: Filter airports by name
- **WHEN** user searches for "JFK"
- **THEN** DAL MUST modify API URL with `&where=NAME LIKE '%JFK%'`

#### Scenario: Return filtered results
- **WHEN** DAL receives filtered response
- **THEN** cache with search-specific tag and return to client

### Requirement: Scrollable Sidebar List
Airports list SHALL be scrollable with selected item auto-scroll.

#### Scenario: Scroll to selected item
- **WHEN** selected airport changes
- **THEN** list MUST scroll selected item into view with `scrollIntoView({ behavior: "smooth", block: "nearest" })`

#### Scenario: List overflow
- **WHEN** airports list exceeds viewport height
- **THEN** list MUST be scrollable with `overflow: auto`

### Requirement: Package Dependencies
Example SHALL use pnpm workspace catalog for version consistency.

#### Scenario: Core dependencies
- **WHEN** setting up package.json
- **THEN** MUST include: `@deckgl-fiber-renderer/dom: "workspace:*"`, `@deck.gl/core: "catalog:"`, `@deck.gl/layers: "catalog:"`, `@deck.gl/widgets: "catalog:"`, `maplibre-gl: "catalog:"`

#### Scenario: Next.js specific dependencies
- **WHEN** setting up package.json
- **THEN** MUST include: `next: "canary"`, `nuqs: "^2.4.1"`, `server-only`, `client-only`, `zustand: "catalog:"`

### Requirement: Directory Structure
Example SHALL follow Next.js 15 App Router conventions.

#### Scenario: App router structure
- **WHEN** organizing files
- **THEN** use `app/` directory with `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

#### Scenario: Source directory structure
- **WHEN** organizing source files
- **THEN** use `src/` with subdirectories: `dal/`, `components/`, `hooks/`, `stores/`, `utils/`

#### Scenario: Component feature folders
- **WHEN** organizing component files
- **THEN** group by feature: `components/airports-layer/`, `components/airports-list/`, etc.
