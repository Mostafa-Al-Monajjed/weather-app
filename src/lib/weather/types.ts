export type Units = "metric" | "imperial";

export interface Place {
  name: string;
  country?: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string; // مثل "10d": الحرف الأخير d نهار، n ليل
}

export interface CurrentWeather {
  place: Place;
  condition: WeatherCondition;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg?: number;
  windGust?: number;
  cloudiness: number;
  visibility?: number;
  rain1h?: number;
  snow1h?: number;
  observedAt: number; // ثواني (Unix)
  sunrise?: number;
  sunset?: number;
  timezoneOffset: number; // فرق التوقيت عن UTC بالثواني
  isDay: boolean;
}
export interface ForecastCondition {
  id: number; // بنفس ترقيم OpenWeather، فنستخدم نفس الأيقونات والألوان
  label: string;
}

export interface HourlyPoint {
  time: string; // وقت محلي للمدينة: "2026-10-20T14:00"
  temp: number;
  condition: ForecastCondition;
  isDay: boolean;
  precipChance?: number;
}

export interface DailyPoint {
  date: string; // "2026-10-20"
  condition: ForecastCondition;
  tempMax: number;
  tempMin: number;
  precipChance?: number;
}

export interface Forecast {
  now: string; // الوقت المحلي الحالي للمدينة
  daily: DailyPoint[];
  hourly: HourlyPoint[];
}
