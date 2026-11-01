import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";

// الرئيسية فقط: صفحات المدن noindex عن قصد
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, changeFrequency: "daily", priority: 1 }];
}
