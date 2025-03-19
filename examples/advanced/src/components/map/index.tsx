import 'server-only';
import { Suspense } from 'react';
import { MapClient } from './client';
import { MapError } from './error';
import { MapLoading } from './loading';
import './side-effects';

export function MapView(props) {
  const { children } = props;

  return (
    <MapError>
      <Suspense fallback={<MapLoading />}>
        <MapClient>{children}</MapClient>
      </Suspense>
    </MapError>
  );
}
