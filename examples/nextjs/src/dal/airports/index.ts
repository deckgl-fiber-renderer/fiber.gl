"use cache";
import "server-only";
import { unstable_cacheTag as cacheTag } from "next/cache";

const API_URL =
	"https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/US_Airport/FeatureServer/0/query";

interface AirportFeature {
	properties: {
		OBJECTID: number;
		NAME: string;
		CITY: string;
		STATE: string;
		LATITUDE: number;
		LONGITUDE: number;
		[key: string]: unknown;
	};
	geometry: {
		type: string;
		coordinates: [number, number];
	};
}

interface AirportsResponse {
	type: string;
	features: AirportFeature[];
}

export interface Airport {
	id: number;
	name: string;
	city: string;
	state: string;
	latitude: number;
	longitude: number;
	coordinates: [number, number];
}

/**
 * Fetch airports from FAA API with optional search filtering
 */
export async function airports(search?: string): Promise<Airport[]> {
	cacheTag("airports");

	// Build where clause for server-side filtering
	let whereClause = "1=1";
	if (search && search.trim()) {
		const searchTerm = search.trim().toUpperCase();
		whereClause = `UPPER(NAME) LIKE '%${searchTerm}%' OR UPPER(CITY) LIKE '%${searchTerm}%' OR UPPER(STATE) LIKE '%${searchTerm}%'`;
	}

	const url = new URL(API_URL);
	url.searchParams.set("outFields", "*");
	url.searchParams.set("where", whereClause);
	url.searchParams.set("f", "geojson");

	const response = await fetch(url.toString());
	if (!response.ok) {
		throw new Error(`Failed to fetch airports: ${response.statusText}`);
	}

	const data: AirportsResponse = await response.json();

	return data.features.map((feature) => ({
		id: feature.properties.OBJECTID,
		name: feature.properties.NAME,
		city: feature.properties.CITY,
		state: feature.properties.STATE,
		latitude: feature.properties.LATITUDE,
		longitude: feature.properties.LONGITUDE,
		coordinates: feature.geometry.coordinates,
	}));
}

/**
 * Fetch a single airport by ID
 */
export async function airportById(id: number): Promise<Airport | null> {
	cacheTag("airports", `airport-${id}`);

	const url = new URL(API_URL);
	url.searchParams.set("outFields", "*");
	url.searchParams.set("where", `OBJECTID=${id}`);
	url.searchParams.set("f", "geojson");

	const response = await fetch(url.toString());
	if (!response.ok) {
		throw new Error(`Failed to fetch airport: ${response.statusText}`);
	}

	const data: AirportsResponse = await response.json();

	if (data.features.length === 0) {
		return null;
	}

	const feature = data.features[0];
	return {
		id: feature.properties.OBJECTID,
		name: feature.properties.NAME,
		city: feature.properties.CITY,
		state: feature.properties.STATE,
		latitude: feature.properties.LATITUDE,
		longitude: feature.properties.LONGITUDE,
		coordinates: feature.geometry.coordinates,
	};
}
