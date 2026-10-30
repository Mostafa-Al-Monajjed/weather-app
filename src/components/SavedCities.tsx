"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useHydrated } from "../hooks/useHydrated";
import { useMiniWeather } from "../hooks/useMiniWeather";
import { isPlace } from "../lib/weather/geolocation";
import { formatTemp } from "../lib/weather/format";
import { buildWeatherHref } from "../lib/weather/href";
import { placeKey } from "../lib/weather/place";
import type { Place, Units } from "../lib/weather/types";
import { useCitiesStore } from "../store/cities";
import { ConditionIcon } from "./ConditionIcon";

function SavedCard({ place, units }: { place: Place; units: Units }) {
  const { data, failed, loading } = useMiniWeather(place, units);
  const remove = useCitiesStore((state) => state.remove);

  return (
    <li className="relative">
      {/* الزر بجانب الرابط مش جواه: عنصر تفاعلي جوا <a> غير صحيح */}
      <Link
        href={buildWeatherHref(place, units)}
        className="block rounded-2xl bg-white/5 p-4 text-left ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
      >
        <p className="truncate pr-8 text-sm font-semibold">{place.name}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-3xl font-bold tabular-nums">
            {data ? formatTemp(data.temp) : "–"}
          </p>
          {data && (
            <ConditionIcon
              id={data.conditionId}
              isDay={data.isDay}
              className="h-10 w-10"
            />
          )}
        </div>
        <p className="mt-1 min-h-5 truncate text-xs capitalize text-slate-200">
          {data
            ? data.description
            : failed
              ? "Unavailable"
              : loading
                ? "Loading…"
                : ""}
        </p>
      </Link>

      <button
        type="button"
        onClick={() => remove(placeKey(place))}
        aria-label={`Remove ${place.name}`}
        className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full text-slate-200 transition-colors hover:bg-white/15 hover:text-white"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </li>
  );
}

export function SavedCities({ units = "metric" }: { units?: Units }) {
  const hydrated = useHydrated();
  const saved = useCitiesStore((state) => state.saved);
  const places = hydrated ? saved.filter(isPlace) : [];

  if (places.length === 0) return null;

  return (
    <section aria-labelledby="saved-heading" className="mt-10 w-full max-w-3xl">
      <h2
        id="saved-heading"
        className="text-sm font-semibold uppercase tracking-widest text-sky-300"
      >
        My cities
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {places.map((place) => (
          <SavedCard key={placeKey(place)} place={place} units={units} />
        ))}
      </ul>
    </section>
  );
}
