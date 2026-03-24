# type-safety-testing Specification

## Purpose

TBD - created by archiving change comprehensive-testing-strategy. Update Purpose after archive.

## Requirements

### Requirement: JSX elements type-check correctly

The test suite SHALL validate that JSX layer elements type-check with correct TypeScript types using expectTypeOf.

#### Scenario: Layer element accepts Layer instance

- **WHEN** creating element with `createElement('layer', { layer: new ScatterplotLayer(...) })`
- **THEN** expectTypeOf verifies element is ReactElement type

#### Scenario: Invalid element types rejected

- **WHEN** attempting to create element with unknown element type
- **THEN** TypeScript compilation fails with @ts-expect-error annotation

### Requirement: DeckglProps type correctly

The test suite SHALL validate that DeckglProps accept correct Deck.gl configuration properties.

#### Scenario: DeckglProps accepts view state

- **WHEN** type-checking DeckglProps with initialViewState property
- **THEN** expectTypeOf verifies initialViewState matches ViewState type

#### Scenario: DeckglProps accepts layers array

- **WHEN** type-checking DeckglProps with layers property
- **THEN** expectTypeOf verifies layers matches Layer[] type

#### Scenario: DeckglProps accepts views array

- **WHEN** type-checking DeckglProps with views property
- **THEN** expectTypeOf verifies views matches View[] type

#### Scenario: DeckglProps accepts children

- **WHEN** type-checking DeckglProps with children property
- **THEN** expectTypeOf verifies children matches ReactNode type

### Requirement: Layer props preserve generics

The test suite SHALL validate that layer constructors preserve TypeScript generic types.

#### Scenario: ScatterplotLayer preserves data type

- **WHEN** creating ScatterplotLayer with typed data array
- **THEN** expectTypeOf verifies layer.props.data maintains correct generic type

### Requirement: React version compatibility types

The test suite SHALL validate that types work across React 18.x and 19.x.

#### Scenario: ReactElement type compatible

- **WHEN** importing ReactElement from react
- **THEN** layer elements type-check against ReactElement

#### Scenario: ReactNode type compatible

- **WHEN** using ReactNode for children props
- **THEN** types compile without errors across React versions
