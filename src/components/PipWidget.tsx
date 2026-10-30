"use client";

import { PictureInPicture2, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useHydrated } from "../hooks/useHydrated";
import { useMiniWeather } from "../hooks/useMiniWeather";
import { formatTemp } from "../lib/weather/format";
import { placeKey } from "../lib/weather/place";
import { getSkyGradient } from "../lib/weather/theme";
import type { Place, Units } from "../lib/weather/types";
import { ConditionIcon } from "./ConditionIcon";

// الـ API لسه مش بأنواع TypeScript الرسمية، فنعرّف الجزء اللي بنحتاجه
interface PipApi {
  requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
}
type PipCapableWindow = Window & { documentPictureInPicture?: PipApi };

const REFRESH_MS = 10 * 60 * 1000;

// النافذة العائمة وثيقة فاضية بدون ستايلات، فننسخ ستايلات الصفحة إلها
function copyStyles(target: Document) {
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const css = Array.from(sheet.cssRules)
        .map((rule) => rule.cssText)
        .join("");
      const style = target.createElement("style");
      style.textContent = css;
      target.head.appendChild(style);
    } catch {
      // ملف من نطاق ثاني (CORS): نربطه برابطه
      if (sheet.href) {
        const link = target.createElement("link");
        link.rel = "stylesheet";
        link.href = sheet.href;
        target.head.appendChild(link);
      }
    }
  }
}

function WidgetCard({ place, units }: { place: Place; units: Units }) {
  const { data, failed } = useMiniWeather(place, units, REFRESH_MS);
  const gradient = data
    ? getSkyGradient(data.conditionId, data.isDay)
    : "from-slate-800 via-slate-800 to-slate-900";

  return (
    <div
      className={`flex min-h-dvh flex-col justify-between bg-linear-to-b p-4 text-white ${gradient}`}
    >
      <p className="truncate text-sm font-semibold">
        {place.country ? `${place.name}, ${place.country}` : place.name}
      </p>

      {data ? (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-5xl font-bold tabular-nums">
              {formatTemp(data.temp)}
            </p>
            <p className="mt-1 truncate text-sm capitalize">
              {data.description}
            </p>
            <p className="text-xs text-slate-100">
              Feels like {formatTemp(data.feelsLike)}
            </p>
          </div>
          <ConditionIcon
            id={data.conditionId}
            isDay={data.isDay}
            animated
            className="h-20 w-20 shrink-0"
          />
        </div>
      ) : (
        <p className="text-sm text-slate-100">
          {failed ? "Unavailable right now" : "Loading…"}
        </p>
      )}

      <p className="text-xs text-slate-200">Updates every 10 minutes</p>
    </div>
  );
}

interface WidgetContextValue {
  supported: boolean;
  activeKey: string | null;
  open: (place: Place, units: Units) => Promise<void>;
  close: () => void;
}

const WidgetContext = createContext<WidgetContextValue | null>(null);

function useWidget() {
  const context = useContext(WidgetContext);
  if (!context) throw new Error("useWidget must be used inside WidgetProvider");
  return context;
}

// الـ Provider بالـ layout: فالـ widget بيضل شغال لما تتنقل بين المدن
export function WidgetProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const windowRef = useRef<Window | null>(null);
  const [pip, setPip] = useState<{
    win: Window;
    place: Place;
    units: Units;
  } | null>(null);

  const supported = hydrated && "documentPictureInPicture" in window;

  // نقفل النافذة لو تغيّرت أو انحذف الـ Provider
  useEffect(() => {
    const win = pip?.win;
    return () => win?.close();
  }, [pip]);

  const open = useCallback(async (place: Place, units: Units) => {
    const api = (window as PipCapableWindow).documentPictureInPicture;
    if (!api) return;

    try {
      windowRef.current?.close();
      // لازم يتنادى مباشرة من ضغطة المستخدم، وإلا المتصفح بيرفضه
      const win = await api.requestWindow({ width: 320, height: 200 });

      copyStyles(win.document);
      win.document.body.className = document.body.className; // لنفس الخط والألوان
      windowRef.current = win;
      setPip({ win, place, units });

      win.addEventListener("pagehide", () => {
        if (windowRef.current === win) {
          windowRef.current = null;
          setPip(null);
        }
      });
    } catch {
      // الطلب مرفوض أو ملغي: ما بنعمل شي
    }
  }, []);

  const close = useCallback(() => {
    windowRef.current?.close();
  }, []);

  const value = useMemo<WidgetContextValue>(
    () => ({
      supported,
      activeKey: pip ? placeKey(pip.place) : null,
      open,
      close,
    }),
    [supported, pip, open, close],
  );

  return (
    <WidgetContext.Provider value={value}>
      {children}
      {pip &&
        createPortal(
          <WidgetCard place={pip.place} units={pip.units} />,
          pip.win.document.body,
        )}
    </WidgetContext.Provider>
  );
}

export function PopOutButton({ place, units }: { place: Place; units: Units }) {
  const { supported, activeKey, open, close } = useWidget();

  if (!supported) return null; // المتصفح ما بيدعم الميزة: ما نعرض زر ما بيشتغل

  const isOpen = activeKey === placeKey(place);

  return (
    <button
      type="button"
      onClick={() => (isOpen ? close() : void open(place, units))}
      className="inline-flex items-center gap-2 rounded-full bg-black/25 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/15 transition-all duration-300 hover:bg-white/15 active:scale-95"
    >
      {isOpen ? (
        <X aria-hidden="true" className="h-4 w-4" />
      ) : (
        <PictureInPicture2 aria-hidden="true" className="h-4 w-4" />
      )}
      {isOpen ? "Close widget" : "Pop out widget"}
    </button>
  );
}
