import type { ForecastCondition } from "./types";

// رموز WMO (Open-Meteo) ← ترقيم OpenWeather اللي تعتمد عليه الأيقونات والألوان
const WMO: Record<number, ForecastCondition> = {
  0: { id: 800, label: "Clear sky" },
  1: { id: 801, label: "Mainly clear" },
  2: { id: 802, label: "Partly cloudy" },
  3: { id: 804, label: "Overcast" },
  45: { id: 741, label: "Fog" },
  48: { id: 741, label: "Rime fog" },
  51: { id: 300, label: "Light drizzle" },
  53: { id: 301, label: "Drizzle" },
  55: { id: 302, label: "Heavy drizzle" },
  56: { id: 511, label: "Freezing drizzle" },
  57: { id: 511, label: "Freezing drizzle" },
  61: { id: 500, label: "Light rain" },
  63: { id: 501, label: "Rain" },
  65: { id: 502, label: "Heavy rain" },
  66: { id: 511, label: "Freezing rain" },
  67: { id: 511, label: "Freezing rain" },
  71: { id: 600, label: "Light snow" },
  73: { id: 601, label: "Snow" },
  75: { id: 602, label: "Heavy snow" },
  77: { id: 600, label: "Snow grains" },
  80: { id: 520, label: "Light showers" },
  81: { id: 521, label: "Showers" },
  82: { id: 522, label: "Heavy showers" },
  85: { id: 620, label: "Light snow showers" },
  86: { id: 621, label: "Snow showers" },
  95: { id: 211, label: "Thunderstorm" },
  96: { id: 202, label: "Thunderstorm with hail" },
  99: { id: 202, label: "Severe thunderstorm with hail" },
};

export const describeWmo = (code: number): ForecastCondition =>
  WMO[code] ?? { id: 803, label: "Cloudy" };
