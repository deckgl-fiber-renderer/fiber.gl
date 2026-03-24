/**
 * UpdateTriggers Example
 *
 * This demonstrates proper usage of updateTriggers when accessor
 * functions depend on React state or props.
 *
 * Key Concept:
 * Deck.gl doesn't track accessor function identity changes. When your
 * accessor logic depends on changing state/props, you MUST use
 * updateTriggers to tell Deck.gl to recompute the accessor values.
 */

import { ScatterplotLayer } from "@deck.gl/layers";
import { Deckgl } from "@deckgl-fiber-renderer/dom";
import { useState } from "react";

const INITIAL_VIEW_STATE = {
  latitude: 37.7749,
  longitude: -122.4194,
  pitch: 0,
  zoom: 11,
};

interface DataPoint {
  position: [number, number];
  value: number;
}

const SAMPLE_DATA: DataPoint[] = [
  { position: [-122.45, 37.8], value: 10 },
  { position: [-122.42, 37.78], value: 50 },
  { position: [-122.38, 37.76], value: 80 },
  { position: [-122.35, 37.74], value: 30 },
  { position: [-122.32, 37.72], value: 90 },
];

type ColorScheme = "red" | "blue" | "green";

export function UpdateTriggersExample() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("red");
  const [sizeMultiplier, setSizeMultiplier] = useState(1);

  // Accessor function that depends on React state
  const getFillColor = (d: DataPoint) => {
    // Logic depends on colorScheme state - needs updateTriggers!
    switch (colorScheme) {
      case "red": {
        return [d.value * 2.5, 0, 0];
      }
      case "blue": {
        return [0, 0, d.value * 2.5];
      }
      case "green": {
        return [0, d.value * 2.5, 0];
      }
      default: {
        return [255, 255, 255];
      }
    }
  };

  // Accessor function that depends on React state
  const getRadius = (d: DataPoint) => d.value * sizeMultiplier;

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div
        style={{
          background: "white",
          borderRadius: "5px",
          left: 20,
          padding: "10px",
          position: "absolute",
          top: 20,
          zIndex: 1,
        }}
      >
        <div>
          <label>Color Scheme: </label>
          <select
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
          >
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
          </select>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Size Multiplier: {sizeMultiplier}x </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={sizeMultiplier}
            onChange={(e) =>
              setSizeMultiplier(Number.parseFloat(e.target.value))
            }
          />
        </div>
      </div>

      <Deckgl controller initialViewState={INITIAL_VIEW_STATE}>
        <layer
          layer={
            new ScatterplotLayer<DataPoint>({
              id: "interactive-scatter",
              data: SAMPLE_DATA,
              getPosition: (d) => d.position,
              getRadius,
              getFillColor,
              radiusMinPixels: 5,
              radiusMaxPixels: 100,

              // ✅ CRITICAL: Tell Deck.gl to recompute accessor values
              // when these dependencies change
              updateTriggers: {
                getFillColor: colorScheme, // Recompute when colorScheme changes
                getRadius: sizeMultiplier, // Recompute when sizeMultiplier changes
              },
            })
          }
        />
      </Deckgl>
    </div>
  );
}
