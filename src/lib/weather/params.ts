import type { Units } from "./types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export interface WeatherRequest {
  lat: number;
  lon: number;
  units: Units;
  name?: string;
  country?: string;
  state?: string;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

function parseCoord(
  value: string | undefined,
  min: number,
  max: number,
): number | null {
  if (!value || !/^-?\d{1,3}(\.\d{1,6})?$/.test(value)) return null;
  const n = Number(value);
  return n >= min && n <= max ? n : null;
}

function cleanText(value: string | undefined, max: number): string | undefined {
  const cleaned = value?.replace(/\s+/g, " ").trim().slice(0, max);
  return cleaned || undefined;
}

// أي حد يقدر يكتب أي شي بالرابط، فنتحقق من كل قيمة قبل استخدامها
export function parseWeatherParams(
  raw: RawSearchParams,
): WeatherRequest | null {
  const lat = parseCoord(first(raw.lat), -90, 90);
  const lon = parseCoord(first(raw.lon), -180, 180);
  if (lat === null || lon === null) return null;

  const country = cleanText(first(raw.country), 2);

  return {
    lat,
    lon,
    units: first(raw.units) === "imperial" ? "imperial" : "metric",
    name: cleanText(first(raw.name), 60),
    country:
      country && /^[a-z]{2}$/i.test(country)
        ? country.toUpperCase()
        : undefined,
    state: cleanText(first(raw.state), 60),
  };
}
