"use client";

import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex-1 px-4 pt-32 text-center">
      <h1 className="text-2xl font-bold">Couldn&apos;t load the weather</h1>
      <p className="mt-2 text-slate-100">
        Something went wrong while fetching the data. Please try again.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-sky-300 px-6 py-2.5 font-semibold text-slate-900 hover:bg-sky-200"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/30 px-6 py-2.5 font-semibold hover:bg-white/10"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
