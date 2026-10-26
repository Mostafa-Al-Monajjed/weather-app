import type { Units } from "./types";

export const formatTemp = (value: number) => `${Math.round(value)}°`;

export function formatSpeed(value: number, units: Units) {
  return `${Number(value.toFixed(1))} ${units === "metric" ? "m/s" : "mph"}`;
}

// الرؤية بتجي دايمًا بالأمتار من OpenWeather
export function formatDistance(meters: number, units: Units) {
  return units === "metric"
    ? `${Number((meters / 1000).toFixed(1))} km`
    : `${Number((meters / 1609.344).toFixed(1))} mi`;
}

const DIRECTIONS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];

export const degreesToCompass = (deg: number) =>
  DIRECTIONS[Math.round(deg / 22.5) % 16];

// وقت المدينة نفسها: نضيف فرق التوقيت لـ UTC ونعرض بتوقيت UTC
export function formatLocalTime(
  unixSeconds: number,
  offsetSeconds: number,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: "UTC",
  }).format(new Date((unixSeconds + offsetSeconds) * 1000));
}
