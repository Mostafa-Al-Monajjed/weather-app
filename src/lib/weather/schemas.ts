import { z } from "zod";

export const GeoLocationSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});

export const GeoLocationsSchema = z.array(GeoLocationSchema);

const ConditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const CurrentWeatherSchema = z.object({
  coord: z.object({ lat: z.number(), lon: z.number() }),
  weather: z.array(ConditionSchema).min(1),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  visibility: z.number().optional(),
  wind: z.object({
    speed: z.number(),
    deg: z.number().optional(),
    gust: z.number().optional(),
  }),
  clouds: z.object({ all: z.number() }),
  rain: z.object({ "1h": z.number().optional() }).optional(),
  snow: z.object({ "1h": z.number().optional() }).optional(),
  dt: z.number(),
  sys: z.object({
    country: z.string().optional(),
    sunrise: z.number().optional(), // أحيانًا غايبة بالمناطق القطبية
    sunset: z.number().optional(),
  }),
  timezone: z.number(),
  name: z.string(),
});
