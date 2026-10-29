import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Place } from "../lib/weather/types";

interface LocationState {
  autoLocate: boolean;
  lastPlace: Place | null;
  setAutoLocate: (value: boolean) => void;
  setLastPlace: (place: Place) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      autoLocate: false,
      lastPlace: null,
      setAutoLocate: (autoLocate) => set({ autoLocate }),
      setLastPlace: (lastPlace) => set({ lastPlace }),
    }),
    {
      name: "skycast-location",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        autoLocate: state.autoLocate,
        lastPlace: state.lastPlace,
      }),
    },
  ),
);
