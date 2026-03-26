import { describe, expect, it } from 'vitest';

import {
  isDefined,
  isFn,
  isBrowserEnvironment,
  noop,
  toPascal,
} from '../utils';

describe('Utility Functions Tests', () => {
  describe('isDefined', () => {
    it.each([
      { description: 'undefined', expected: false, value: undefined },
      { description: 'null', expected: true, value: null },
      { description: '0', expected: true, value: 0 },
      { description: 'empty string', expected: true, value: '' },
      { description: 'false', expected: true, value: false },
    ])('should return $expected for $description', ({ value, expected }) => {
      expect(isDefined(value)).toBe(expected);
    });
  });

  describe('isFn', () => {
    it.each([
      { description: 'arrow function', value: () => {} },
      {
        // biome-ignore lint/complexity/useArrowFunction: testing function declaration
        description: 'function expression',
        value: function value() {},
      },
      {
        // biome-ignore lint/complexity/useArrowFunction: testing function declaration
        description: 'named function',
        value: function named() {},
      },
      { description: 'built-in function', value: Math.max },
    ])('should return true for $description', ({ value }) => {
      expect(isFn(value)).toBe(true);
    });

    it.each([
      { description: 'number', value: 123 },
      { description: 'string', value: 'string' },
      { description: 'object', value: {} },
      { description: 'array', value: [] },
      { description: 'null', value: null },
      { description: 'undefined', value: undefined },
    ])('should return false for $description', ({ value }) => {
      expect(isFn(value)).toBe(false);
    });
  });

  describe('toPascal', () => {
    it.each([
      { description: 'lowercase word', expected: 'Hello', input: 'hello' },
      {
        description: 'camelCase',
        expected: 'HelloWorld',
        input: 'helloWorld',
      },
      { description: 'empty string', expected: '', input: '' },
      {
        description: 'already capitalized',
        expected: 'Already',
        input: 'Already',
      },
    ])('should return "$expected" for $description', ({ input, expected }) => {
      expect(toPascal(input)).toBe(expected);
    });
  });

  describe('noop', () => {
    it('should return undefined when called', () => {
      // Arrange & Act
      const result = noop();

      // Assert
      expect(result).toBeUndefined();
    });

    it('should be callable without throwing errors', () => {
      // Arrange & Act & Assert
      expect(() => noop()).not.toThrow();
    });

    it('should be usable as a default callback', () => {
      // Arrange
      const callback = noop;

      // Act & Assert - should be safe to call
      expect(() => callback()).not.toThrow();
      expect(callback()).toBeUndefined();
    });
  });

  describe('isBrowserEnvironment', () => {
    it('should be a boolean value', () => {
      // Arrange & Act & Assert
      expect(typeof isBrowserEnvironment).toBe('boolean');
    });

    it('should be false in Node.js test environment', () => {
      // Arrange & Act & Assert
      // vitest.config.ts uses environment: 'node', so no document exists
      expect(isBrowserEnvironment).toBe(false);
    });
  });
});
