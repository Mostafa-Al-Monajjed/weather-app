import { owmFetch } from "./client";
import { CurrentWeatherSchema } from "./schemas";
import type { CurrentWeather, Units } from "./types";

export async function getCurrentWeather(
  lat: number,
  lon: number,
  units: Units = "metric",
): Promise<CurrentWeather> {
  const raw = await owmFetch("/data/2.5/weather", CurrentWeatherSchema, {
    lat,
    lon,
    units,
  });

  const condition = raw.weather[0];

  // نحوّل شكل OpenWeather لشكلنا: لو غيّرنا المزوّد لاحقًا، الواجهة ما بتتأثر
  return {
    place: {
      name: raw.name,
      country: raw.sys.country,
      lat: raw.coord.lat,
      lon: raw.coord.lon,
    },
    condition,
    temp: raw.main.temp,
    feelsLike: raw.main.feels_like,
    tempMin: raw.main.temp_min,
    tempMax: raw.main.temp_max,
    humidity: raw.main.humidity,
    pressure: raw.main.pressure,
    windSpeed: raw.wind.speed,
    windDeg: raw.wind.deg,
    windGust: raw.wind.gust,
    cloudiness: raw.clouds.all,
    visibility: raw.visibility,
    rain1h: raw.rain?.["1h"],
    snow1h: raw.snow?.["1h"],
    observedAt: raw.dt,
    sunrise: raw.sys.sunrise,
    sunset: raw.sys.sunset,
    timezoneOffset: raw.timezone,
    isDay: condition.icon.endsWith("d"),
  };
}
