import type { Instance } from './types';

export type Catalogue = Record<
  string,
  {
    new (...args: unknown[]): Instance['node'];
  }
>;

export const catalogue: Catalogue = {};

/**
 * @deprecated This function is deprecated and will be removed in v3.
 *
 * Manual layer registration is no longer needed with the new <layer> element.
 * Instead of using extend(), directly import and instantiate layers:
 *
 * ```tsx
 * import { ScatterplotLayer } from '@deck.gl/layers';
 * import { MyCustomLayer } from './my-custom-layer';
 *
 * <layer layer={new ScatterplotLayer({ id: 'points', data })} />
 * <layer layer={new MyCustomLayer({ id: 'custom' })} />
 * ```
 *
 * This provides better type safety, enables code-splitting, and works with
 * both built-in and custom layers without registration.
 */
export function extend(objects: object) {
  Object.assign(catalogue, objects);
}
