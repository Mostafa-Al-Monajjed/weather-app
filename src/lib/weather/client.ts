import "server-only"; // يمنع استيراد هذا الملف بأي Client Component
import { z } from "zod";

const BASE_URL = "https://api.openweathermap.org";

export class WeatherError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "WeatherError";
  }
}

type Params = Record<string, string | number | undefined>;

export async function owmFetch<S extends z.ZodType>(
  path: string,
  schema: S,
  params: Params = {},
  revalidate = 600, // بيانات الطقس بتتحدّث تقريبًا كل 10 دقائق
): Promise<z.infer<S>> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) throw new Error("Missing OPENWEATHER_API_KEY in .env.local");

  const url = new URL(path, BASE_URL);
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(name, String(value));
  }
  url.searchParams.set("appid", key);

  const res = await fetch(url, { next: { revalidate } });

  if (!res.ok) {
    // ما نحط الرابط برسالة الخطأ، لأنه فيه المفتاح
    throw new WeatherError(
      `OpenWeather request failed (${res.status})`,
      res.status,
    );
  }

  return schema.parse(await res.json());
}
