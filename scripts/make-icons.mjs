import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const SUN = { cx: 190, cy: 190, r: 70 };

const rays = Array.from({ length: 8 }, (_, i) => {
  const angle = (i * Math.PI) / 4;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const from = SUN.r + 20;
  const to = SUN.r + 46;
  return `<line x1="${(SUN.cx + cos * from).toFixed(1)}" y1="${(SUN.cy + sin * from).toFixed(1)}" x2="${(SUN.cx + cos * to).toFixed(1)}" y2="${(SUN.cy + sin * to).toFixed(1)}"/>`;
}).join("");

// rounded: زوايا مدوّرة. scale: حجم الرسمة (الأيقونات maskable لازم تكون أصغر عشان ما تنقص)
function iconSvg({ rounded, scale }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1e3a8a"/>
      <stop offset="1" stop-color="#0b1020"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="url(#bg)"/>
  <g transform="translate(256 256) scale(${scale}) translate(-248 -228)">
    <g stroke="#fde047" stroke-width="16" stroke-linecap="round">${rays}</g>
    <circle cx="${SUN.cx}" cy="${SUN.cy}" r="${SUN.r}" fill="#fde047"/>
    <g fill="#e2e8f0">
      <circle cx="230" cy="322" r="58"/>
      <circle cx="300" cy="292" r="78"/>
      <circle cx="370" cy="332" r="54"/>
      <rect x="228" y="320" width="172" height="64" rx="32"/>
    </g>
  </g>
</svg>`;
}

async function writePng(svg, size, path) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path);
  console.log("wrote", path);
}

mkdirSync("public/icons", { recursive: true });

const regular = iconSvg({ rounded: true, scale: 0.95 });
const maskable = iconSvg({ rounded: false, scale: 0.7 });
const apple = iconSvg({ rounded: false, scale: 0.85 });

writeFileSync("src/app/icon.svg", regular); // favicon
await writePng(regular, 192, "public/icons/icon-192.png");
await writePng(regular, 512, "public/icons/icon-512.png");
await writePng(maskable, 512, "public/icons/icon-maskable-512.png");
await writePng(apple, 180, "src/app/apple-icon.png");