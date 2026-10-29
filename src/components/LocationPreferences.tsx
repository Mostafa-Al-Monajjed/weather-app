"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { useHydrated } from "../hooks/useHydrated";
import { isPlace } from "../lib/weather/geolocation";
import { buildWeatherHref } from "../lib/weather/href";
import { useLocationStore } from "../store/location";

export function AutoLocateToggle() {
  const hydrated = useHydrated();
  const autoLocate = useLocationStore((state) => state.autoLocate);
  const setAutoLocate = useLocationStore((state) => state.setAutoLocate);

  return (
    <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-100">
      <input
        type="checkbox"
        // قبل الـ Hydration نعرض false عشان نطابق HTML السيرفر
        checked={hydrated && autoLocate}
        onChange={(event) => setAutoLocate(event.target.checked)}
        className="h-4 w-4 accent-sky-300"
      />
      Detect my location automatically on future visits
    </label>
  );
}

export function LastLocationLink() {
  const hydrated = useHydrated();
  const lastPlace = useLocationStore((state) => state.lastPlace);

  if (!hydrated || !isPlace(lastPlace)) return null;

  return (
    <Link
      href={buildWeatherHref(lastPlace)}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 active:scale-95"
    >
      <MapPin aria-hidden="true" className="h-4 w-4 text-sky-300" />
      <span className="sr-only">Your last location: </span>
      {lastPlace.name}
    </Link>
  );
}
