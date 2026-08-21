export interface Announcement {
  /** URL slug — /duyuru/[slug] */
  slug: string;
  platform: "trendyol" | "hepsiburada" | "shopier" | "n11" | "pttavm" | "genel";
  /** Kısa, paylaşılabilir başlık. Örn: "Trendyol elektronikte komisyon %2 düştü" */
  title: string;
  /** 1-2 cümlelik açıklama */
  summary: string;
  /** ISO tarih, örn. "2026-09-01" */
  date: string;
  /** İlgili rehber/kategori sayfasına link (varsa) */
  relatedGuideHref?: string;
}

/**
 * "İlk haber veren" duyuru altyapısı için içerik.
 *
 * ÖNEMLİ: Sadece GERÇEK, doğrulanmış oran/kural değişiklikleri eklenmeli — uydurma
 * veya spekülatif "değişti" haberi asla eklenmemeli. Trendyol/Hepsiburada satıcı
 * panelinden veya resmi bildirimlerden gelen bir değişikliği gördüğün an buraya
 * ekle; dizi boşken /duyuru sayfası boş durum mesajı gösterir.
 *
 * Slug önerisi: "platform-kategori-ay-yil", örn. "trendyol-elektronik-eylul-2026".
 */
export const ANNOUNCEMENTS: Announcement[] = [
  // {
  //   slug: "trendyol-elektronik-eylul-2026",
  //   platform: "trendyol",
  //   title: "Trendyol elektronik aksesuarda komisyon %2 düştü",
  //   summary: "Eylül 2026 itibarıyla elektronik aksesuar alt kategorisinde komisyon oranı güncellendi.",
  //   date: "2026-09-01",
  //   relatedGuideHref: "/trendyol-elektronik-komisyon-hesaplama",
  // },
];

export function getAnnouncementBySlug(slug: string): Announcement | undefined {
  return ANNOUNCEMENTS.find((a) => a.slug === slug);
}

export function getAllAnnouncements(): Announcement[] {
  return [...ANNOUNCEMENTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}
