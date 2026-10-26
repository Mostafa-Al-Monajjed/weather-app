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
