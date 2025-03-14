import { MapView, type Layer } from '@deck.gl/core';
import type { Instance } from './types';

export function isView(instance: Instance['node']) {
  return instance instanceof MapView;
}

export function flattenTree(arr: Instance[]): Instance['node'][] {
  return arr.flatMap((val) => {
    if (val.children.length > 0) {
      return [val.node, ...flattenTree(val.children)];
    }

    return val.node;
  });
}

export function organizeList(list: Instance['node'][]) {
  // NOTE: views array is challenging to type, deferring to unknown for now
  return list.reduce<{ views: unknown[]; layers: Layer[] }>(
    (acc, curr) => {
      isView(curr)
        ? acc.views.push(curr as unknown)
        : acc.layers.push(curr as Layer);

      return acc;
    },
    { views: [], layers: [] },
  );
}
