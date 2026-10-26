export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-300">
      <p>
        Weather data provided by{" "}
        <a
          href="https://openweathermap.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          OpenWeather
        </a>
        .
      </p>
      <p className="mt-1">
        Built by Mustafa Al-Munajjed with Next.js, TypeScript &amp; Tailwind CSS
      </p>
    </footer>
  );
}
