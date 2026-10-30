import {
  ArrowDown,
  ArrowUp,
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
import { getForecastOrNull } from "../lib/weather/forecast";
import {
  degreesToCompass,
  formatDistance,
  formatLocalTime,
  formatSpeed,
  formatTemp,
} from "../lib/weather/format";
import type { WeatherRequest } from "../lib/weather/params";
import { getSkyGradient } from "../lib/weather/theme";
import { ConditionIcon } from "./ConditionIcon";
import { DailyForecastList } from "./DailyForecastList";
import { FindPlace } from "./FindPlace";
import { HourlyForecastStrip } from "./HourlyForecastStrip";
import { Reveal } from "./Reveal";
import { StaggerGrid, StaggerItem } from "./Stagger";
import { UnitsToggle } from "./UnitsToggle";
import { WeatherScene } from "./WeatherScene";

interface DetailCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}

function DetailCard({ icon, label, value, hint }: DetailCardProps) {
  return (
    <div className="h-full rounded-2xl bg-black/20 p-4 ring-1 ring-white/10 transition-colors duration-300 hover:bg-black/30">
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

  // الطلبين بنفس الوقت: وإذا فشلت التوقعات، الطقس الحالي بيظهر عادي
  const [weather, forecast] = await Promise.all([
    getCurrentWeather(request.lat, request.lon, units),
    getForecastOrNull(request.lat, request.lon, units),
  ]);

  const { condition, timezoneOffset: offset } = weather;

  const todayDate = forecast?.now.slice(0, 10) ?? "";
  const todayRange = forecast?.daily.find((day) => day.date === todayDate);

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
    // isolate + overflow-hidden: المشهد (z-index سالب) بيبقى جوا هذا الصندوق فقط
    <div
      className={`animate-fade-in relative isolate flex-1 overflow-hidden bg-linear-to-b ${getSkyGradient(condition.id, weather.isDay)}`}
    >
      <WeatherScene id={condition.id} isDay={weather.isDay} />

      <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-24">
        <FindPlace units={units} />

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
            <div className="animate-pop">
              <ConditionIcon
                id={condition.id}
                isDay={weather.isDay}
                animated
                className="h-24 w-24 sm:h-32 sm:w-32"
              />
            </div>
            <div>
              <p className="text-7xl font-bold leading-none sm:text-8xl">
                {formatTemp(weather.temp)}
              </p>
              <p className="mt-2 text-xl capitalize">{condition.description}</p>
              <p className="mt-1 text-slate-100">
                Feels like {formatTemp(weather.feelsLike)}
              </p>

              {todayRange && (
                <p className="mt-1 flex items-center gap-4 text-slate-100">
                  <span className="flex items-center gap-1">
                    <ArrowUp aria-hidden="true" className={iconClass} />
                    <span className="sr-only">High </span>
                    {formatTemp(todayRange.tempMax)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowDown aria-hidden="true" className={iconClass} />
                    <span className="sr-only">Low </span>
                    {formatTemp(todayRange.tempMin)}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <UnitsToggle place={place} units={units} />
          </div>
        </section>

        {forecast ? (
          <>
            <Reveal>
              <HourlyForecastStrip hourly={forecast.hourly} />
            </Reveal>
            <Reveal>
              <DailyForecastList daily={forecast.daily} today={todayDate} />
            </Reveal>
          </>
        ) : (
          <p
            role="status"
            className="mt-10 rounded-2xl bg-black/20 p-4 text-slate-100 ring-1 ring-white/10"
          >
            The forecast is temporarily unavailable. Current conditions are
            still up to date.
          </p>
        )}

        <section aria-labelledby="details-heading" className="mt-10">
          <h2 id="details-heading" className="mb-4 text-lg font-semibold">
            Details
          </h2>
          <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {cards.map(({ key, ...card }) => (
              <StaggerItem key={key}>
                <DetailCard {...card} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      </div>
    </div>
  );
}
