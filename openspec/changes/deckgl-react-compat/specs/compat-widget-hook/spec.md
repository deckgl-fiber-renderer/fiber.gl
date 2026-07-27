## ADDED Requirements

### Requirement: useWidget hook creates widget instance
The useWidget hook SHALL create a widget instance from the provided widget class.

#### Scenario: Widget instance is created on mount
- **WHEN** component calls `useWidget(ZoomWidget, props)`
- **THEN** new ZoomWidget instance is created with props

#### Scenario: Widget instance persists across re-renders
- **WHEN** component re-renders with same widget class
- **THEN** same widget instance is reused

### Requirement: useWidget hook updates widget props
The useWidget hook SHALL call setProps on the widget when props change.

#### Scenario: Props update on existing widget
- **WHEN** component re-renders with new props
- **THEN** widget.setProps(newProps) is called

### Requirement: useWidget hook adds widget to deck
The useWidget hook SHALL add the widget to deck.gl's widgets array.

#### Scenario: Widget is added to deck on mount
- **WHEN** widget instance is created
- **THEN** deck.setProps is called with updated widgets array including new widget

### Requirement: useWidget hook removes widget on unmount
The useWidget hook SHALL remove the widget from deck when component unmounts.

#### Scenario: Widget is removed from deck
- **WHEN** component unmounts
- **THEN** deck.setProps is called with widgets array excluding removed widget

### Requirement: useWidget hook returns widget instance
The useWidget hook SHALL return the widget instance for ref or imperative access.

#### Scenario: Component accesses widget instance
- **WHEN** component stores `const widget = useWidget(...)`
- **THEN** widget variable contains the Widget instance

### Requirement: useWidget hook accepts generic types
The useWidget hook SHALL preserve TypeScript generic types for widget class and props.

#### Scenario: Type-safe widget props
- **WHEN** developer types `useWidget(ZoomWidget, {...})`
- **THEN** props parameter is typed as ZoomWidgetProps

#### Scenario: Type-safe return value
- **WHEN** developer assigns `const widget = useWidget(ZoomWidget, props)`
- **THEN** widget is typed as ZoomWidget instance

### Requirement: useWidget hook integrates with DeckGLContext
The useWidget hook SHALL read deck instance from existing store infrastructure.

#### Scenario: Hook reads deck from store
- **WHEN** useWidget is called
- **THEN** uses useDeckgl() to get deck instance

### Requirement: Widget lifecycle is synchronized with React
The useWidget hook SHALL ensure widget lifecycle matches component lifecycle.

#### Scenario: Widget added after deck ready
- **WHEN** deck instance exists
- **THEN** widget is added immediately

#### Scenario: Widget cleanup on unmount
- **WHEN** component unmounts before next render
- **THEN** widget cleanup runs and removes widget from deck
