import { Droplets } from "lucide-react";
import { formatTemp, formatWallClock } from "../lib/weather/format";
import type { HourlyPoint } from "../lib/weather/types";
import { ConditionIcon } from "./ConditionIcon";

export function HourlyForecastStrip({ hourly }: { hourly: HourlyPoint[] }) {
  if (hourly.length === 0) return null;

  return (
    <section aria-labelledby="hourly-heading" className="mt-10">
      <h2 id="hourly-heading" className="mb-4 text-lg font-semibold">
        Next 24 hours
      </h2>

      {/* منطقة تمرير أفقي: tabIndex بيخلي مستخدم الكيبورد يقدر يتحرك فيها بالأسهم */}
      <div
        role="region"
        aria-label="Hourly forecast, scrollable"
        tabIndex={0}
        className="-mx-4 overflow-x-auto px-4 pb-3"
      >
        <ul className="flex w-max gap-3">
          {hourly.map((hour, index) => (
            <li
              key={hour.time}
              className="flex w-20 shrink-0 flex-col items-center gap-2 rounded-2xl bg-black/20 px-2 py-4 ring-1 ring-white/10"
            >
              <time dateTime={hour.time} className="text-sm text-slate-100">
                {index === 0
                  ? "Now"
                  : formatWallClock(hour.time, { hour: "numeric" })}
              </time>
              <ConditionIcon
                id={hour.condition.id}
                isDay={hour.isDay}
                className="h-8 w-8 text-white"
              />
              <span className="sr-only">{hour.condition.label}</span>
              <span className="text-lg font-semibold">
                {formatTemp(hour.temp)}
              </span>
              <span className="flex h-4 items-center gap-1 text-xs text-sky-200">
                {hour.precipChance !== undefined && hour.precipChance >= 10 && (
                  <>
                    <Droplets aria-hidden="true" className="h-3 w-3" />
                    <span className="sr-only">Chance of rain </span>
                    {hour.precipChance}%
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
