import fc from 'fast-check';
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
    // Property-based tests
    it('property: idempotent for non-empty strings', () => {
      fc.assert(
        fc.property(fc.string({ maxLength: 100, minLength: 1 }), (str) => {
          expect(toPascal(toPascal(str))).toBe(toPascal(str));
        })
      );
    });

    it('property: first character always uppercase for non-empty strings', () => {
      fc.assert(
        fc.property(fc.string({ maxLength: 100, minLength: 1 }), (str) => {
          const result = toPascal(str);
          if (result.length > 0) {
            expect(result[0]).toBe(result[0].toUpperCase());
          }
        })
      );
    });

    it('property: preserves length', () => {
      fc.assert(
        fc.property(fc.string({ maxLength: 100 }), (str) => {
          expect(toPascal(str)).toHaveLength(str.length);
        })
      );
    });

    // Example-based tests for specific cases
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
      { description: 'single character', expected: 'A', input: 'a' },
      {
        description: 'starts with number',
        expected: '123abc',
        input: '123abc',
      },
      { description: 'Unicode character', expected: 'Über', input: 'über' },
      {
        description: 'starts with whitespace',
        expected: ' hello',
        input: ' hello',
      },
      { description: 'special characters', expected: '_test', input: '_test' },
    ])('should return "$expected" for $description', ({ input, expected }) => {
      expect(toPascal(input)).toBe(expected);
    });
  });

  describe('noop', () => {
    it('should return undefined when called', () => {
      const result = noop();

      expect(result).toBeUndefined();
    });

    it('should be callable without throwing errors', () => {
      expect(() => noop()).not.toThrow();
    });

    it('should be usable as a default callback', () => {
      const callback = noop;

      expect(callback()).toBeUndefined();
    });
  });

  describe('isBrowserEnvironment', () => {
    it('should be a boolean value', () => {
      expect(typeof isBrowserEnvironment).toBe('boolean');
    });

    it('should be false in Node.js test environment', () => {
      // vitest.config.ts uses environment: 'node', so no document exists
      expect(isBrowserEnvironment).toBe(false);
    });
  });
});
