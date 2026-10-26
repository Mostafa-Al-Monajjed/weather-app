import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
} from "lucide-react";

interface ConditionIconProps {
  id: number; // رقم الحالة من OpenWeather
  isDay: boolean;
  className?: string;
}

export function ConditionIcon({ id, isDay, className }: ConditionIconProps) {
  const props = { className, "aria-hidden": true as const, strokeWidth: 1.5 };

  if (id >= 200 && id < 300) return <CloudLightning {...props} />;
  if (id >= 300 && id < 400) return <CloudDrizzle {...props} />;
  if (id >= 500 && id < 600) return <CloudRain {...props} />;
  if (id >= 600 && id < 700) return <CloudSnow {...props} />;
  if (id >= 700 && id < 800) return <CloudFog {...props} />;
  if (id === 800) return isDay ? <Sun {...props} /> : <Moon {...props} />;
  if (id === 801 || id === 802)
    return isDay ? <CloudSun {...props} /> : <CloudMoon {...props} />;
  return <Cloud {...props} />;
}
