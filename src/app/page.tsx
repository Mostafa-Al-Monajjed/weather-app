import Link from "next/link";
import { CitySearch } from "../components/CitySearch";
import { siteName } from "../lib/site";
import { buildWeatherHref } from "../lib/weather/href";
import { POPULAR_PLACES } from "../lib/weather/popular";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-linear-to-b from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-24 text-center">
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
        className="animate-fade-up mt-8 flex w-full justify-center"
        style={{ animationDelay: "240ms" }}
      >
        <CitySearch />
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
