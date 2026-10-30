import type { Place } from "./types";

// مفتاح بخانتين عشريتين (~1 كم): نفس المدينة من مصادر مختلفة بتعتبر مدينة وحدة
export const placeKey = (place: Pick<Place, "lat" | "lon">) =>
  `${place.lat.toFixed(2)},${place.lon.toFixed(2)}`;

// 4 خانات: كافية للطقس، ومقبولة بدالة التحقق من الرابط (حد أقصى 6)
export const roundCoord = (value: number) =>
  Math.round(value * 10_000) / 10_000;
