import { owmFetch } from "./client";
import { GeoLocationsSchema } from "./schemas";

// أسماء المدن وإحداثياتها ما بتتغير، فنخزنها 24 ساعة
const DAY = 86400;

export function searchLocations(query: string, limit = 5) {
  return owmFetch(
    "/geo/1.0/direct",
    GeoLocationsSchema,
    { q: query, limit },
    DAY,
  );
}

export async function reverseGeocode(lat: number, lon: number) {
  const results = await owmFetch(
    "/geo/1.0/reverse",
    GeoLocationsSchema,
    { lat, lon, limit: 1 },
    DAY,
  );
  return results[0] ?? null;
}
