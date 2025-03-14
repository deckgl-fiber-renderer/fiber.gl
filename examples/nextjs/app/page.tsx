import { DeckglExample } from './_deckgl';
import { Sidebar } from './_sidebar';

export default async function Page() {
  const response = await fetch(
    'https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Stadiums/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
  );

  const data = await response.json();

  return (
    <>
      <DeckglExample data={data} />
      <Sidebar data={data} />
    </>
  );
}
