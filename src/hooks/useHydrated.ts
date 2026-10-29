"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// السيرفر ووقت الـ Hydration بيرجّع false، وبعدها المتصفح بيرجّع true
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
