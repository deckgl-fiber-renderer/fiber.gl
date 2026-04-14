import "server-only";
import { Suspense } from "react";

import { AirportsLayerError } from "./error";
import { AirportsLayerServer } from "./server";

export function AirportsLayer() {
  return (
    <AirportsLayerError>
      <Suspense fallback={null}>
        <AirportsLayerServer />
      </Suspense>
    </AirportsLayerError>
  );
}
