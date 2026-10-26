import { CloudSun } from "lucide-react";
import Link from "next/link";
import { siteName } from "../lib/site";

// شفاف وفوق المحتوى، فخلفية السماء تظهر خلفه
export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <CloudSun aria-hidden="true" className="h-6 w-6 text-sky-300" />
          {siteName}
        </Link>
      </div>
    </header>
  );
}
