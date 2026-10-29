import type { Place } from "./types";

export type GeoFailureKind =
  | "unsupported"
  | "insecure"
  | "denied"
  | "unavailable"
  | "timeout";

export class GeoFailure extends Error {
  constructor(public kind: GeoFailureKind) {
    super(kind);
    this.name = "GeoFailure";
  }
}

export const GEO_MESSAGES: Record<GeoFailureKind, string> = {
  unsupported:
    "Your browser doesn't support location services. Search for a city instead.",
  insecure: "Location only works on secure (HTTPS) connections.",
  denied:
    "Location access is blocked. Allow it in your browser's site settings, or search for a city.",
  unavailable:
    "We couldn't determine your position. Check your connection or GPS, or search for a city.",
  timeout: "Locating took too long. Please try again.",
};

// تحقق من شكل Place (بيانات الـ localStorage أو الاستجابات ممكن تكون ناقصة أو معدّلة)
export function isPlace(value: unknown): value is Place {
  if (typeof value !== "object" || value === null) return false;
  const place = value as Record<string, unknown>;

  return (
    typeof place.name === "string" &&
    typeof place.lat === "number" &&
    Number.isFinite(place.lat) &&
    place.lat >= -90 &&
    place.lat <= 90 &&
    typeof place.lon === "number" &&
    Number.isFinite(place.lon) &&
    place.lon >= -180 &&
    place.lon <= 180 &&
    (place.country === undefined || typeof place.country === "string") &&
    (place.state === undefined || typeof place.state === "string")
  );
}

function getPosition(): Promise<GeolocationPosition> {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    return Promise.reject(new GeoFailure("unsupported"));
  }
  if (!window.isSecureContext) {
    return Promise.reject(new GeoFailure("insecure"));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        reject(
          new GeoFailure(
            error.code === error.PERMISSION_DENIED
              ? "denied"
              : error.code === error.TIMEOUT
                ? "timeout"
                : "unavailable",
          ),
        );
      },
      // دقة المدينة تكفينا: أسرع وبتوفر البطارية
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60 * 1000 },
    );
  });
}

// تقريب لخانتين عشريتين (حوالي 1 كم): ما نحتاج موقعك الدقيق
const round2 = (value: number) => Math.round(value * 100) / 100;

export async function resolveCurrentPlace(): Promise<Place> {
  const position = await getPosition();
  const lat = round2(position.coords.latitude);
  const lon = round2(position.coords.longitude);

  try {
    const response = await fetch(`/api/reverse?lat=${lat}&lon=${lon}`);
    if (response.ok) {
      const data: unknown = await response.json();
      if (isPlace(data)) return data; // مركز المدينة، مش موقعك الدقيق
    }
  } catch {
    // نكمل بالاسم العام
  }

  return { name: "My location", lat, lon };
}
