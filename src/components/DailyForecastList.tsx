import { formatTemp, formatWallClock } from "../lib/weather/format";
import type { DailyPoint } from "../lib/weather/types";
import { ConditionIcon } from "./ConditionIcon";

// موقع وعرض شريط الحرارة لكل يوم، نسبةً لأدنى وأعلى حرارة بالأسبوع كله
function rangeStyle(
  min: number,
  max: number,
  weekMin: number,
  weekMax: number,
) {
  const span = Math.max(weekMax - weekMin, 1);
  const width = Math.max(((max - min) / span) * 100, 8);
  const left = Math.min(((min - weekMin) / span) * 100, 100 - width);
  return { left: `${left}%`, width: `${width}%` };
}

interface DailyForecastListProps {
  daily: DailyPoint[];
  today: string; // تاريخ اليوم المحلي للمدينة "2026-10-20"
}

export function DailyForecastList({ daily, today }: DailyForecastListProps) {
  if (daily.length === 0) return null;

  const weekMin = Math.min(...daily.map((day) => day.tempMin));
  const weekMax = Math.max(...daily.map((day) => day.tempMax));

  return (
    <section aria-labelledby="daily-heading" className="mt-10">
      <h2 id="daily-heading" className="mb-4 text-lg font-semibold">
        {daily.length}-day forecast
      </h2>

      <ul className="divide-y divide-white/10 rounded-2xl bg-black/20 px-4 ring-1 ring-white/10">
        {daily.map((day) => (
          <li key={day.date} className="flex items-center gap-3 py-3 sm:gap-4">
            <time
              dateTime={day.date}
              className="w-14 shrink-0 font-medium sm:w-20"
            >
              {day.date === today
                ? "Today"
                : formatWallClock(day.date, { weekday: "short" })}
            </time>

            <div className="flex w-10 shrink-0 flex-col items-center">
              <ConditionIcon
                id={day.condition.id}
                isDay
                className="h-7 w-7 text-white"
              />
              <span className="sr-only">{day.condition.label}</span>
              <span className="h-4 text-xs text-sky-200">
                {day.precipChance !== undefined && day.precipChance >= 10 ? (
                  <>
                    <span className="sr-only">Chance of rain </span>
                    {day.precipChance}%
                  </>
                ) : null}
              </span>
            </div>

            <span className="w-9 shrink-0 text-right text-slate-100">
              <span className="sr-only">Low </span>
              {formatTemp(day.tempMin)}
            </span>

            <div
              aria-hidden="true"
              className="relative h-1.5 flex-1 rounded-full bg-white/15"
            >
              <div
                className="absolute inset-y-0 rounded-full bg-linear-to-r from-sky-300 to-amber-300"
                style={rangeStyle(day.tempMin, day.tempMax, weekMin, weekMax)}
              />
            </div>

            <span className="w-9 shrink-0 text-right font-semibold">
              <span className="sr-only">High </span>
              {formatTemp(day.tempMax)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
