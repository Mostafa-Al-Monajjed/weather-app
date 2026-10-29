import { MapPin } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { AutoLocate } from "../components/AutoLocate";
import { FindPlace } from "../components/FindPlace";
import { LastLocationLink } from "../components/LocationPreferences";
import { siteName } from "../lib/site";
import { buildWeatherHref } from "../lib/weather/href";
import { parseWeatherParams } from "../lib/weather/params";
import { POPULAR_PLACES } from "../lib/weather/popular";
import type { Place } from "../lib/weather/types";

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value); // اسم المدينة ممكن يجي مُرمّز بالهيدر
  } catch {
    return value;
  }
}

// موقع تقريبي من عنوان IP (Vercel فقط). محليًا أو لو غابت الهيدرات: null
async function getApproximatePlace(): Promise<Place | null> {
  const requestHeaders = await headers();

  const coords = parseWeatherParams({
    lat: requestHeaders.get("x-vercel-ip-latitude") ?? undefined,
    lon: requestHeaders.get("x-vercel-ip-longitude") ?? undefined,
  });
  const city = requestHeaders.get("x-vercel-ip-city");
  if (!coords || !city) return null;

  const country = requestHeaders.get("x-vercel-ip-country") ?? undefined;

  return {
    name: safeDecode(city).slice(0, 60),
    country: country && /^[A-Z]{2}$/.test(country) ? country : undefined,
    lat: coords.lat,
    lon: coords.lon,
  };
}

export default async function HomePage() {
  // قراءة الهيدرات بتخلي الصفحة ديناميكية (بتتحدد لكل زائر)
  const approximate = await getApproximatePlace();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-linear-to-b from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-24 text-center">
      <AutoLocate />

      <h1 className="animate-fade-up text-5xl font-bold sm:text-7xl">
        {siteName}
      </h1>
      <p
        className="animate-fade-up mt-4 max-w-md text-lg text-slate-100"
        style={{ animationDelay: "120ms" }}
      >
        Live weather for any city, with a sky that matches the conditions.
      </p>

      <div
        className="animate-fade-up mt-8 flex w-full flex-col items-center"
        style={{ animationDelay: "240ms" }}
      >
        <FindPlace />
      </div>

      <div
        className="animate-fade-up mt-6 flex flex-wrap justify-center gap-2 empty:hidden"
        style={{ animationDelay: "300ms" }}
      >
        <LastLocationLink />
        {approximate && (
          <Link
            href={buildWeatherHref(approximate)}
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/40 bg-sky-300/10 px-4 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-300/20 active:scale-95"
          >
            <MapPin aria-hidden="true" className="h-4 w-4 text-sky-300" />
            <span className="sr-only">
              Approximate location from your network:{" "}
            </span>
            {approximate.name}
            <span className="text-slate-200">· approximate</span>
          </Link>
        )}
      </div>

      <section
        aria-labelledby="popular-heading"
        className="animate-fade-up mt-12"
        style={{ animationDelay: "360ms" }}
      >
        <h2
          id="popular-heading"
          className="text-sm font-semibold uppercase tracking-widest text-sky-300"
        >
          Popular cities
        </h2>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {POPULAR_PLACES.map((place) => (
            <li key={place.name}>
              <Link
                href={buildWeatherHref(place)}
                className="inline-block rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 active:scale-95"
              >
                {place.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
