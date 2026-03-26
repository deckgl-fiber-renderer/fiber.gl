import {
  ContinuousEventPriority,
  DefaultEventPriority,
  DiscreteEventPriority,
} from 'react-reconciler/constants';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  getCurrentEventPriority,
  getCurrentUpdatePriority,
  resolveUpdatePriority,
  setCurrentUpdatePriority,
} from '../config';

describe('event priority', () => {
  // Store original window.event
  let originalEvent: Event | undefined;

  beforeEach(() => {
    originalEvent = window.event;
  });

  afterEach(() => {
    // Restore original window.event
    // @ts-expect-error - window.event is writable for testing
    window.event = originalEvent;
  });

  describe('getCurrentEventPriority', () => {
    it('should return DiscreteEventPriority for click events', () => {
      // Simulate a click event
      const clickEvent = new MouseEvent('click');
      // @ts-expect-error - window.event is writable for testing
      window.event = clickEvent;

      expect(getCurrentEventPriority()).toBe(DiscreteEventPriority);
    });

    it('should return DiscreteEventPriority for keyboard events', () => {
      // Test keydown
      const keydownEvent = new KeyboardEvent('keydown');
      // @ts-expect-error - window.event is writable for testing
      window.event = keydownEvent;
      expect(getCurrentEventPriority()).toBe(DiscreteEventPriority);

      // Test keyup
      const keyupEvent = new KeyboardEvent('keyup');
      // @ts-expect-error - window.event is writable for testing
      window.event = keyupEvent;
      expect(getCurrentEventPriority()).toBe(DiscreteEventPriority);
    });

    it('should return DiscreteEventPriority for focus events', () => {
      // Test focusin
      const focusinEvent = new FocusEvent('focusin');
      // @ts-expect-error - window.event is writable for testing
      window.event = focusinEvent;
      expect(getCurrentEventPriority()).toBe(DiscreteEventPriority);

      // Test focusout
      const focusoutEvent = new FocusEvent('focusout');
      // @ts-expect-error - window.event is writable for testing
      window.event = focusoutEvent;
      expect(getCurrentEventPriority()).toBe(DiscreteEventPriority);
    });

    it('should return ContinuousEventPriority for pointermove events', () => {
      const pointermoveEvent = new PointerEvent('pointermove');
      // @ts-expect-error - window.event is writable for testing
      window.event = pointermoveEvent;

      expect(getCurrentEventPriority()).toBe(ContinuousEventPriority);
    });

    it('should return ContinuousEventPriority for scroll events', () => {
      const scrollEvent = new Event('scroll');
      // @ts-expect-error - window.event is writable for testing
      window.event = scrollEvent;

      expect(getCurrentEventPriority()).toBe(ContinuousEventPriority);
    });

    it('should return ContinuousEventPriority for drag events', () => {
      // Use generic Event for jsdom compatibility
      const dragEvent = new Event('drag');
      // @ts-expect-error - window.event is writable for testing
      window.event = dragEvent;

      expect(getCurrentEventPriority()).toBe(ContinuousEventPriority);
    });

    it('should return ContinuousEventPriority for wheel events', () => {
      const wheelEvent = new WheelEvent('wheel');
      // @ts-expect-error - window.event is writable for testing
      window.event = wheelEvent;

      expect(getCurrentEventPriority()).toBe(ContinuousEventPriority);
    });

    it('should return DefaultEventPriority for unknown events', () => {
      const customEvent = new Event('customevent');
      // @ts-expect-error - window.event is writable for testing
      window.event = customEvent;

      expect(getCurrentEventPriority()).toBe(DefaultEventPriority);
    });

    it('should return DefaultEventPriority when no event is active', () => {
      // @ts-expect-error - window.event is writable for testing
      window.event = undefined;

      expect(getCurrentEventPriority()).toBe(DefaultEventPriority);
    });
  });

  describe('update priority management', () => {
    describe('setCurrentUpdatePriority / getCurrentUpdatePriority', () => {
      it('should set and retrieve update priority', () => {
        setCurrentUpdatePriority(DiscreteEventPriority);
        expect(getCurrentUpdatePriority()).toBe(DiscreteEventPriority);

        setCurrentUpdatePriority(ContinuousEventPriority);
        expect(getCurrentUpdatePriority()).toBe(ContinuousEventPriority);
      });
    });

    describe('resolveUpdatePriority', () => {
      it('should return currentUpdatePriority when set to non-default value', () => {
        // Set update priority to DiscreteEventPriority
        setCurrentUpdatePriority(DiscreteEventPriority);

        // Should return the explicitly set update priority
        expect(resolveUpdatePriority()).toBe(DiscreteEventPriority);
      });

      it('should return DefaultEventPriority when update priority is default', () => {
        // Reset update priority to default
        setCurrentUpdatePriority(DefaultEventPriority);

        // Should fall back to currentEventPriority constant (which is DefaultEventPriority)
        expect(resolveUpdatePriority()).toBe(DefaultEventPriority);
      });
    });
  });
});
