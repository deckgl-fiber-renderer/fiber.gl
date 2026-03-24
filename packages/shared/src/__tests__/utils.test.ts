import { describe, expect, it } from 'vitest';

import { isDefined, isFn, toPascal, isBrowserEnvironment } from '../utils';

describe('Utility Functions Tests', () => {
  describe('isDefined', () => {
    it('should isDefined returns false for undefined', () => {
      // Act
      const result = isDefined();

      // Assert
      expect(result).toBe(false);
    });

    it('should isDefined returns true for null', () => {
      // Act
      const result = isDefined(null);

      // Assert
      expect(result).toBe(true);
    });

    it('should isDefined returns true for falsy values (0, "", false)', () => {
      // Act & Assert
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
    });
  });

  describe('isFn', () => {
    it('should isFn returns true for functions', () => {
      // Arrange
      const func = () => {};
      const arrowFunc = () => {};
      // biome-ignore lint/complexity/useArrowFunction: testing function declaration
      function namedFunc() {}

      // Act & Assert
      expect(isFn(func)).toBe(true);
      expect(isFn(arrowFunc)).toBe(true);
      expect(isFn(namedFunc)).toBe(true);
    });

    it('should isFn returns false for non-functions', () => {
      // Act & Assert
      expect(isFn(123)).toBe(false);
      expect(isFn('string')).toBe(false);
      expect(isFn({})).toBe(false);
      expect(isFn([])).toBe(false);
      expect(isFn(null)).toBe(false);
      expect(isFn()).toBe(false);
    });
  });

  describe('toPascal', () => {
    it('should toPascal capitalizes first letter', () => {
      // Act
      const result = toPascal('hello');

      // Assert
      expect(result).toBe('Hello');
    });

    it('should toPascal handles empty string', () => {
      // Act
      const result = toPascal('');

      // Assert
      expect(result).toBe('');
    });

    it('should toPascal preserves rest of string', () => {
      // Act
      const result = toPascal('helloWorld');

      // Assert
      expect(result).toBe('HelloWorld');
    });
  });

  describe('isBrowserEnvironment', () => {
    it('should isBrowserEnvironment returns false in Node test environment', () => {
      // Assert - in Node.js/vitest environment, should be false
      expect(isBrowserEnvironment).toBe(false);
    });
  });
});
