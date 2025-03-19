import 'server-only';
import { Suspense } from 'react';
import { AirportsCardError } from './error';
import { AirportsCardLoading } from './loading';
import { AirportsCardServer } from './server';

export function AirportsCard({ id }) {
  return (
    <AirportsCardError>
      <Suspense fallback={<AirportsCardLoading />}>
        <AirportsCardServer id={id} />
      </Suspense>
    </AirportsCardError>
  );
}
