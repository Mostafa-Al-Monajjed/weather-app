"use client";

import { Loader2, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useDebounce } from "use-debounce";
import { buildWeatherHref } from "../lib/weather/href";
import type { Place, Units } from "../lib/weather/types";

interface SearchResult {
  query: string;
  places: Place[];
  failed: boolean;
}

const MIN_CHARS = 2;

const describe = (place: Place) =>
  [place.name, place.state, place.country].filter(Boolean).join(", ");

export function CitySearch({ units = "metric" }: { units?: Units }) {
  const router = useRouter();
  const id = useId();
  const listId = `${id}-list`;

  const [query, setQuery] = useState("");
  const [debounced] = useDebounce(query.trim(), 350); // ننتظر 350ms بعد آخر حرف
  const [result, setResult] = useState<SearchResult | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (debounced.length < MIN_CHARS) return;

    const controller = new AbortController();

    fetch(`/api/cities?q=${encodeURIComponent(debounced)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Search failed");
        const data: unknown = await res.json();
        return Array.isArray(data) ? (data as Place[]) : [];
      })
      .then((places) => setResult({ query: debounced, places, failed: false }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setResult({ query: debounced, places: [], failed: true });
      });

    return () => controller.abort(); // نلغي الطلب القديم لما يتغيّر النص
  }, [debounced]);

  // القيم المشتقة: بدون setState داخل الـ effect
  const typed = query.trim();
  const hasQuery = typed.length >= MIN_CHARS;
  const places = hasQuery && result ? result.places : [];
  const pending =
    hasQuery && (debounced !== typed || result?.query !== debounced);
  const failed = hasQuery && !pending && result?.failed === true;
  const showEmpty = hasQuery && !pending && !failed && places.length === 0;
  const expanded =
    open && hasQuery && (places.length > 0 || failed || showEmpty);
  const activeIndex = Math.min(active, Math.max(places.length - 1, 0));

  function handleChange(value: string) {
    setQuery(value);
    setActive(0);
    setOpen(true);
    if (value.trim().length < MIN_CHARS) setResult(null);
  }

  function select(place: Place) {
    setQuery(place.name);
    setOpen(false);
    router.push(buildWeatherHref(place, units));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && places.length > 0) {
      event.preventDefault();
      setOpen(true);
      setActive((activeIndex + 1) % places.length);
    } else if (event.key === "ArrowUp" && places.length > 0) {
      event.preventDefault();
      setActive((activeIndex - 1 + places.length) % places.length);
    } else if (event.key === "Enter" && open && places[activeIndex]) {
      event.preventDefault();
      select(places[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div role="search" className="relative w-full max-w-xl">
      <label htmlFor={`${id}-input`} className="sr-only">
        Search for a city
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300"
      />
      <input
        id={`${id}-input`}
        type="text"
        role="combobox"
        aria-expanded={expanded && places.length > 0}
        aria-controls={places.length > 0 ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={
          expanded && places.length > 0 ? `${listId}-${activeIndex}` : undefined
        }
        autoComplete="off"
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
        placeholder="Search for a city…"
        className="w-full rounded-full bg-white/10 py-3.5 pl-12 pr-12 text-lg text-white outline-hidden ring-1 ring-white/20 backdrop-blur transition-shadow placeholder:text-slate-300 focus:ring-2 focus:ring-sky-300"
      />
      {pending && (
        <Loader2
          aria-hidden="true"
          className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-slate-300"
        />
      )}

      {expanded && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl bg-slate-900/95 text-left shadow-2xl ring-1 ring-white/15 backdrop-blur">
          {places.length > 0 && (
            <ul id={listId} role="listbox" aria-label="City suggestions">
              {places.map((place, index) => (
                <li
                  key={`${place.lat},${place.lon}`}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(event) => event.preventDefault()} // يمنع إغلاق القائمة قبل الضغط
                  onClick={() => select(place)}
                  onMouseEnter={() => setActive(index)}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-3 ${
                    index === activeIndex ? "bg-white/10" : ""
                  }`}
                >
                  <MapPin
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-sky-300"
                  />
                  <span>{describe(place)}</span>
                </li>
              ))}
            </ul>
          )}
          {showEmpty && (
            <p className="px-4 py-3 text-slate-200">No cities found.</p>
          )}
          {failed && (
            <p className="px-4 py-3 text-slate-200">
              Search is unavailable right now. Please try again.
            </p>
          )}
        </div>
      )}

      <p role="status" className="sr-only">
        {places.length > 0
          ? `${places.length} suggestions available`
          : showEmpty
            ? "No cities found"
            : ""}
      </p>
    </div>
  );
}
