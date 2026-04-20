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

### Requirement: Loader Functions for Data Fetching
Data fetching SHALL use React Router v7 loader functions.

#### Scenario: Define route loader
- **WHEN** creating route with data requirements
- **THEN** export `async function loader({ request }: Route.LoaderArgs)` that fetches and returns data

#### Scenario: Server-side filtering in loader
- **WHEN** search query parameter exists
- **THEN** loader MUST parse `?q=` from URL and filter API results

#### Scenario: Return loader data
- **WHEN** loader completes fetch
- **THEN** return object with `{ airports: data.features, search }` shape

### Requirement: Type-Safe Loader Data Access
Components SHALL access loader data with type-safe props.

#### Scenario: Component receives loader data
- **WHEN** route component renders
- **THEN** receive typed props: `({ loaderData }: Route.ComponentProps)`

#### Scenario: Destructure loader data
- **WHEN** accessing data in component
- **THEN** destructure: `const { airports } = loaderData`

### Requirement: URL State Management with nuqs
Selected airport and search query SHALL be stored in URL using nuqs library.

#### Scenario: Select airport with nuqs
- **WHEN** user clicks airport
- **THEN** use `const [selected, setSelected] = useQueryState("selected")` to update URL

#### Scenario: Search with nuqs
- **WHEN** user types search
- **THEN** use `const [search, setSearch] = useQueryState("q")` to update URL

#### Scenario: nuqs integration with React Router
- **WHEN** configuring nuqs
- **THEN** MUST set `history: "push"` and `shallow: false` for React Router compatibility

### Requirement: Zustand for Transient State
Hover interactions SHALL use Zustand store without URL persistence.

#### Scenario: Hover state in Zustand
- **WHEN** user hovers airport
- **THEN** update Zustand store only (not URL)

#### Scenario: Separate stores
- **WHEN** organizing state
- **THEN** create `app/store/hover.ts` for transient state, use nuqs for persistent state

### Requirement: Props-Based Data Flow
Components SHALL receive data via props from loader, not hooks.

#### Scenario: Pass data to layers
- **WHEN** route component renders
- **THEN** pass loader data as props: `<AirportsLayer data={airports} />`

#### Scenario: Pass data to list
- **WHEN** rendering list component
- **THEN** pass loader data as props: `<AirportsList data={airports} />`

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
- **WHEN** `selected` URL parameter exists (via nuqs)
- **THEN** AirportsCard component MUST render with airport details

#### Scenario: Fetch single airport
- **WHEN** detail card renders
- **THEN** fetch single airport by ID from API (client-side or separate loader)

#### Scenario: Hide card on deselection
- **WHEN** URL parameter `selected` is removed
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

#### Scenario: React Router specific dependencies
- **WHEN** setting up package.json
- **THEN** MUST include: `@react-router/dev: "^7.0.0"`, `@react-router/node: "^7.0.0"`, `@react-router/serve: "^7.0.0"`, `nuqs: "^2.4.1"`, `zustand: "catalog:"`

### Requirement: Directory Structure
Example SHALL follow React Router v7 conventions.

#### Scenario: App directory structure
- **WHEN** organizing files
- **THEN** use `app/` with subdirectories: `routes/`, `components/`, `hooks/`, `store/`

#### Scenario: Route files with types
- **WHEN** creating routes
- **THEN** use `app/routes/home.tsx` with `import type { Route } from "./+types/home"`

#### Scenario: Single-file components
- **WHEN** creating components
- **THEN** use flat structure: `app/components/map.tsx`, `app/components/airports-layer.tsx`, etc.
