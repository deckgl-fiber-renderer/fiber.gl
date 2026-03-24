import { MapView } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import type { ReactNode } from 'react';
import { describe, expectTypeOf, it } from 'vitest';

import type { DeckglProps } from '../react';

describe('Props Type Tests', () => {
  it('should DeckglProps accepts initialViewState', () => {
    // Arrange
    const props: DeckglProps = {
      initialViewState: {
        latitude: 0,
        longitude: 0,
        zoom: 1,
      },
    };

    // Assert
    expectTypeOf(props.initialViewState).toEqualTypeOf<
      { longitude: number; latitude: number; zoom: number } | undefined
    >();
  });

  it('should DeckglProps accepts layers array', () => {
    // Arrange
    const layer = new ScatterplotLayer({ data: [], id: 'test' });
    const props: DeckglProps = {
      layers: [layer],
    };

    // Assert
    expectTypeOf(props.layers).toEqualTypeOf<unknown[] | undefined>();
  });

  it('should DeckglProps accepts views array', () => {
    // Arrange
    const view = new MapView({ id: 'map' });
    const props: DeckglProps = {
      views: [view],
    };

    // Assert
    expectTypeOf(props.views).toEqualTypeOf<unknown[] | undefined>();
  });

  it('should DeckglProps accepts children (ReactNode)', () => {
    // Arrange
    const props: DeckglProps = {
      children: 'test',
    };

    // Assert
    expectTypeOf(props.children).toEqualTypeOf<ReactNode | undefined>();
  });

  it('should ScatterplotLayer preserves data generic type', () => {
    // Arrange
    interface DataPoint {
      x: number;
      y: number;
      value: number;
    }
    const data: DataPoint[] = [
      { value: 1, x: 0, y: 0 },
      { value: 2, x: 1, y: 1 },
    ];

    const layer = new ScatterplotLayer<DataPoint>({
      data,
      getPosition: (d) => [d.x, d.y],
      id: 'typed',
    });

    // Assert - TypeScript should preserve the generic type
    expectTypeOf(layer.props.data).toEqualTypeOf<DataPoint[]>();
    expectTypeOf(layer.props.getPosition).toEqualTypeOf<
      ((d: DataPoint) => number[]) | undefined
    >();
  });

  it('should ReactElement type compatible across React versions', () => {
    // This test ensures our types work with both React 18 and 19
    // ReactElement should be compatible regardless of React version
    const element: React.ReactElement = {
      key: null,
      props: {},
      type: 'div',
    };

    expectTypeOf(element).toHaveProperty('type');
    expectTypeOf(element).toHaveProperty('props');
    expectTypeOf(element).toHaveProperty('key');
  });

  it('should ReactNode type compatible across React versions', () => {
    // Test that ReactNode accepts various types across React versions
    const stringNode: ReactNode = 'text';
    const numberNode: ReactNode = 123;
    const booleanNode: ReactNode = true;
    const nullNode: ReactNode = null;
    const undefinedNode: ReactNode = undefined;

    expectTypeOf(stringNode).toEqualTypeOf<ReactNode>();
    expectTypeOf(numberNode).toEqualTypeOf<ReactNode>();
    expectTypeOf(booleanNode).toEqualTypeOf<ReactNode>();
    expectTypeOf(nullNode).toEqualTypeOf<ReactNode>();
    expectTypeOf(undefinedNode).toEqualTypeOf<ReactNode>();
  });
});
