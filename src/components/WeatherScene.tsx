import { getSceneKind, seeded } from "@/lib/weather/scene";

const range = (count: number) => Array.from({ length: count }, (_, i) => i);

// كل قطرة ثانية تختفي على الموبايل (hidden sm:block) لتخفيف الحمل
const mobileHalf = (i: number) => (i % 2 ? "hidden sm:block" : "");

function Rain({ count, heavy = false }: { count: number; heavy?: boolean }) {
  return (
    <>
      {range(count).map((i) => (
        <span
          key={i}
          className={`wx-rain ${mobileHalf(i)}`}
          style={{
            left: `${seeded(i, 2) * 105}%`,
            animationDuration: `${(heavy ? 0.55 : 0.8) + seeded(i, 1) * 0.5}s`,
            animationDelay: `-${seeded(i, 3) * 2}s`,
            opacity: 0.4 + seeded(i, 4) * 0.5,
          }}
        />
      ))}
    </>
  );
}

function Snow({ count }: { count: number }) {
  return (
    <>
      {range(count).map((i) => {
        const size = 3 + seeded(i, 1) * 5;
        return (
          <span
            key={i}
            className={`wx-snow ${mobileHalf(i)}`}
            style={{
              left: `${seeded(i, 2) * 100}%`,
              width: size,
              height: size,
              animationDuration: `${7 + seeded(i, 3) * 8}s`,
              animationDelay: `-${seeded(i, 4) * 12}s`,
              opacity: 0.5 + seeded(i, 5) * 0.5,
            }}
          />
        );
      })}
    </>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <>
      {range(count).map((i) => {
        const size = 1.5 + seeded(i, 1) * 2;
        return (
          <span
            key={i}
            className={`wx-star ${mobileHalf(i)}`}
            style={{
              left: `${seeded(i, 2) * 100}%`,
              top: `${seeded(i, 3) * 70}%`,
              width: size,
              height: size,
              animationDuration: `${2 + seeded(i, 4) * 3}s`,
              animationDelay: `-${seeded(i, 5) * 4}s`,
            }}
          />
        );
      })}
    </>
  );
}

function Clouds({ count, dark = false }: { count: number; dark?: boolean }) {
  return (
    <>
      {range(count).map((i) => (
        <div
          key={i}
          className="wx-cloud"
          style={{
            top: `${4 + i * 17}%`,
            width: `${35 + seeded(i, 1) * 30}vw`,
            height: `${10 + seeded(i, 2) * 8}vh`,
            animationDuration: `${70 + seeded(i, 3) * 60}s`,
            animationDelay: `-${seeded(i, 4) * 80}s`,
            ...(dark ? { background: "rgba(15, 23, 42, 0.4)" } : null),
          }}
        />
      ))}
    </>
  );
}

function Fog() {
  return (
    <>
      {range(3).map((i) => (
        <div
          key={i}
          className="wx-fog"
          style={{
            top: `${30 + i * 20}%`,
            animationDuration: `${14 + i * 5}s`,
            animationDelay: `-${i * 4}s`,
          }}
        />
      ))}
    </>
  );
}

export function WeatherScene({ id, isDay }: { id: number; isDay: boolean }) {
  const kind = getSceneKind(id, isDay);
  const showSun = kind === "sun" || (kind === "clouds" && isDay && id <= 802);

  return (
    // الأب لازم يكون relative isolate، فالمشهد بيظهر فوق التدرج وتحت المحتوى
    <div aria-hidden="true" className="wx-scene -z-10">
      {showSun && <div className="wx-sun-glow" />}
      {kind === "stars" && <Stars count={36} />}
      {kind === "clouds" && <Clouds count={4} />}
      {kind === "fog" && <Fog />}
      {kind === "drizzle" && (
        <>
          <Clouds count={3} dark />
          <Rain count={22} />
        </>
      )}
      {kind === "rain" && (
        <>
          <Clouds count={3} dark />
          <Rain count={44} heavy={id >= 502} />
        </>
      )}
      {kind === "storm" && (
        <>
          <Clouds count={4} dark />
          <Rain count={44} heavy />
          <div className="wx-lightning" />
        </>
      )}
      {kind === "snow" && (
        <>
          <Clouds count={3} dark />
          <Snow count={36} />
        </>
      )}
    </div>
  );
}
