import 'server-only';
import { Suspense } from 'react';
import { AirportsLayerServer } from './server';
import { AirportsLayerError } from './error';

export function AirportsLayer() {
  return (
    <AirportsLayerError>
      <Suspense fallback={null}>
        <AirportsLayerServer />
      </Suspense>
    </AirportsLayerError>
  );
}
