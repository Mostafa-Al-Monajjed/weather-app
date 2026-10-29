import { NextResponse } from "next/server";
import { reverseGeocode } from "../../../lib/weather/geocoding";
import { parseWeatherParams } from "../../../lib/weather/params";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // نعيد استخدام دالة التحقق من اليوم 2
  const coords = parseWeatherParams({
    lat: searchParams.get("lat") ?? undefined,
    lon: searchParams.get("lon") ?? undefined,
  });

  if (!coords) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  try {
    const place = await reverseGeocode(coords.lat, coords.lon);
    if (!place) {
      return NextResponse.json({ error: "No place found" }, { status: 404 });
    }

    return NextResponse.json(place, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ error: "Lookup unavailable" }, { status: 502 });
  }
}
