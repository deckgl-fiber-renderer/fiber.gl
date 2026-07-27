## ADDED Requirements

### Requirement: Compat DeckGL exports a dedicated supported React wrapper package entrypoint
The compat change SHALL define `DeckGL` at `@deckgl-fiber-renderer/compat` as the supported React migration entrypoint for this change.

#### Scenario: Root compat package import is supported
- **GIVEN** an application currently imports `DeckGL` from `@deck.gl/react`
- **WHEN** the application switches to `import { DeckGL } from '@deckgl-fiber-renderer/compat'`
- **THEN** the change specification treats that root compat package import as supported
- **AND** the change specification keeps views, compat context, compat ref types, and shared compat types at the package root

### Requirement: Compat DeckGL scopes its migration promise to supported official patterns
The compat `DeckGL` wrapper SHALL promise migration assistance only for the supported official `@deck.gl/react` patterns defined in this change.

#### Scenario: Supported migration claim stays testable
- **GIVEN** an application uses supported `@deck.gl/react` patterns
- **WHEN** it swaps the `DeckGL` import to `@deckgl-fiber-renderer/compat`
- **THEN** the migration claim is limited to reduced React-surface rewrite work for supported patterns
- **AND** the specification does not claim full `@deck.gl/react` behavioral parity

#### Scenario: Unsupported official patterns are not implied as supported
- **GIVEN** an application uses official `Render callbacks` or widget React components
- **WHEN** the compat migration surface is documented
- **THEN** those patterns are called out as unsupported or deferred instead of being implied to work

### Requirement: Compat DeckGL aligns its public prop surface to the approved official-shaped boundary
The compat `DeckGL` wrapper SHALL define an official-shaped public prop boundary that matches the approved proposal and design for this change.

#### Scenario: Supported public prop boundary is explicit
- **GIVEN** the compat `DeckGL` public API is specified
- **WHEN** its prop surface is described
- **THEN** it includes the supported official-style React surface needed for this change
- **AND** it excludes low-level `gl`, `canvas`, `parent`, and `_customRender` from the supported compat API claim
- **AND** those exclusions are explicitly called out for review rather than implied only by omission

#### Scenario: ContextProvider remains part of the supported surface
- **GIVEN** a consumer uses the compat `DeckGL` wrapper
- **WHEN** the supported React-facing props are described
- **THEN** `ContextProvider` is included in the supported compat surface

### Requirement: Compat DeckGL supports supported JSX child composition through compat wrappers
The compat `DeckGL` wrapper SHALL support the approved migration path for JSX layer and view composition through the compat package and compat subpath wrapper inventory defined by this change.

#### Scenario: Compat layer children are supported
- **GIVEN** a consumer renders compat layer wrapper children under `DeckGL`
- **WHEN** those children correspond to wrappers included in this change's approved inventory
- **THEN** the spec treats that JSX composition pattern as supported

#### Scenario: Compat view children are supported
- **GIVEN** a consumer renders compat view wrapper children under `DeckGL`
- **WHEN** those children correspond to wrappers included in this change's approved inventory
- **THEN** the spec treats that JSX composition pattern as supported

#### Scenario: Layer IDs remain explicit in compat examples
- **GIVEN** a compat JSX layer example appears in the spec
- **WHEN** a layer wrapper is shown
- **THEN** the example includes an explicit stable `id`

### Requirement: Compat DeckGL documents unsupported official Render callbacks and detectable unsupported usage
The compat `DeckGL` wrapper SHALL explicitly exclude official `Render callbacks` from the supported scope of this change and define development-only warnings for detectable unsupported usage.

#### Scenario: Function children are documented as unsupported
- **GIVEN** a consumer provides `children` as a function such as `{({viewport}) => ...}`
- **WHEN** the compat behavior is specified
- **THEN** that pattern is described as unsupported in this change
- **AND** the spec uses the official term `Render callbacks`

#### Scenario: Development warnings are emitted for detectable unsupported props
- **GIVEN** a compat consumer provides a detectable unsupported prop or migration pattern
- **WHEN** compat `DeckGL` runs in development mode
- **THEN** the spec allows a runtime warning that points the user to migration guidance
- **AND** the same scenario remains silent in production mode

### Requirement: Compat DeckGL documents widgets and widget hooks as deferred from this change
The compat `DeckGL` wrapper SHALL explicitly describe widget React wrappers and `useWidget` as deferred from this change.

#### Scenario: Widget React components are documented as deferred
- **GIVEN** a consumer expects widget JSX such as `<ZoomWidget />` under compat `DeckGL`
- **WHEN** the compat scope is described
- **THEN** the spec marks widget wrapper support as deferred to a future change
- **AND** it does not claim widget JSX support in this change

#### Scenario: useWidget is documented as deferred
- **GIVEN** a consumer expects the upstream `useWidget` hook documented at `https://deck.gl/docs/api-reference/react/use-widget`
- **WHEN** the compat scope is described
- **THEN** the spec marks `useWidget` support as deferred to a future change
- **AND** it does not imply hook parity in this change
