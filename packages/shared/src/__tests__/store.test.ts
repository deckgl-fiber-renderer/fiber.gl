import { describe, expect, it, vi } from "vitest";
import { create } from "zustand";

import type { State } from "../store";
import { selectors } from "../store";

describe("Store Tests", () => {
  it("should initial state is correct (deckgl undefined, _passedLayers empty)", () => {
    // Arrange & Act
    const store = create<State>()((set) => ({
      _passedLayers: [],
      deckgl: undefined!,
      setDeckgl: (instance) => {
        set(() => ({
          deckgl: instance,
        }));
      },
    }));

    const state = store.getState();

    // Assert
    expect(state.deckgl).toBeUndefined();
    expect(state._passedLayers).toEqual([]);
  });

  it("should setDeckgl updates state", () => {
    // Arrange
    const store = create<State>()((set) => ({
      _passedLayers: [],
      deckgl: undefined!,
      setDeckgl: (instance) => {
        set(() => ({
          deckgl: instance,
        }));
      },
    }));

    const mockDeckgl = { finalize: vi.fn(), setProps: vi.fn() } as never;

    // Act
    store.getState().setDeckgl(mockDeckgl);

    // Assert
    expect(store.getState().deckgl).toBe(mockDeckgl);
  });

  it("should selectors.deckgl returns correct value", () => {
    // Arrange
    const mockDeckgl = { finalize: vi.fn(), setProps: vi.fn() } as never;
    const state: State = {
      _passedLayers: [],
      deckgl: mockDeckgl,
      setDeckgl: vi.fn(),
    };

    // Act
    const result = selectors.deckgl(state);

    // Assert
    expect(result).toBe(mockDeckgl);
  });

  it("should selectors.setDeckgl returns correct value", () => {
    // Arrange
    const setDeckglFn = vi.fn();
    const state: State = {
      _passedLayers: [],
      deckgl: undefined!,
      setDeckgl: setDeckglFn,
    };

    // Act
    const result = selectors.setDeckgl(state);

    // Assert
    expect(result).toBe(setDeckglFn);
  });

  it("should store can be created multiple times with independent state", () => {
    // Arrange & Act
    const store1 = create<State>()((set) => ({
      _passedLayers: [],
      deckgl: undefined!,
      setDeckgl: (instance) => {
        set(() => ({
          deckgl: instance,
        }));
      },
    }));

    const store2 = create<State>()((set) => ({
      _passedLayers: [],
      deckgl: undefined!,
      setDeckgl: (instance) => {
        set(() => ({
          deckgl: instance,
        }));
      },
    }));

    const mockDeckgl1 = {
      finalize: vi.fn(),
      id: "deck1",
      setProps: vi.fn(),
    } as never;
    const mockDeckgl2 = {
      finalize: vi.fn(),
      id: "deck2",
      setProps: vi.fn(),
    } as never;

    // Act
    store1.getState().setDeckgl(mockDeckgl1);
    store2.getState().setDeckgl(mockDeckgl2);

    // Assert
    expect(store1.getState().deckgl).toBe(mockDeckgl1);
    expect(store2.getState().deckgl).toBe(mockDeckgl2);
    expect(store1.getState().deckgl).not.toBe(store2.getState().deckgl);
  });
});
