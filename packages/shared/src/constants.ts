/**
 * Reference to the global scope object (window in browsers, self in workers)
 *
 * Provides cross-environment access to the global object using the same
 * pattern as React's internal implementation. Prioritizes `self` over
 * `window` to support Web Workers.
 *
 * NOTE: vendored from React
 *
 * @example
 * ```typescript
 * import { globalScope } from '@deckgl-fiber/shared';
 *
 * // Access global APIs safely
 * if (globalScope?.document) {
 *   // Browser-specific code
 * }
 * ```
 */
export const globalScope =
  (typeof self !== "undefined" && self) || (typeof window !== "undefined" && window);
