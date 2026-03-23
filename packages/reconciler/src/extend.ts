import type { Instance } from "./types";

export interface Catalogue {
  [name: string]: {
    new (...args: unknown[]): Instance["node"];
  };
}

export const catalogue: Catalogue = {};

export function extend(objects: object) {
  Object.assign(catalogue, objects);
}
