import { getCurrentWeather } from "@/lib/weather/current";
import { searchLocations } from "@/lib/weather/geocoding";

export default async function HomePage() {
  const [place] = await searchLocations("Damascus", 1);

  if (!place) {
    return <main className="p-8">Location not found.</main>;
  }

  const weather = await getCurrentWeather(place.lat, place.lon);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-sm rounded-3xl bg-neutral-900 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-widest text-neutral-400">
          {weather.place.name}, {weather.place.country}
        </p>
        <p className="mt-4 text-7xl font-bold">{Math.round(weather.temp)}°</p>
        <p className="mt-2 text-lg capitalize">
          {weather.condition.description}
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-neutral-400">Feels like</dt>
            <dd>{Math.round(weather.feelsLike)}°</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Humidity</dt>
            <dd>{weather.humidity}%</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Wind</dt>
            <dd>{weather.windSpeed} m/s</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
