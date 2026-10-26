import Link from "next/link";
import { buildWeatherHref } from "../lib/weather/href";
import type { Place, Units } from "../lib/weather/types";

const OPTIONS: { value: Units; label: string; name: string }[] = [
  { value: "metric", label: "°C", name: "Celsius (°C)" },
  { value: "imperial", label: "°F", name: "Fahrenheit (°F)" },
];

export function UnitsToggle({ place, units }: { place: Place; units: Units }) {
  return (
    <div
      role="group"
      aria-label="Units"
      className="inline-flex rounded-full bg-black/25 p-1 ring-1 ring-white/15"
    >
      {OPTIONS.map((option) => (
        <Link
          key={option.value}
          href={buildWeatherHref(place, option.value)}
          replace
          scroll={false}
          aria-label={option.name}
          aria-current={units === option.value ? "true" : undefined}
          className="rounded-full px-5 py-1.5 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/15 aria-[current=true]:bg-white aria-[current=true]:text-slate-900 aria-[current=true]:hover:bg-white"
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
