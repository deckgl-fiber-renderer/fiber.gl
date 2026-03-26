import { describe, expect, it } from 'vitest';

import { createMockContainer } from '../__fixtures__/mock-deck-instance';
import { getChildHostContext, getRootHostContext } from '../config';
import type { HostContext } from '../types';

describe('host context', () => {
  describe('getChildHostContext', () => {
    const mockContainer = createMockContainer();
    const rootContext: HostContext = getRootHostContext(mockContainer);

    it('sets insideView flag to true when entering View', () => {
      const childContext = getChildHostContext(rootContext, 'mapView');

      expect(childContext.insideView).toBe(true);
    });

    it('propagates insideView flag to nested children', () => {
      const viewContext = getChildHostContext(rootContext, 'orbitView');
      const nestedContext = getChildHostContext(viewContext, 'layer');

      expect(viewContext.insideView).toBe(true);
      expect(nestedContext.insideView).toBe(true);
    });

    it('remains false for non-View elements', () => {
      const childContext = getChildHostContext(rootContext, 'layer');

      expect(childContext.insideView).toBeUndefined();
    });

    it('detects various View type names', () => {
      const mapViewContext = getChildHostContext(rootContext, 'mapView');
      const orbitViewContext = getChildHostContext(rootContext, 'OrbitView');
      const globeViewContext = getChildHostContext(rootContext, 'globeview');

      expect(mapViewContext.insideView).toBe(true);
      expect(orbitViewContext.insideView).toBe(true);
      expect(globeViewContext.insideView).toBe(true);
    });
  });
});
