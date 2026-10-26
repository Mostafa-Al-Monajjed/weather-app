import type { Place, Units } from "./types";

export const DEFAULT_UNITS: Units = "metric";

export function buildWeatherHref(
  place: Place,
  units: Units = DEFAULT_UNITS,
): string {
  const params = new URLSearchParams({
    lat: place.lat.toFixed(4), // 4 خانات = دقة حوالي 11 متر، وبتزيد فرص الاستفادة من الكاش
    lon: place.lon.toFixed(4),
    name: place.name,
  });

  if (place.country) params.set("country", place.country);
  if (place.state) params.set("state", place.state);
  if (units !== DEFAULT_UNITS) params.set("units", units);

  return `/weather?${params.toString()}`;
}
