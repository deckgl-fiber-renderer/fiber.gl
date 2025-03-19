import 'server-only';
import { airports } from '@/dal/airports';
import { AirportsLayerClient } from './client';

export async function AirportsLayerServer() {
  const data = await airports();

  return <AirportsLayerClient data={data} />;
}
