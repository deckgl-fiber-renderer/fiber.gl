import 'server-only';
import { unstable_cacheTag as cacheTag } from 'next/cache';

export async function airports() {
  'use cache';

  const response = await fetch(
    'https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/US_Airport/FeatureServer/0/query?where=1%3D1&outFields=NAME,GLOBAL_ID,LONGITUDE,LATITUDE,ICAO_ID,TYPE_CODE,MIL_CODE&outSR=4326&f=json',
  );
  const data = await response.json();

  cacheTag('airports');

  return data.features;
}

export async function airportById(id: string) {
  'use cache';

  const response = await fetch(
    'https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/US_Airport/FeatureServer/0/query?where=1%3D1&outFields=NAME,GLOBAL_ID,LONGITUDE,LATITUDE,ICAO_ID,TYPE_CODE,MIL_CODE&outSR=4326&f=json',
  );
  const data = await response.json();

  const airport = data.features.find((obj) => obj.attributes.GLOBAL_ID === id);

  cacheTag(`airports-${id}`);

  return airport;
}
