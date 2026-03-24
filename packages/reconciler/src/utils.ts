import { View } from '@deck.gl/core';
import type { Layer } from '@deck.gl/core';

import type { Instance } from './types';

export function isView(instance: Instance['node']): instance is View {
  return instance instanceof View;
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
  return list.reduce<{ views: View[]; layers: Layer[] }>(
    (acc, curr) => {
      isView(curr)
        ? acc.views.push(curr as View)
        : acc.layers.push(curr as Layer);

      return acc;
    },
    { layers: [], views: [] }
  );
}
