import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 px-4 pt-32 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-2 text-slate-100">We couldn&apos;t find that page.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-sky-300 px-6 py-2.5 font-semibold text-slate-900 hover:bg-sky-200"
      >
        Back to search
      </Link>
    </div>
  );
}
