## ADDED Requirements

### Requirement: Stable layer ID requirement

Documentation SHALL clearly state that every layer instance MUST have an explicit `id` prop for proper React lifecycle integration with Deck.gl's diffing algorithm.

#### Scenario: Documentation explains ID requirement

- **WHEN** user reads the React integration guide
- **THEN** it SHALL explain that missing IDs cause layer reinitialization on every render

#### Scenario: Runtime warning for missing ID

- **WHEN** a layer without an explicit `id` is rendered
- **THEN** the system SHALL log a warning: "Layer missing explicit 'id' prop - this will cause expensive reinitialization on every render"

#### Scenario: ID requirement in migration guide

- **WHEN** user reads the migration guide
- **THEN** it SHALL show examples with explicit IDs and call out the requirement

### Requirement: Layer instance creation pattern

Documentation SHALL explain that creating new layer instances on every React render is the expected and recommended pattern.

#### Scenario: Inline layer creation documented

- **WHEN** user reads the React patterns guide
- **THEN** it SHALL show `<layer layer={new ScatterplotLayer({ id: 'points', data })} />` as the correct pattern

#### Scenario: No memoization needed

- **WHEN** documentation discusses performance
- **THEN** it SHALL state that layer instances are cheap to create and do not need useMemo

#### Scenario: Deck.gl matching explained

- **WHEN** documentation explains lifecycle
- **THEN** it SHALL explain that Deck.gl matches layers by ID and diffs props internally

### Requirement: updateTriggers documentation

Documentation SHALL explain when and how to use `updateTriggers` for accessor functions that depend on React state or props.

#### Scenario: Function identity limitation

- **WHEN** user reads accessor function documentation
- **THEN** it SHALL explain that accessor function identity changes do not trigger updates

#### Scenario: updateTriggers example

- **WHEN** user reads updateTriggers documentation
- **THEN** it SHALL show an example with `updateTriggers: { getFillColor: colorScheme }`

#### Scenario: When to use updateTriggers

- **WHEN** documentation shows accessor functions
- **THEN** it SHALL clarify to add updateTriggers when accessor logic depends on changing state/props

### Requirement: Dynamic layer lists pattern

Documentation SHALL show how to properly render dynamic lists of layers using both React `key` and Deck.gl `id`.

#### Scenario: Both keys documented

- **WHEN** user reads dynamic layer documentation
- **THEN** it SHALL show examples with both `key={layer.id}` (React) and `id: layer.id` (Deck.gl)

#### Scenario: Key vs ID distinction

- **WHEN** documentation explains keys
- **THEN** it SHALL clarify that React key is for reconciliation and Deck.gl id is for layer matching

### Requirement: Visibility vs conditional rendering

Documentation SHALL explain the performance trade-offs between using the `visible` prop versus conditionally rendering layers.

#### Scenario: Visible prop for toggling

- **WHEN** documentation discusses showing/hiding layers
- **THEN** it SHALL recommend using `visible` prop for frequent toggling to avoid GPU resource recreation

#### Scenario: Conditional rendering explained

- **WHEN** documentation shows conditional rendering
- **THEN** it SHALL explain that removing a layer destroys GPU buffers and reinitializes when added back

### Requirement: Anti-patterns documented

Documentation SHALL clearly identify and explain common anti-patterns that break proper layer lifecycle.

#### Scenario: Creating layers outside render

- **WHEN** user reads anti-patterns section
- **THEN** it SHALL show that creating layers outside render freezes props at creation time

#### Scenario: Missing IDs in lists

- **WHEN** user reads anti-patterns section
- **THEN** it SHALL show that forgetting IDs in dynamic lists causes expensive recreation

#### Scenario: Over-memoization

- **WHEN** user reads anti-patterns section
- **THEN** it SHALL explain that memoizing layer instances is usually unnecessary
