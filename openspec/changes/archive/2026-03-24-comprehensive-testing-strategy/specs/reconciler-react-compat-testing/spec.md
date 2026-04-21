## ADDED Requirements

### Requirement: Implement persistence mode correctly

The test suite SHALL validate that reconciler declares persistence mode support per react-reconciler API.

#### Scenario: supportsPersistence is true

- **WHEN** checking supportsPersistence constant
- **THEN** value is true

#### Scenario: supportsMutation is false

- **WHEN** checking supportsMutation constant
- **THEN** value is false

### Requirement: Return valid event priorities

The test suite SHALL validate that `getCurrentEventPriority` returns priorities matching react-reconciler/constants.

#### Scenario: Event priority is valid

- **WHEN** calling getCurrentEventPriority()
- **THEN** returned value is one of DiscreteEventPriority, ContinuousEventPriority, or DefaultEventPriority from react-reconciler/constants

### Requirement: Implement all required host config methods

The test suite SHALL validate that all required host config methods are exported and callable.

#### Scenario: Core methods exist

- **WHEN** importing host config module
- **THEN** all methods (createInstance, cloneInstance, createContainerChildSet, etc.) are defined functions

#### Scenario: Persistence methods exist

- **WHEN** importing host config module
- **THEN** persistence-specific methods (cloneInstance, createContainerChildSet, appendChildToContainerChildSet, replaceContainerChildren) are defined

#### Scenario: Suspense methods exist

- **WHEN** importing host config module
- **THEN** suspense methods (cloneHiddenInstance, unhideInstance) are defined

### Requirement: Host config methods have correct signatures

The test suite SHALL validate that host config method signatures match react-reconciler expectations.

#### Scenario: createInstance accepts correct parameters

- **WHEN** calling createInstance with (type, props, rootContainer, hostContext, fiber)
- **THEN** method executes without throwing and returns Instance object

#### Scenario: cloneInstance accepts correct parameters

- **WHEN** calling cloneInstance with required parameters per persistence mode API
- **THEN** method executes and returns new Instance object
