## ADDED Requirements

<<<<<<< HEAD
### Requirement: DeckGLProps type matches official API
The DeckGLProps type SHALL include all props from official `@deck.gl/react` DeckGL component except unsupported props.

#### Scenario: DeckGLProps includes standard deck props
- **WHEN** user types DeckGLProps in editor
- **THEN** includes all DeckProps from @deck.gl/core (layers, initialViewState, controller, etc.)

#### Scenario: DeckGLProps excludes unsupported props
- **WHEN** user checks DeckGLProps definition
- **THEN** canvas, gl, parent, Deck, and _customRender are excluded via Omit

#### Scenario: DeckGLProps includes compat-specific props
- **WHEN** user types DeckGLProps
- **THEN** includes width, height (string | number), children (ReactNode), and ContextProvider

### Requirement: DeckGLRef type matches official API
The DeckGLRef type SHALL expose same methods and properties as official `@deck.gl/react` DeckGL ref.

#### Scenario: DeckGLRef includes deck property
- **WHEN** user accesses ref type
- **THEN** includes `deck?: Deck` property

#### Scenario: DeckGLRef includes picking methods
- **WHEN** user checks ref type
- **THEN** includes pickObject, pickObjects, pickMultipleObjects, pickObjectAsync, pickObjectsAsync with correct signatures

### Requirement: DeckGLContextValue type matches official API
The DeckGLContextValue type SHALL match the official context value shape.

#### Scenario: Context type includes viewport
- **WHEN** user types context value
- **THEN** includes `viewport: Viewport` property

#### Scenario: Context type includes deck instance
- **WHEN** user checks context type
- **THEN** includes `deck?: Deck` property

#### Scenario: Context type includes event manager
- **WHEN** user types context
- **THEN** includes `eventManager: EventManager` property

#### Scenario: Context type includes container
- **WHEN** user checks context type
- **THEN** includes `container: HTMLElement` property

#### Scenario: Context type includes callbacks
- **WHEN** user types context
- **THEN** includes `onViewStateChange` and `widgets` properties

### Requirement: Layer wrapper props types preserve generics
Layer wrapper component prop types SHALL preserve full generic type information from deck.gl layer classes.

#### Scenario: ScatterplotLayer props include data generic
- **WHEN** user types `<ScatterplotLayer<MyDataType>`
- **THEN** data prop is typed as `MyDataType[]`

#### Scenario: Layer props include accessor types
- **WHEN** user types layer accessor props
- **THEN** accessor functions receive correctly typed data parameter

### Requirement: View wrapper props types match deck.gl views
View wrapper component prop types SHALL match the corresponding deck.gl view class props.

#### Scenario: MapView props include view-specific options
- **WHEN** user types `<MapView`
- **THEN** IntelliSense shows MapView-specific props (repeat, nearZMultiplier, etc.)

### Requirement: useWidget hook has generic type signature
The useWidget hook type SHALL accept generic widget class and props types.

#### Scenario: useWidget infers widget type
- **WHEN** user calls `const widget = useWidget(ZoomWidget, props)`
- **THEN** widget is typed as ZoomWidget instance

#### Scenario: useWidget infers props type
- **WHEN** user types `useWidget(ZoomWidget, ...)`
- **THEN** props parameter is typed as ZoomWidgetProps

### Requirement: Types are exported from compat entry
All compat types SHALL be exported from the `/compat` entry point.

#### Scenario: Types available via compat import
- **WHEN** user imports `import type { DeckGLProps } from '@deckgl-fiber-renderer/dom/compat'`
- **THEN** type is available and correct

### Requirement: Layer wrapper components have children prop
All layer and view wrapper component types SHALL include children prop of type ReactNode.

#### Scenario: Layer accepts children in types
- **WHEN** user provides children to layer wrapper
- **THEN** TypeScript accepts children prop as ReactNode

### Requirement: Types reference @deck.gl/core types
Compat types SHALL reference types from `@deck.gl/core` where appropriate rather than duplicating.

#### Scenario: DeckProps reused from core
- **WHEN** DeckGLProps extends deck.gl types
- **THEN** uses `Omit<DeckProps<ViewsT>, ...>` to build on official types
=======
### Requirement: Compat types are exported from the compat package root and related family subpaths
The compat change SHALL define its public compat types at `@deckgl-fiber-renderer/compat`, with family-specific wrapper exports available from the related compat layer subpaths.

#### Scenario: Compat shared type imports use the root compat package entrypoint
- **GIVEN** a consumer imports compat shared types
- **WHEN** the public type surface is described
- **THEN** the spec defines shared types under `@deckgl-fiber-renderer/compat`
- **AND** it keeps `DeckGLProps`, `DeckGLRef`, and `DeckGLContextValue` at the package root

### Requirement: Compat types mirror the approved supported surface without depending on @deck.gl/react
The compat change SHALL define `DeckGL`-style public types that match the approved supported surface of this change without claiming a dependency on `@deck.gl/react`.

#### Scenario: DeckGLProps reflects the approved compat prop boundary
- **GIVEN** a consumer uses the compat public prop type
- **WHEN** `DeckGLProps` is described
- **THEN** the type reflects the approved supported compat prop boundary for this change
- **AND** it does not claim low-level `gl`, `canvas`, `parent`, or `_customRender` as supported compat props

#### Scenario: DeckGLRef reflects the approved ref inventory
- **GIVEN** a consumer uses the compat public ref type
- **WHEN** `DeckGLRef` is described
- **THEN** the type includes exactly the approved ref inventory of `deck`, `pickObject`, `pickObjects`, `pickMultipleObjects`, `pickObjectAsync`, and `pickObjectsAsync`

#### Scenario: DeckGLContextValue reflects partial context parity
- **GIVEN** a consumer uses the compat public context type
- **WHEN** `DeckGLContextValue` is described
- **THEN** the type reflects the partial and explicit context parity approved for this change
- **AND** it does not over-promise unsupported official context fields or update semantics

### Requirement: Compat types support the approved wrapper matrices explicitly
The compat type surface SHALL reflect the approved layer and view wrapper inventories defined for this change.

#### Scenario: Layer wrapper types cover the approved layer matrix
- **GIVEN** a consumer uses compat JSX layer wrappers in TypeScript
- **WHEN** the wrapper type surface is described
- **THEN** the spec aligns those types to the approved wrapper matrix for `@deck.gl/layers`, `@deck.gl/geo-layers`, and `@deck.gl/mesh-layers`

#### Scenario: View wrapper types cover the approved view matrix
- **GIVEN** a consumer uses compat JSX view wrappers in TypeScript
- **WHEN** the wrapper type surface is described
- **THEN** the spec aligns those types to the approved wrapper matrix for `MapView`, `OrthographicView`, `OrbitView`, `FirstPersonView`, and `GlobeView`

### Requirement: Compat types do not include widget compat APIs in this change
The compat type surface SHALL keep widget-related APIs out of scope for this change and explicitly call those exclusions out for review.

#### Scenario: Widget hook types are not part of the supported compat type surface
- **GIVEN** widgets are deferred from this change
- **WHEN** the compat type surface is specified
- **THEN** the spec does not include `useWidget` or widget wrapper types as supported compat APIs

#### Scenario: Excluded shared types are called out for review
- **GIVEN** official or deck.gl-adjacent public types are omitted from the compat package contract
- **WHEN** the compat type surface is specified
- **THEN** the omitted types are explicitly called out for review rather than hidden by omission
>>>>>>> d82a74ad398b62b1f1a62d6cb1242232059ae706
