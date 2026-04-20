import type { MarketplacePlatform } from "@/types/profit";

/**
 * Kategori bazlı komisyon oranları (%).
 *
 * TODO: Gerçek komisyon verileri (PDF / satıcı paneli) buraya işlenecek — şimdilik örnek kategoriler.
 */
export const commissionRates: Record<
  MarketplacePlatform,
  Record<string, number>
> = {
  trendyol: {
    Moda: 20,
    "Ayakkabı & Çanta": 20,
    Elektronik: 12,
    Kozmetik: 15,
    "Ev & Yaşam": 18,
    "Anne & Bebek": 15,
    Süpermarket: 10,
    Spor: 18,
    Kitap: 12,
    Oyuncak: 15,
  },
  /** Eski düz liste — yeni kategoriler için `commissionCategories.ts` kullanın */
  hepsiburada: {},
};
