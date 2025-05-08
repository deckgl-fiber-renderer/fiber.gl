import { DeckglExample } from './_deckgl';

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

export default async function Page() {
  const response = await fetch(
    'https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Stadiums/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
  );

  const data = await response.json();

  return (
    <>
      <DeckglExample data={data} />
    </>
  );
}
