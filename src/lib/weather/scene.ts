export type SceneKind =
  | "storm"
  | "rain"
  | "drizzle"
  | "snow"
  | "fog"
  | "stars"
  | "clouds"
  | "sun"
  | "none";

export function getSceneKind(id: number, isDay: boolean): SceneKind {
  if (id >= 200 && id < 300) return "storm";
  if (id >= 300 && id < 400) return "drizzle";
  if (id >= 500 && id < 600) return "rain";
  if (id >= 600 && id < 700) return "snow";
  if (id >= 700 && id < 800) return "fog";
  if (id === 800) return isDay ? "sun" : "stars";
  if (id > 800) return "clouds";
  return "none";
}

// شبه عشوائي ثابت: نفس الرقم دايمًا بيعطي نفس النتيجة (بدون Math.random)
export function seeded(index: number, salt: number): number {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}
