export function getSkyGradient(id: number, isDay: boolean): string {
  if (id >= 200 && id < 300)
    return "from-slate-900 via-indigo-950 to-slate-800";

  if (id >= 300 && id < 600) {
    return isDay
      ? "from-slate-700 via-slate-600 to-blue-800"
      : "from-slate-950 via-slate-900 to-blue-950";
  }

  if (id >= 600 && id < 700) {
    return isDay
      ? "from-slate-600 via-sky-800 to-slate-600"
      : "from-slate-900 via-slate-800 to-sky-950";
  }

  if (id >= 700 && id < 800) {
    return isDay
      ? "from-slate-600 via-zinc-600 to-slate-700"
      : "from-slate-900 via-zinc-800 to-slate-800";
  }

  if (id === 800) {
    return isDay
      ? "from-sky-700 via-blue-700 to-indigo-800"
      : "from-slate-950 via-indigo-950 to-blue-950";
  }

  return isDay
    ? "from-slate-600 via-sky-800 to-slate-700"
    : "from-slate-900 via-slate-800 to-indigo-950";
}
