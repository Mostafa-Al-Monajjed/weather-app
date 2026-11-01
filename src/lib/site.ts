export const siteName = "Skycast";
export const siteAuthor = "Mustafa Al-Munajjed";
export const siteDescription =
  "Live weather for any city, with a sky that matches the conditions.";

// رابط الموقع: من Vercel تلقائيًا، أو من SITE_URL لو ربطت دومين خاص (بدون / بالنهاية)
const rawUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteUrl = rawUrl.replace(/\/+$/, "");
