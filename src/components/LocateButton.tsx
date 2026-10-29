"use client";

import { Loader2, LocateFixed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import {
  GEO_MESSAGES,
  GeoFailure,
  resolveCurrentPlace,
} from "../lib/weather/geolocation";
import { buildWeatherHref } from "../lib/weather/href";
import type { Units } from "../lib/weather/types";
import { useLocationStore } from "../store/location";

export function LocateButton({ units = "metric" }: { units?: Units }) {
  const router = useRouter();
  const errorId = useId();
  const setLastPlace = useLocationStore((state) => state.setLastPlace);

  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const busy = locating || isPending;

  async function handleClick() {
    setLocating(true);
    setError(null);

    try {
      const place = await resolveCurrentPlace();
      setLastPlace(place);
      startTransition(() => router.push(buildWeatherHref(place, units)));
    } catch (failure) {
      setError(
        failure instanceof GeoFailure
          ? GEO_MESSAGES[failure.kind]
          : "Something went wrong while finding your location.",
      );
    } finally {
      setLocating(false); // isPending بيضل true لحد ما تخلص الصفحة الجديدة
    }
  }

  return (
    <div className="shrink-0">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-describedby={error ? errorId : undefined}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-3.5 text-base font-semibold text-white ring-1 ring-white/20 backdrop-blur transition-all duration-300 hover:bg-white/20 active:scale-95 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {busy ? (
          <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
        ) : (
          <LocateFixed aria-hidden="true" className="h-5 w-5" />
        )}
        {busy ? "Locating…" : "Use my location"}
      </button>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-3 max-w-sm rounded-xl bg-black/30 p-3 text-left text-sm text-slate-100 ring-1 ring-white/15"
        >
          {error}
        </p>
      )}
    </div>
  );
}
