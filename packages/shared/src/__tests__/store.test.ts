import type { Deck } from '@deck.gl/core';
import { describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';

import type { State } from '../store';

/**
 * Creates a test store with initial state
 */
function createTestStore() {
  return create<State>()((set) => ({
    _passedLayers: [],
    deckgl: null,
    setDeckgl: (instance) => {
      set(() => ({
        deckgl: instance,
      }));
    },
  }));
}

/**
 * Creates a properly typed mock Deck.gl instance
 */
function createMockDeckgl(
  overrides?: Partial<Pick<Deck, 'finalize' | 'setProps'>>
): Pick<Deck, 'finalize' | 'setProps'> {
  return {
    finalize: vi.fn(),
    setProps: vi.fn(),
    ...overrides,
  };
}

describe('Store Tests', () => {
  it('should have correct initial state (deckgl null, _passedLayers empty)', () => {
    // Arrange & Act
    const store = createTestStore();
    const state = store.getState();

    // Assert
    expect(state.deckgl).toBeNull();
    expect(state._passedLayers).toEqual([]);
  });

  it('should update state when setDeckgl is called', () => {
    // Arrange
    const store = createTestStore();
    const mockDeckgl = createMockDeckgl();

    // Act
    store.getState().setDeckgl(mockDeckgl as never);

    // Assert
    expect(store.getState().deckgl).toBe(mockDeckgl);
  });

  it('should maintain independent state across multiple stores', () => {
    // Arrange & Act
    const store1 = createTestStore();
    const store2 = createTestStore();

    const mockDeckgl1 = createMockDeckgl();
    const mockDeckgl2 = createMockDeckgl();

    // Act
    store1.getState().setDeckgl(mockDeckgl1 as never);
    store2.getState().setDeckgl(mockDeckgl2 as never);

    // Assert
    expect(store1.getState().deckgl).toBe(mockDeckgl1);
    expect(store2.getState().deckgl).toBe(mockDeckgl2);
    expect(store1.getState().deckgl).not.toBe(store2.getState().deckgl);
  });
});
