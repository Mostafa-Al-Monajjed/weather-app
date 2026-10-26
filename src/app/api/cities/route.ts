import { NextResponse } from "next/server";
import { searchLocations } from "@/lib/weather/geocoding";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < 2 || query.length > 60) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchLocations(query, 5);

    // نحذف التكرار (نفس الاسم والولاية والدولة)
    const seen = new Set<string>();
    const places = results.filter((place) => {
      const key = `${place.name}|${place.state ?? ""}|${place.country}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json(places, {
      // الـ CDN يخزّن النتيجة يوم كامل، فالبحث المكرر ما بيستهلك حصتنا
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ error: "Search unavailable" }, { status: 502 });
  }
}
