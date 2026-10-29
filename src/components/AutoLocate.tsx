"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useHydrated } from "../hooks/useHydrated";
import { resolveCurrentPlace } from "../lib/weather/geolocation";
import { buildWeatherHref } from "../lib/weather/href";
import { useLocationStore } from "../store/location";

const SESSION_KEY = "skycast-auto-located";

// sessionStorage ممكن ما يشتغل (مثلًا تصفح خاص بمتصفحات معينة)، فنحميه بـ try/catch
function alreadyRan() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markRan() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // ما في مشكلة
  }
}

export function AutoLocate() {
  const router = useRouter();
  const hydrated = useHydrated();
  const autoLocate = useLocationStore((state) => state.autoLocate);
  const setLastPlace = useLocationStore((state) => state.setLastPlace);

  const started = useRef(false); // محاولة وحدة بس (StrictMode بيشغّل الـ effect مرتين بالتطوير)
  const mounted = useRef(false); // ما نوجّه المستخدم لو غادر الصفحة قبل ما نخلص

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !autoLocate || started.current || alreadyRan()) return;
    started.current = true;

    async function run() {
      try {
        // نتحرك تلقائيًا فقط لو الإذن ممنوح مسبقًا، فما نفاجئ المستخدم بنافذة طلب إذن
        const permission = await navigator.permissions?.query({
          name: "geolocation",
        });
        if (permission?.state !== "granted") return;

        markRan();
        const place = await resolveCurrentPlace();
        if (!mounted.current) return;

        setLastPlace(place);
        router.replace(buildWeatherHref(place));
      } catch {
        // فشل صامت: المستخدم يقدر يبحث أو يضغط الزر يدويًا
      }
    }

    void run();
  }, [hydrated, autoLocate, router, setLastPlace]);

  return null;
}
