import { DefaultEventPriority } from 'react-reconciler/constants';
import { describe, expect, it } from 'vitest';

import { getCurrentEventPriority } from '../config';

describe('event priority', () => {
  describe('getCurrentEventPriority', () => {
    it('returns DefaultEventPriority in Node.js environment', () => {
      // This test documents the Node.js behavior where getCurrentEventPriority
      // returns DefaultEventPriority because window/self are not available.
      //
      // Browser event priority detection (discrete vs continuous events) is
      // tested manually through integration tests in a browser environment.
      // The event priority logic detects:
      // - DiscreteEventPriority: click, keydown, keyup, focusin, focusout
      // - ContinuousEventPriority: pointermove, touchmove, drag, scroll
      // - DefaultEventPriority: fallback for unknown events
      expect(getCurrentEventPriority()).toBe(DefaultEventPriority);
    });
  });
});
