import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isPlace } from "../lib/weather/geolocation";
import { placeKey, roundCoord } from "../lib/weather/place";
import type { Place } from "../lib/weather/types";

export const MAX_SAVED = 8;

interface CitiesState {
  saved: Place[];
  toggle: (place: Place) => void;
  remove: (key: string) => void;
}

const normalize = (place: Place): Place => ({
  name: place.name,
  country: place.country,
  state: place.state,
  lat: roundCoord(place.lat),
  lon: roundCoord(place.lon),
});

// بيانات localStorage ممكن تكون معدّلة، فنفلتر العناصر غير الصالحة دايمًا
const valid = (list: Place[]) => list.filter(isPlace);

export const useCitiesStore = create<CitiesState>()(
  persist(
    (set) => ({
      saved: [],

      toggle: (place) =>
        set((state) => {
          const key = placeKey(place);
          const current = valid(state.saved);

          if (current.some((p) => placeKey(p) === key)) {
            return { saved: current.filter((p) => placeKey(p) !== key) };
          }
          return { saved: [normalize(place), ...current].slice(0, MAX_SAVED) };
        }),

      remove: (key) =>
        set((state) => ({
          saved: valid(state.saved).filter((p) => placeKey(p) !== key),
        })),
    }),
    {
      name: "skycast-cities",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ saved: state.saved }),
    },
  ),
);
