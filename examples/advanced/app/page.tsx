import { MapClient } from '@/components/map/client';
import { AirportsLayer } from '@/components/airports/layer';
import { AirportsList } from '@/components/airports/list';
import { Layout, LayoutFooter, LayoutMap, LayoutRight } from '@/ui/layout';
import { selectedCache } from '@/utils/params';
import { AirportsCard } from '@/components/airports/card';

async function DynamicCard({ searchParams }) {
  const { selected } = await selectedCache.parse(searchParams);

  if (!selected) {
    return null;
  }

  return <AirportsCard id={selected} />;
}

export default function Page({ searchParams }) {
  return (
    <Layout>
      <LayoutMap>
        <MapClient>
          <AirportsLayer />
        </MapClient>
        <DynamicCard searchParams={searchParams} />
      </LayoutMap>
      <LayoutRight>
        <AirportsList />
      </LayoutRight>
      <LayoutFooter></LayoutFooter>
    </Layout>
  );
}
