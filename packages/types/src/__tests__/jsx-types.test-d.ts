import type { Layer } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { createElement } from 'react';
import type { ReactElement } from 'react';
import { describe, expectTypeOf, it } from 'vitest';

describe('JSX Type Tests', () => {
  it('should layer element accepts Layer instance', () => {
    // Arrange
    const layer = new ScatterplotLayer({ data: [], id: 'test' });

    // Act
    const element = createElement('layer', { layer });

    // Assert
    expectTypeOf(element).toEqualTypeOf<ReactElement>();
    expectTypeOf(element.props.layer).toEqualTypeOf<Layer>();
  });

  it('should invalid element types rejected (@ts-expect-error)', () => {
    // @ts-expect-error - number is not a valid layer type
    createElement('layer', { layer: 123 });

    // @ts-expect-error - string is not a valid layer type
    createElement('layer', { layer: 'not-a-layer' });

    // @ts-expect-error - missing layer prop
    createElement('layer', {});
  });
});
