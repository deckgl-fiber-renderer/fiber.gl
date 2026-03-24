import { create } from 'zustand';

export const useStore = create((set) => ({
  index: -1,
  setIndex: (i: number) =>
    set((state) => {
      if (state.index === i) {
        return state;
      }

      return { index: i };
    }),
}));

export const selectors = {
  index: (state) => state.index,
  setIndex: (state) => state.setIndex,
};
