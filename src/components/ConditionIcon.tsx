import type { ReactNode } from "react";

const CLOUD_LIGHT = "#e2e8f0";
const CLOUD_DARK = "#94a3b8";
const CLOUD_STORM = "#64748b";
const SUN = "#fde047";
const MOON = "#fef3c7";
const RAIN = "#7dd3fc";
const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function Sun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <g className="wx-spin" stroke={SUN} strokeWidth="3" strokeLinecap="round">
        {RAY_ANGLES.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          return (
            <line
              key={angle}
              x1={(cx + cos * (r + 5)).toFixed(2)}
              y1={(cy + sin * (r + 5)).toFixed(2)}
              x2={(cx + cos * (r + 9)).toFixed(2)}
              y2={(cy + sin * (r + 9)).toFixed(2)}
            />
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r={r} fill={SUN} />
    </g>
  );
}

function Moon({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill={MOON} />
    </g>
  );
}

function Star({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <circle
      className="wx-twinkle"
      cx={x}
      cy={y}
      r="1.6"
      fill="#fff"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

interface CloudProps {
  x?: number;
  y?: number;
  scale?: number;
  fill?: string;
  drift?: boolean;
  delay?: number;
}

function Cloud({
  x = 0,
  y = 0,
  scale = 1,
  fill = CLOUD_LIGHT,
  drift = false,
  delay = 0,
}: CloudProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g
        className={drift ? "wx-drift" : undefined}
        style={{ animationDelay: `${delay}s` }}
      >
        <g fill={fill}>
          <circle cx="24" cy="36" r="10" />
          <circle cx="36" cy="30" r="13" />
          <circle cx="47" cy="38" r="9" />
          <rect x="22" y="36" width="26" height="11" rx="5.5" />
        </g>
      </g>
    </g>
  );
}

function ClearNight() {
  return (
    <>
      <Moon transform="translate(8 8) scale(2)" />
      <Star x={12} y={14} delay={0} />
      <Star x={53} y={18} delay={1} />
      <Star x={49} y={51} delay={2} />
    </>
  );
}

function PartlyCloudy({ isDay }: { isDay: boolean }) {
  return (
    <>
      {isDay ? (
        <Sun cx={24} cy={24} r={9} />
      ) : (
        <Moon transform="translate(-1 -1) scale(1.5)" />
      )}
      <Cloud x={9} y={12} scale={0.85} drift />
    </>
  );
}

function Cloudy() {
  return (
    <>
      <Cloud x={-4} y={-2} scale={0.9} fill={CLOUD_DARK} drift delay={1.5} />
      <Cloud x={8} y={8} scale={0.9} drift />
    </>
  );
}

function Rainy({ drops, length }: { drops: number[]; length: number }) {
  return (
    <>
      <Cloud y={-6} fill={CLOUD_DARK} drift />
      <g stroke={RAIN} strokeWidth="3" strokeLinecap="round">
        {drops.map((x, i) => (
          <line
            key={x}
            className="wx-drop"
            x1={x}
            y1={46}
            x2={x - 2}
            y2={46 + length}
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
      </g>
    </>
  );
}

function Storm() {
  return (
    <>
      <Cloud y={-8} fill={CLOUD_STORM} drift />
      <path
        className="wx-flash"
        d="M36 36 L27 49 H33 L29 61 L42 45 H36 L40 36 Z"
        fill={SUN}
      />
    </>
  );
}

function Snowy() {
  return (
    <>
      <Cloud y={-6} fill={CLOUD_DARK} drift />
      {[22, 32, 42].map((x, i) => (
        <circle
          key={x}
          className="wx-flake"
          cx={x}
          cy={48}
          r={2.3}
          fill="#fff"
          style={{ animationDelay: `${i * 0.6}s` }}
        />
      ))}
    </>
  );
}

function Foggy() {
  const lines = [
    { y: 48, x1: 14, x2: 50 },
    { y: 54, x1: 20, x2: 56 },
    { y: 60, x1: 12, x2: 44 },
  ];

  return (
    <>
      <Cloud y={-8} scale={0.95} />
      <g stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round">
        {lines.map((line, i) => (
          <line
            key={line.y}
            className="wx-sway"
            x1={line.x1}
            y1={line.y}
            x2={line.x2}
            y2={line.y}
            style={{ animationDelay: `${i * 0.8}s` }}
          />
        ))}
      </g>
    </>
  );
}

function renderGlyph(id: number, isDay: boolean): ReactNode {
  if (id >= 200 && id < 300) return <Storm />;
  if (id >= 300 && id < 400) return <Rainy drops={[26, 38]} length={5} />;
  if (id >= 500 && id < 600) return <Rainy drops={[22, 32, 42]} length={7} />;
  if (id >= 600 && id < 700) return <Snowy />;
  if (id >= 700 && id < 800) return <Foggy />;
  if (id === 800)
    return isDay ? <Sun cx={32} cy={32} r={11} /> : <ClearNight />;
  if (id === 801 || id === 802) return <PartlyCloudy isDay={isDay} />;
  return <Cloudy />;
}

interface ConditionIconProps {
  id: number; // رقم الحالة (ترقيم OpenWeather)
  isDay: boolean;
  className?: string;
  animated?: boolean; // الافتراضي ثابتة، والحركة للأيقونة الكبيرة فقط
}

export function ConditionIcon({
  id,
  isDay,
  className,
  animated = false,
}: ConditionIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      data-animated={animated ? "" : undefined}
    >
      {renderGlyph(id, isDay)}
    </svg>
  );
}
