import { Shirt } from "lucide-react";
import type { OutfitAdvice } from "../lib/weather/outfit";

export function OutfitCard({ advice }: { advice: OutfitAdvice }) {
  return (
    <section aria-labelledby="outfit-heading" className="mt-10">
      <h2 id="outfit-heading" className="mb-4 text-lg font-semibold">
        What to wear
      </h2>
      <div className="rounded-2xl bg-black/20 p-5 ring-1 ring-white/10">
        <p className="flex items-center gap-2 text-xl font-semibold">
          <Shirt aria-hidden="true" className="h-5 w-5 text-sky-300" />
          {advice.headline}
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-100">
          {advice.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-200">
          General suggestions based on the &ldquo;feels like&rdquo; temperature,
          wind and conditions.
        </p>
      </div>
    </section>
  );
}
