import "server-only";
import { airportById } from "@/dal/airports";

import { AirportsCardClient } from "./client";

interface PageProps {
  id: string;
}

export async function AirportsCardServer({ id }: PageProps) {
  const data = await airportById(id);

  return <AirportsCardClient data={data} />;
}
