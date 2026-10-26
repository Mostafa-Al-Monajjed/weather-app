export function WeatherSkeleton() {
  return (
    <div className="flex-1 bg-slate-900 px-4 pb-16 pt-24" aria-busy="true">
      <div className="mx-auto max-w-5xl">
        <p role="status" className="sr-only">
          Loading weather…
        </p>
        <div className="skeleton h-12 w-full max-w-xl rounded-full" />
        <div className="skeleton mt-10 h-5 w-48 rounded" />
        <div className="skeleton mt-3 h-10 w-72 rounded" />
        <div className="skeleton mt-8 h-28 w-64 rounded-2xl" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
