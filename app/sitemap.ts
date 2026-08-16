import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/pazaryeri-kar-hesaplama", changeFrequency: "weekly", priority: 0.95 },
  { path: "/trendyol-komisyon-hesaplama", changeFrequency: "weekly", priority: 0.95 },
  { path: "/trendyol-kar-hesaplama", changeFrequency: "weekly", priority: 0.85 },
  { path: "/hepsiburada-komisyon-hesaplama", changeFrequency: "weekly", priority: 0.85 },
  { path: "/shopier-komisyon-hesaplama", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pazaryeri-komisyon-oranlari", changeFrequency: "weekly", priority: 0.85 },
  { path: "/trendyol-giyim-komisyon-hesaplama", changeFrequency: "weekly", priority: 0.75 },
  { path: "/trendyol-elektronik-komisyon-hesaplama", changeFrequency: "weekly", priority: 0.75 },
  { path: "/hepsiburada-giyim-komisyon-hesaplama", changeFrequency: "weekly", priority: 0.75 },
  { path: "/hepsiburada-elektronik-komisyon-hesaplama", changeFrequency: "weekly", priority: 0.75 },
  { path: "/duyuru", changeFrequency: "weekly", priority: 0.7 },
  { path: "/gizlilik-politikasi", changeFrequency: "yearly", priority: 0.3 },
  { path: "/kullanim-sartlari", changeFrequency: "yearly", priority: 0.3 },
  { path: "/yasal-bilgilendirme", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
