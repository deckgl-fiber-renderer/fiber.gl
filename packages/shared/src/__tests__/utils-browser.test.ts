// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';

import { globalScope } from '../constants';
import { isBrowserEnvironment } from '../utils';

describe('Utility Functions Tests (Browser Environment)', () => {
  describe('isBrowserEnvironment', () => {
    it('should be true in jsdom environment (has window and document)', () => {
      // Arrange & Act & Assert
      // In jsdom environment, both window and document exist
      expect(globalScope).toBeTruthy();
      expect(globalScope).toHaveProperty('document');
      expect(isBrowserEnvironment).toBe(true);
    });
  });
});
