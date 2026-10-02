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
  {
    slug: "hepsiburada-kargo-ekim-2026",
    platform: "hepsiburada",
    title: "Hepsiburada anlaşmalı kargo fiyatları güncellendi",
    summary:
      "5 Ekim 2026 itibarıyla geçerli yeni kargo tablosu yayında. HepsiJet, CEVA ve Horoz başta olmak üzere birçok desi kademesinde artış var; hesaplayıcıdaki Hepsiburada kargo alanına yansıtıldı.",
    date: "2026-10-05",
    relatedGuideHref: "/hepsiburada-komisyon-hesaplama",
  },
];

export function getAnnouncementBySlug(slug: string): Announcement | undefined {
  return ANNOUNCEMENTS.find((a) => a.slug === slug);
}

export function getAllAnnouncements(): Announcement[] {
  return [...ANNOUNCEMENTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}
