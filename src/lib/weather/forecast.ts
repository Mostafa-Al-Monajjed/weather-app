import "server-only";
import { cache } from "react";
import { z } from "zod";
import type { Forecast, Units } from "./types";
import { describeWmo } from "./wmo";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const HOURS_AHEAD = 24;

export class ForecastError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ForecastError";
  }
}

// القيم ممكن تجي null لو غير متوفرة، فنسمح بها ونفلترها لاحقًا
const nullableNumbers = z.array(z.number().nullable());

const ForecastResponseSchema = z.object({
  current: z.object({ time: z.string() }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: nullableNumbers,
    weather_code: nullableNumbers,
    precipitation_probability: nullableNumbers,
    is_day: nullableNumbers,
  }),
  daily: z.object({
    time: z.array(z.string()),
    weather_code: nullableNumbers,
    temperature_2m_max: nullableNumbers,
    temperature_2m_min: nullableNumbers,
    precipitation_probability_max: nullableNumbers,
  }),
});

async function requestForecast(lat: number, lon: number, units: Units) {
  const url = new URL(FORECAST_URL);
  url.search = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "is_day", // نحتاجه فقط لنعرف الوقت المحلي الحالي بالمدينة
    hourly: "temperature_2m,weather_code,precipitation_probability,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "7",
    temperature_unit: units === "imperial" ? "fahrenheit" : "celsius",
  }).toString();

  const res = await fetch(url, { next: { revalidate: 900 } }); // 15 دقيقة

  if (!res.ok) {
    throw new ForecastError(
      `Forecast request failed (${res.status})`,
      res.status,
    );
  }

  return ForecastResponseSchema.parse(await res.json());
}

// cache: لو احتجنا التوقعات بأكتر من مكان بنفس الطلب، بتنجلب مرة وحدة
export const getForecast = cache(
  async (lat: number, lon: number, units: Units): Promise<Forecast> => {
    const raw = await requestForecast(lat, lon, units);
    const { hourly: h, daily: d } = raw;

    // أول ساعة >= الساعة الحالية (مقارنة نصوص ISO بتشتغل لأن صيغتها ثابتة)
    const nowHour = raw.current.time.slice(0, 13);
    const found = h.time.findIndex((time) => time.slice(0, 13) >= nowHour);
    const start = found === -1 ? 0 : found;

    const hourly = h.time
      .slice(start, start + HOURS_AHEAD)
      .flatMap((time, offset) => {
        const i = start + offset;
        const temp = h.temperature_2m[i];
        const code = h.weather_code[i];
        if (temp == null || code == null) return [];

        return [
          {
            time,
            temp,
            condition: describeWmo(code),
            isDay: h.is_day[i] === 1,
            precipChance: h.precipitation_probability[i] ?? undefined,
          },
        ];
      });

    const daily = d.time.flatMap((date, i) => {
      const max = d.temperature_2m_max[i];
      const min = d.temperature_2m_min[i];
      const code = d.weather_code[i];
      if (max == null || min == null || code == null) return [];

      return [
        {
          date,
          condition: describeWmo(code),
          tempMax: max,
          tempMin: min,
          precipChance: d.precipitation_probability_max[i] ?? undefined,
        },
      ];
    });

    return { now: raw.current.time, hourly, daily };
  },
);

// فشل التوقعات ما لازم يوقّف الصفحة كلها
export async function getForecastOrNull(
  lat: number,
  lon: number,
  units: Units,
): Promise<Forecast | null> {
  try {
    return await getForecast(lat, lon, units);
  } catch (error) {
    console.error(
      "Forecast unavailable:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
