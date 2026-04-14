import { CompositeLayer } from "@deck.gl/core";
import type { DefaultProps } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import type { ScatterplotLayerProps } from "@deck.gl/layers";

export type CustomLayerProps = ScatterplotLayerProps & {
  scaler: number;
};

/**
 * Custom layer example demonstrating the new v2 API.
 *
 * With the new <layer> element pattern:
 * - No need to register via extend()
 * - No need to declare JSX.IntrinsicElements
 * - Just create instances directly: <layer layer={new CustomLayer({...})} />
 * - Full TypeScript generic support automatically
 */
export class CustomLayer extends CompositeLayer<CustomLayerProps> {
  static layerName = "CustomLayer";
  static defaultProps: DefaultProps<CustomLayerProps> = {
    scaler: 1,
  };

  renderLayers() {
    const { props } = this;

    return [
      new ScatterplotLayer(
        this.getSubLayerProps({
          ...props,
          data: props.data,
          id: "scaled",
          opacity: 0.25,
          radiusScale: props.scaler,
        }),
      ),
      new ScatterplotLayer(
        this.getSubLayerProps({
          ...props,
          data: props.data,
          id: "not-scaled",
        }),
      ),
    ];
  }
}
