import { NextResponse } from "next/server";
import { getCurrentWeather } from "../../../lib/weather/current";
import { parseWeatherParams } from "../../../lib/weather/params";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // نعيد استخدام دالة التحقق من اليوم 2
  const parsed = parseWeatherParams({
    lat: searchParams.get("lat") ?? undefined,
    lon: searchParams.get("lon") ?? undefined,
    units: searchParams.get("units") ?? undefined,
  });

  if (!parsed) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  try {
    const weather = await getCurrentWeather(
      parsed.lat,
      parsed.lon,
      parsed.units,
    );

    return NextResponse.json(
      {
        temp: weather.temp,
        feelsLike: weather.feelsLike,
        description: weather.condition.description,
        conditionId: weather.condition.id,
        isDay: weather.isDay,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Weather unavailable" }, { status: 502 });
  }
}
