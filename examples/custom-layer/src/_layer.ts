import { CompositeLayer } from '@deck.gl/core';
import type { DefaultProps } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import type { ScatterplotLayerProps } from '@deck.gl/layers';

export type CustomLayerProps = ScatterplotLayerProps & {
  scaler: number;
};

export class CustomLayer extends CompositeLayer<CustomLayerProps> {
  static layerName = "CustomLayer";
  static defaultProps: DefaultProps<CustomLayerProps> = {
    scaler: 1,
  };

  renderLayers() {
    const {props} = this;

    return [
      new ScatterplotLayer(
        this.getSubLayerProps({
          ...props,
          data: props.data,
          id: "scaled",
          opacity: 0.25,
          radiusScale: props.scaler,
        })
      ),
      new ScatterplotLayer(
        this.getSubLayerProps({
          ...props,
          data: props.data,
          id: "not-scaled",
        })
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
