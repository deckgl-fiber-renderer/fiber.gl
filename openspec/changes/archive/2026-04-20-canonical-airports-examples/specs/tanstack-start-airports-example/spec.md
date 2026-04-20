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

Data fetching SHALL use TanStack Start server functions with `createServerFn`.

#### Scenario: Define airports server function

- **WHEN** creating data fetching logic
- **THEN** export `createServerFn({ method: "GET" })` with `.validator(zodValidator(schema))` and `.handler(async ({ data }) => { ... })`

#### Scenario: Server function placement

- **WHEN** organizing server functions
- **THEN** place in `app/server/airports.ts` file (replaces data-access layer in import hierarchy)

#### Scenario: Server-side filtering

- **WHEN** search query parameter exists
- **THEN** server function handler MUST parse search from request data and filter API results based on search term

#### Scenario: Return GeoJSON features

- **WHEN** server function fetches data
- **THEN** return `data.features` array from GeoJSON response

#### Scenario: Type-safe input validation

- **WHEN** defining server function
- **THEN** use zod validator for input: `.validator(zodValidator(z.object({ search: z.string().optional() })))`

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

Example SHALL use TanStack Router file-based routing with `createFileRoute`.

#### Scenario: Define index route

- **WHEN** creating homepage route
- **THEN** use `export const Route = createFileRoute("/")({ component: HomePage })` in `app/routes/index.tsx`

#### Scenario: Route component structure

- **WHEN** implementing route component
- **THEN** wrap in Suspense and compose MapClient + sidebar + detail card

#### Scenario: Route file location

- **WHEN** organizing routes
- **THEN** place route files in `app/routes/` directory with file-based naming (e.g., `index.tsx` for root route)

### Requirement: Zustand State Management with URL Sync

State management SHALL use Zustand store with manual URL synchronization via middleware.

#### Scenario: Selected airport in store and URL

- **WHEN** user selects airport
- **THEN** update Zustand store AND push to URL with `window.history.pushState()` via Zustand middleware

#### Scenario: Search query in store and URL

- **WHEN** user types search
- **THEN** update Zustand store AND push to URL parameter `?q={term}` via Zustand middleware

#### Scenario: Transient hover state

- **WHEN** user hovers airport
- **THEN** update Zustand store only (no URL sync) - separate store or conditional middleware

#### Scenario: URL sync middleware pattern

- **WHEN** creating Zustand store for persistent state
- **THEN** implement custom middleware that calls `window.history.pushState()` on state changes

#### Scenario: Initialize state from URL

- **WHEN** store is created
- **THEN** read initial values from `window.location.search` URLSearchParams

### Requirement: Single-File Components

Components SHALL be organized as single files (not Next.js five-file pattern).

#### Scenario: AirportsLayer component

- **WHEN** implementing airports layer feature
- **THEN** create single file `app/features/airports-layer/index.tsx` with all logic (data fetching + rendering)

#### Scenario: Component hooks usage

- **WHEN** component needs data
- **THEN** call `useSuspenseQuery()` directly in component, which calls server function via queryFn

#### Scenario: No loading/error/server file split

- **WHEN** implementing features
- **THEN** MUST NOT use Next.js five-file pattern - keep all logic in single file with error boundaries handled at route level

#### Scenario: Feature vs Component distinction

- **WHEN** organizing code
- **THEN** data-fetching components go in `features/` directory, pure UI components go in `components/` directory

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

Detail card SHALL display when airport is selected and fetch detailed data.

#### Scenario: Show card on selection

- **WHEN** `selected` state is not null (from Zustand + URL)
- **THEN** AirportsCard component MUST render with airport details

#### Scenario: Fetch single airport with server function

- **WHEN** detail card renders
- **THEN** use `useSuspenseQuery({ queryKey: ["airport", id], queryFn: () => getAirportById({ data: { id } }) })`

#### Scenario: Define getAirportById server function

- **WHEN** creating detail fetch logic
- **THEN** export `getAirportById = createServerFn({ method: "GET" }).validator(zodValidator(z.object({ id: z.string() }))).handler(async ({ data }) => { ... })` in `app/server/airports.ts`

#### Scenario: Hide card on deselection

- **WHEN** `selected` state is null
- **THEN** detail card MUST not render

#### Scenario: Detail card error boundary

- **WHEN** airport fetch fails
- **THEN** show error message within card (not crash entire route)

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

#### Scenario: TanStack Start framework dependencies

- **WHEN** setting up package.json
- **THEN** MUST include: `@tanstack/react-query: "^5.67.3"`, `@tanstack/react-router: "^1.100.0"`, `@tanstack/start: "^1.100.0"`, `@tanstack/router-devtools: "^1.100.0"`

#### Scenario: State management dependencies

- **WHEN** setting up package.json
- **THEN** MUST include: `zustand: "catalog:"` for transient state

#### Scenario: Validation dependencies

- **WHEN** setting up package.json
- **THEN** MUST include: `zod: "catalog:"`, `@tanstack/zod-adapter: "^1.100.0"` for server function input validation

#### Scenario: Build and dev dependencies

- **WHEN** setting up package.json
- **THEN** MUST include: `@tanstack/router-plugin: "^1.100.0"` in devDependencies for file-based routing code generation

### Requirement: Directory Structure

Example SHALL follow TanStack Start conventions with definitive-react.md import hierarchy.

#### Scenario: App directory structure

- **WHEN** organizing files
- **THEN** use `app/` with subdirectories following definitive-react.md import hierarchy: `server/` (replaces data-access), `hooks/`, `stores/`, `modules/`, `features/` (single-file), `components/`, `routes/`

#### Scenario: Server functions location

- **WHEN** creating server functions
- **THEN** place in `app/server/airports.ts` with `createServerFn` exports (replaces data-access layer in import hierarchy)

#### Scenario: Route files

- **WHEN** creating routes
- **THEN** use `app/routes/index.tsx` with `createFileRoute` export

#### Scenario: Single-file features

- **WHEN** creating data-fetching components
- **THEN** use single-file pattern in `features/`: `features/airports-layer/index.tsx`, `features/airports-list/index.tsx`, `features/airports-card/index.tsx`

#### Scenario: Pure UI components

- **WHEN** creating components without data fetching
- **THEN** place in `components/`: `components/search-box.tsx`

#### Scenario: Import hierarchy compliance

- **WHEN** importing between directories
- **THEN** MUST follow tier system: server/ (tier 6) → hooks/ (tier 4) → stores/ (tier 4) → modules/ (tier 5) → features/ (tier 7) → routes/ (tier 8)

### Requirement: TanStack Start Configuration

Example SHALL include proper TanStack Start configuration files.

#### Scenario: App config file

- **WHEN** setting up project
- **THEN** create `app.config.ts` with TanStack Router configuration and server/client configuration

#### Scenario: Router plugin configuration

- **WHEN** configuring Vite
- **THEN** include `@tanstack/router-plugin/vite` in `vite.config.ts` for file-based routing code generation

#### Scenario: TypeScript configuration

- **WHEN** setting up TypeScript
- **THEN** configure `tsconfig.json` with `"jsx": "react-jsx"`, `"moduleResolution": "Bundler"`, `"module": "ESNext"`, `"target": "ES2022"`

#### Scenario: Root route configuration

- **WHEN** creating root application structure
- **THEN** create `app/routes/__root.tsx` with `createRootRoute()` that includes QueryClientProvider and outlet

### Requirement: QueryClient Configuration

Example SHALL configure TanStack Query for optimal caching.

#### Scenario: QueryClient setup in root

- **WHEN** setting up QueryClient
- **THEN** create QueryClient instance in root route with `defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } }` (5 minutes)

#### Scenario: QueryClientProvider placement

- **WHEN** wrapping application
- **THEN** wrap `<Outlet />` in `<QueryClientProvider client={queryClient}>` in root route

#### Scenario: React Query Devtools

- **WHEN** in development mode
- **THEN** optionally include `<ReactQueryDevtools />` for debugging queries

### Requirement: Build Scripts and Development

Example SHALL include proper npm scripts for TanStack Start development.

#### Scenario: Development script

- **WHEN** running local development
- **THEN** use `"dev": "vinxi dev"` script to start development server

#### Scenario: Build script

- **WHEN** building for production
- **THEN** use `"build": "vinxi build"` script to create production bundle

#### Scenario: Start script

- **WHEN** running production server
- **THEN** use `"start": "vinxi start"` script to serve built application

#### Scenario: Type checking

- **WHEN** validating TypeScript
- **THEN** use `"typecheck": "tsc --noEmit"` script

### Requirement: Vinxi Build Configuration

Example SHALL use Vinxi as the build orchestrator for TanStack Start.

#### Scenario: Vinxi configuration file

- **WHEN** configuring build
- **THEN** create `app.config.ts` that exports TanStack Start preset configuration

#### Scenario: Vite integration

- **WHEN** customizing build
- **THEN** extend Vite configuration through `app.config.ts` with `vite: { plugins: [...] }` option

#### Scenario: Server and client builds

- **WHEN** building application
- **THEN** Vinxi automatically handles both server and client build outputs

### Requirement: Styling and CSS

Example SHALL include minimal styling for layout and interactions.

#### Scenario: Global styles

- **WHEN** setting up base styles
- **THEN** create `app/styles/globals.css` with basic layout and reset styles

#### Scenario: Component-specific styles

- **WHEN** styling components
- **THEN** use CSS modules or inline styles - keep styling minimal and functional

#### Scenario: Maplibre GL styles

- **WHEN** using Maplibre
- **THEN** import `maplibre-gl/dist/maplibre-gl.css` in root route for map styling

#### Scenario: Highlight styles

- **WHEN** airport is selected or hovered
- **THEN** use conditional styling (red color, larger radius) based on state

### Requirement: Application Entry Points

Example SHALL define proper client and server entry points.

#### Scenario: Client entry point

- **WHEN** setting up client rendering
- **THEN** create `app/client.tsx` that imports router and starts the application with `StartClient`

#### Scenario: Server entry point

- **WHEN** setting up SSR
- **THEN** create `app/server.tsx` that handles server-side rendering with `StartServer`

#### Scenario: Router initialization

- **WHEN** creating router instance
- **THEN** use `@tanstack/react-router` createRouter with generated route tree from file-based routing

#### Scenario: HTML template

- **WHEN** defining document structure
- **THEN** create `app/routes/__root.tsx` with Document component that includes `<html>`, `<head>`, `<body>` structure

### Requirement: Development Experience

Example SHALL provide good developer experience with hot module replacement and devtools.

#### Scenario: HMR support

- **WHEN** developing locally
- **THEN** Vinxi dev server automatically provides hot module replacement for fast iteration

#### Scenario: Router devtools

- **WHEN** in development mode
- **THEN** optionally include `<TanStackRouterDevtools />` from `@tanstack/router-devtools` for route debugging

#### Scenario: Type generation

- **WHEN** files change in routes directory
- **THEN** `@tanstack/router-plugin` automatically regenerates type-safe route tree

#### Scenario: Error overlay

- **WHEN** errors occur in development
- **THEN** Vinxi displays error overlay with stack traces and source mapping

### Requirement: Server Function Error Handling

Server functions SHALL include proper error handling and type safety.

#### Scenario: Try-catch in handler

- **WHEN** implementing server function handler
- **THEN** wrap fetch calls in try-catch and return meaningful error messages

#### Scenario: Validation error handling

- **WHEN** server function receives invalid input
- **THEN** zod validator automatically throws validation error before handler executes

#### Scenario: Network error handling

- **WHEN** external API call fails
- **THEN** server function MUST throw error with descriptive message for client to handle
