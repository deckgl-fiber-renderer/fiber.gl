import { type StoreApi, create } from 'zustand';
import type { Deck } from '@deck.gl/core';
import type { LayersList } from '@deck.gl/core';
import type { MapboxOverlay } from '@deck.gl/mapbox';

export type State = {
  deckgl: Deck | MapboxOverlay;
  setDeckgl: (instance: Deck | MapboxOverlay) => void;

  _passedLayers: LayersList;
};

export type Store = StoreApi<State>;

export const useStore = create<State>()((set) => ({
  deckgl: undefined!,
  setDeckgl: (instance) => {
    set(() => ({
      deckgl: instance,
    }));
  },

  // NOTE: we want to support a "mix-mode" of sorts where a user can pass an explicit `layers` prop alongside
  // traditional usage of creating layers as JSX children.
  _passedLayers: [],
}));

export const selectors = {
  deckgl: (s) => s.deckgl,
  setDeckgl: (s) => s.setDeckgl,
} satisfies Record<string, (state: State) => State[keyof State]>;
