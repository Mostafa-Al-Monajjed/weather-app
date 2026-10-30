import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConditionIcon } from "../../components/ConditionIcon";
import { WeatherScene } from "../../components/WeatherScene";
import { getSkyGradient } from "../../lib/weather/theme";

export const metadata: Metadata = { title: "Lab", robots: { index: false } };

const SAMPLES = [
  { id: 800, isDay: true, label: "Clear day" },
  { id: 800, isDay: false, label: "Clear night" },
  { id: 802, isDay: true, label: "Partly cloudy" },
  { id: 802, isDay: false, label: "Cloudy night" },
  { id: 804, isDay: true, label: "Overcast" },
  { id: 300, isDay: true, label: "Drizzle" },
  { id: 501, isDay: true, label: "Rain" },
  { id: 211, isDay: false, label: "Thunderstorm" },
  { id: 601, isDay: true, label: "Snow" },
  { id: 741, isDay: true, label: "Fog" },
];

export default async function LabPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const { s } = await searchParams;
  const index = Math.min(Math.max(Number(s) || 0, 0), SAMPLES.length - 1);
  const sample = SAMPLES[index];

  return (
    <div
      className={`relative isolate flex-1 overflow-hidden bg-linear-to-b ${getSkyGradient(sample.id, sample.isDay)}`}
    >
      <WeatherScene id={sample.id} isDay={sample.isDay} />

      <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-24">
        <h1 className="text-2xl font-bold">{sample.label}</h1>
        <ConditionIcon
          id={sample.id}
          isDay={sample.isDay}
          animated
          className="mt-6 h-40 w-40"
        />

        <ul className="mt-10 flex flex-wrap gap-2">
          {SAMPLES.map((item, i) => (
            <li key={item.label}>
              <Link
                href={`/lab?s=${i}`}
                aria-current={i === index ? "true" : undefined}
                className="inline-block rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm transition-colors hover:bg-white/15 aria-[current=true]:bg-white aria-[current=true]:text-slate-900"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
