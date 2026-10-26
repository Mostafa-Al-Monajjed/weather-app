import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CurrentWeatherView } from "../../components/CurrentWeatherView";
import { WeatherSkeleton } from "../../components/WeatherSkeleton";
import {
  parseWeatherParams,
  type RawSearchParams,
} from "../../lib/weather/params";

type Props = { searchParams: Promise<RawSearchParams> };

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const request = parseWeatherParams(await searchParams);

  return {
    title: request?.name ? `Weather in ${request.name}` : "Weather",
    robots: { index: false }, // روابط الإحداثيات ما لازم تنفهرس (نتعامل مع الـ SEO باليوم 7)
  };
}

export default async function WeatherPage({ searchParams }: Props) {
  const request = parseWeatherParams(await searchParams);
  if (!request) redirect("/"); // رابط ناقص أو غير صالح: نرجع للرئيسية

  return (
    // الـ key بيعيد إظهار الـ Skeleton مع كل مدينة أو وحدة جديدة
    <Suspense
      key={`${request.lat},${request.lon},${request.units}`}
      fallback={<WeatherSkeleton />}
    >
      <CurrentWeatherView request={request} />
    </Suspense>
  );
}
