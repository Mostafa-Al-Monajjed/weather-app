import type { Units } from "../lib/weather/types";
import { CitySearch } from "./CitySearch";
import { LocateButton } from "./LocateButton";
import { AutoLocateToggle } from "./LocationPreferences";

export function FindPlace({ units = "metric" }: { units?: Units }) {
  return (
    <div className="w-full max-w-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <CitySearch units={units} />
        </div>
        <LocateButton units={units} />
      </div>
      <AutoLocateToggle />
    </div>
  );
}
