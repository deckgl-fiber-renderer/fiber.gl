import { CompositeLayer, type DefaultProps } from '@deck.gl/core';
import { ScatterplotLayer, type ScatterplotLayerProps } from '@deck.gl/layers';

export type CustomLayerProps = ScatterplotLayerProps & {
  scaler: number;
};

export class CustomLayer extends CompositeLayer<CustomLayerProps> {
  static layerName = 'CustomLayer';
  static defaultProps: DefaultProps<CustomLayerProps> = {
    scaler: 1.0,
  };

  renderLayers() {
    const props = this.props;

    return [
      new ScatterplotLayer(
        this.getSubLayerProps({
          ...props,
          id: 'scaled',
          data: props.data,
          radiusScale: props.scaler,
          opacity: 0.25,
        }),
      ),
      new ScatterplotLayer(
        this.getSubLayerProps({
          ...props,
          data: props.data,
          id: 'not-scaled',
        }),
      ),
    ];
  }
}

// Make TypeScript & React aware of this custom JSX element
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        customLayer: CustomLayerProps;
      }
    }
  }
}
