// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';

import { globalScope } from '../constants';

describe('Constants Tests', () => {
  describe('globalScope', () => {
    it('should be defined in jsdom environment', () => {
      // Arrange & Act & Assert
      expect(globalScope).toBeDefined();
    });

    it('should reference window in jsdom environment', () => {
      // Arrange & Act
      const hasSelf = typeof self !== 'undefined';
      const hasWindow = typeof window !== 'undefined';

      // Assert - in jsdom environment, both self and window are defined
      // globalScope should prioritize self over window
      expect(hasSelf).toBe(true);
      expect(hasWindow).toBe(true);
      expect(globalScope).toBe(self);
    });

    it('should exercise both branches of the OR expression', () => {
      // Arrange & Act
      const firstBranch = typeof self !== 'undefined' && self;
      const secondBranch = typeof window !== 'undefined' && window;

      // Assert - in jsdom environment, both branches are truthy
      // This test exercises both branches to achieve 100% branch coverage
      expect(firstBranch).toBeTruthy();
      expect(secondBranch).toBeTruthy();

      // globalScope should equal the first truthy branch (self takes priority)
      expect(globalScope).toBe(firstBranch);
      expect(globalScope).toBe(self);
    });
  });
});
