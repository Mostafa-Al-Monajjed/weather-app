"use client";

import { useEffect, useState } from "react";
import { roundCoord } from "../lib/weather/place";
import type { MiniWeather, Place, Units } from "../lib/weather/types";

function isMini(value: unknown): value is MiniWeather {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;

  return (
    typeof v.temp === "number" &&
    typeof v.feelsLike === "number" &&
    typeof v.description === "string" &&
    typeof v.conditionId === "number" &&
    typeof v.isDay === "boolean"
  );
}

export function useMiniWeather(
  place: Pick<Place, "lat" | "lon">,
  units: Units,
  refreshMs?: number,
) {
  const lat = roundCoord(place.lat);
  const lon = roundCoord(place.lon);
  const key = `${lat},${lon},${units}`;

  const [result, setResult] = useState<{
    key: string;
    data: MiniWeather | null;
  } | null>(null);
  const [tick, setTick] = useState(0);

  // تحديث دوري اختياري (للـ widget)
  useEffect(() => {
    if (!refreshMs) return;
    const id = window.setInterval(() => setTick((n) => n + 1), refreshMs);
    return () => window.clearInterval(id);
  }, [refreshMs]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/mini?lat=${lat}&lon=${lon}&units=${units}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Request failed");
        const data: unknown = await response.json();
        if (!isMini(data)) throw new Error("Unexpected response");
        return data;
      })
      .then((data) => setResult({ key, data }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        // لو فشل تحديث، نحافظ على آخر بيانات ناجحة لنفس المدينة
        setResult((previous) =>
          previous?.key === key ? previous : { key, data: null },
        );
      });

    return () => controller.abort();
  }, [lat, lon, units, key, tick]);

  // الاستجابة القديمة (مدينة ثانية) ما بتنحسب
  const current = result?.key === key ? result : null;

  return {
    data: current?.data ?? undefined,
    failed: current !== null && current.data === null,
    loading: current === null,
  };
}
