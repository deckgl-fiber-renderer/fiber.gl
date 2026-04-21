## ADDED Requirements

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
