## ADDED Requirements

### Requirement: Preserve layer IDs across reconciliation

The test suite SHALL validate that layer IDs remain stable during reconciliation, which is critical for Deck.gl's diffing algorithm.

#### Scenario: Layer ID preserved on creation

- **WHEN** creating instance with ScatterplotLayer having id='my-unique-id'
- **THEN** instance.node.id equals 'my-unique-id'

#### Scenario: Layer ID preserved through updates

- **WHEN** updating a layer with same ID but different props
- **THEN** new instance maintains same layer ID

### Requirement: Handle View to Layer parent-child relationships

The test suite SHALL validate that host context correctly tracks View nesting for validation and organization.

#### Scenario: View sets child host context

- **WHEN** calling getChildHostContext with MapView as parent
- **THEN** returned childContext.view references the MapView instance

#### Scenario: Layer inherits parent View context

- **WHEN** creating layer under View parent in host context
- **THEN** layer receives View context for validation

### Requirement: Organize layers and views separately

The test suite SHALL validate that `organizeList` separates views and layers into correct arrays.

#### Scenario: Mixed list organized correctly

- **WHEN** calling organizeList with [Layer, View, Layer]
- **THEN** result.views contains 1 View and result.layers contains 2 Layers

#### Scenario: All layers list has no views

- **WHEN** calling organizeList with only Layer instances
- **THEN** result.views is empty and result.layers contains all instances

### Requirement: Flatten nested layer arrays

The test suite SHALL validate that `flattenTree` recursively flattens nested layer hierarchies.

#### Scenario: Flatten three-level hierarchy

- **WHEN** calling flattenTree with layer1 containing layer2 containing layer3
- **THEN** flattened array contains all 3 layers in depth-first order

#### Scenario: Flatten handles empty children

- **WHEN** calling flattenTree with layers having no children
- **THEN** flattened array contains only parent layers
