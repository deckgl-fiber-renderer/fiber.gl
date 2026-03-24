## ADDED Requirements

### Requirement: Clone instances create new objects

The test suite SHALL validate that `cloneInstance` creates new layer instances rather than mutating existing ones, adhering to persistence mode semantics.

#### Scenario: Cloned instance is new object

- **WHEN** calling cloneInstance with updated props
- **THEN** returned instance is not referentially equal to original (instance.node !== original.node)

#### Scenario: Cloned instance has updated props

- **WHEN** cloning instance with radiusScale changed from 1 to 2
- **THEN** cloned instance.node.props.radiusScale equals 2

### Requirement: Build ChildSet atomically

The test suite SHALL validate that ChildSet operations build layer trees atomically before committing to container.

#### Scenario: Create empty ChildSet

- **WHEN** calling createContainerChildSet()
- **THEN** returns empty array

#### Scenario: Append children to ChildSet

- **WHEN** calling appendChildToContainerChildSet multiple times with different layers
- **THEN** ChildSet contains all appended instances in order

### Requirement: Replace container children atomically

The test suite SHALL validate that `replaceContainerChildren` replaces entire tree atomically, not incrementally.

#### Scenario: Replace with new layer set

- **WHEN** calling replaceContainerChildren with ChildSet containing new layers
- **THEN** container.layers is replaced with new layer array

#### Scenario: Replace with empty set clears container

- **WHEN** calling replaceContainerChildren with empty ChildSet
- **THEN** container.layers becomes empty array
