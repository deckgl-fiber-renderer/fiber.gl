import 'server-only';
import { Suspense } from 'react';
import { AirportsListError } from './error';
import { AirportsListLoading } from './loading';
import { AirportsListServer } from './server';

export function AirportsList() {
  return (
    <AirportsListError>
      <Suspense fallback={<AirportsListLoading />}>
        <AirportsListServer />
      </Suspense>
    </AirportsListError>
  );
}
