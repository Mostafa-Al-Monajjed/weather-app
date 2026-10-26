import {
  Cloud,
  CloudRain,
  Droplets,
  Eye,
  Gauge,
  Snowflake,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";
import type { ReactNode } from "react";
import { getCurrentWeather } from "../lib/weather/current";
import {
  degreesToCompass,
  formatDistance,
  formatLocalTime,
  formatSpeed,
  formatTemp,
} from "../lib/weather/format";
import type { WeatherRequest } from "../lib/weather/params";
import { getSkyGradient } from "../lib/weather/theme";
import { CitySearch } from "./CitySearch";
import { ConditionIcon } from "./ConditionIcon";
import { UnitsToggle } from "./UnitsToggle";

interface DetailCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}

function DetailCard({ icon, label, value, hint }: DetailCardProps) {
  return (
    <div className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
      <dt className="flex items-center gap-2 text-sm text-slate-100">
        {icon}
        {label}
      </dt>
      <dd className="mt-2 text-2xl font-semibold text-white">{value}</dd>
      {hint && <p className="mt-1 text-sm text-slate-100">{hint}</p>}
    </div>
  );
}

const iconClass = "h-4 w-4";

export async function CurrentWeatherView({
  request,
}: {
  request: WeatherRequest;
}) {
  const { units } = request;
  const weather = await getCurrentWeather(request.lat, request.lon, units);
  const { condition, timezoneOffset: offset } = weather;

  // نفضّل الاسم اللي اختاره المستخدم، لأن اسم OpenWeather ممكن يكون حي أو محطة قريبة
  const name = request.name ?? weather.place.name;
  const country = request.country ?? weather.place.country;
  const place = {
    name,
    country,
    state: request.state,
    lat: request.lat,
    lon: request.lon,
  };

  const windHint =
    [
      weather.windDeg !== undefined
        ? `From ${degreesToCompass(weather.windDeg)}`
        : null,
      weather.windGust !== undefined
        ? `Gusts ${formatSpeed(weather.windGust, units)}`
        : null,
    ]
      .filter(Boolean)
      .join(" · ") || undefined;

  const timeOnly: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };

  const cards: (DetailCardProps & { key: string })[] = [
    {
      key: "humidity",
      icon: <Droplets aria-hidden="true" className={iconClass} />,
      label: "Humidity",
      value: `${weather.humidity}%`,
    },
    {
      key: "wind",
      icon: <Wind aria-hidden="true" className={iconClass} />,
      label: "Wind",
      value: formatSpeed(weather.windSpeed, units),
      hint: windHint,
    },
    {
      key: "pressure",
      icon: <Gauge aria-hidden="true" className={iconClass} />,
      label: "Pressure",
      value: `${weather.pressure} hPa`,
    },
    {
      key: "clouds",
      icon: <Cloud aria-hidden="true" className={iconClass} />,
      label: "Cloudiness",
      value: `${weather.cloudiness}%`,
    },
  ];

  if (weather.visibility !== undefined) {
    cards.push({
      key: "visibility",
      icon: <Eye aria-hidden="true" className={iconClass} />,
      label: "Visibility",
      value: formatDistance(weather.visibility, units),
    });
  }
  if (weather.sunrise !== undefined) {
    cards.push({
      key: "sunrise",
      icon: <Sunrise aria-hidden="true" className={iconClass} />,
      label: "Sunrise",
      value: formatLocalTime(weather.sunrise, offset, timeOnly),
    });
  }
  if (weather.sunset !== undefined) {
    cards.push({
      key: "sunset",
      icon: <Sunset aria-hidden="true" className={iconClass} />,
      label: "Sunset",
      value: formatLocalTime(weather.sunset, offset, timeOnly),
    });
  }
  if (weather.rain1h !== undefined) {
    cards.push({
      key: "rain",
      icon: <CloudRain aria-hidden="true" className={iconClass} />,
      label: "Rain",
      value: `${weather.rain1h} mm`,
      hint: "Last hour",
    });
  }
  if (weather.snow1h !== undefined) {
    cards.push({
      key: "snow",
      icon: <Snowflake aria-hidden="true" className={iconClass} />,
      label: "Snow",
      value: `${weather.snow1h} mm`,
      hint: "Last hour",
    });
  }

  return (
    <div
      className={`animate-fade-in flex-1 bg-linear-to-b ${getSkyGradient(condition.id, weather.isDay)}`}
    >
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-24">
        <CitySearch units={units} />

        <section aria-labelledby="place-heading" className="mt-10">
          <p className="text-sm text-slate-100">
            <time dateTime={new Date(weather.observedAt * 1000).toISOString()}>
              {formatLocalTime(weather.observedAt, offset, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}{" "}
              · {formatLocalTime(weather.observedAt, offset, timeOnly)}
            </time>{" "}
            (local time)
          </p>
          <h1
            id="place-heading"
            className="mt-1 text-3xl font-bold sm:text-4xl"
          >
            {country ? `${name}, ${country}` : name}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ConditionIcon
              id={condition.id}
              isDay={weather.isDay}
              className="h-24 w-24 text-white sm:h-32 sm:w-32"
            />
            <div>
              <p className="text-7xl font-bold leading-none sm:text-8xl">
                {formatTemp(weather.temp)}
              </p>
              <p className="mt-2 text-xl capitalize">{condition.description}</p>
              <p className="mt-1 text-slate-100">
                Feels like {formatTemp(weather.feelsLike)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <UnitsToggle place={place} units={units} />
          </div>
        </section>

        <section aria-labelledby="details-heading" className="mt-10">
          <h2 id="details-heading" className="mb-4 text-lg font-semibold">
            Details
          </h2>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {cards.map(({ key, ...card }) => (
              <DetailCard key={key} {...card} />
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
