"use client";

import { Star } from "lucide-react";
import { useHydrated } from "../hooks/useHydrated";
import { isPlace } from "../lib/weather/geolocation";
import { placeKey } from "../lib/weather/place";
import type { Place } from "../lib/weather/types";
import { useCitiesStore } from "../store/cities";

export function SaveCityButton({ place }: { place: Place }) {
  const hydrated = useHydrated();
  const toggle = useCitiesStore((state) => state.toggle);
  const key = placeKey(place);
  const isSaved = useCitiesStore((state) =>
    state.saved.some((p) => isPlace(p) && placeKey(p) === key),
  );

  // قبل الـ Hydration نعرض "غير محفوظة" عشان نطابق HTML السيرفر
  const active = hydrated && isSaved;

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => toggle(place)}
      className="inline-flex items-center gap-2 rounded-full bg-black/25 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/15 transition-all duration-300 hover:bg-white/15 active:scale-95"
    >
      <Star
        aria-hidden="true"
        className={`h-4 w-4 ${active ? "fill-amber-300 text-amber-300" : ""}`}
      />
      {active ? "Saved" : "Save city"}
    </button>
  );
}
