import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CurrentWeatherView } from "../../components/CurrentWeatherView";
import { WeatherSkeleton } from "../../components/WeatherSkeleton";
import {
  parseWeatherParams,
  type RawSearchParams,
} from "../../lib/weather/params";

type Props = {
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const request = parseWeatherParams(await searchParams);

  return {
    title: request?.name ? `Weather in ${request.name}` : "Weather",
    robots: { index: false },
  };
}

async function WeatherContent({ searchParams }: Props) {
  const request = parseWeatherParams(await searchParams);

  if (!request) {
    redirect("/");
  }

  return <CurrentWeatherView request={request} />;
}

export default function WeatherPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<WeatherSkeleton />}>
      <WeatherContent searchParams={searchParams} />
    </Suspense>
  );
}
