import {
  getHepsiburadaKargoExclVat,
  hepsiburadaKargoToInclVat,
  type HepsiburadaCarrierId,
} from "@/lib/hepsiburadaKargo";
import {
  getN11KargoExclVat,
  n11AverageKargoInclVat,
  n11KargoToInclVat,
  type N11CarrierId,
} from "@/lib/n11Kargo";
import {
  getShopierKargo,
  shopierAverageKargo,
  type ShopierCarrierId,
} from "@/lib/shopierKargo";
import {
  getTrendyolKargoExclVat,
  trendyolKargoToInclVat,
  type TrendyolCarrierId,
} from "@/lib/trendyolKargo";
import type { MarketplacePlatform } from "@/types/profit";

const TRENDYOL_AVG_CARRIERS: TrendyolCarrierId[] = ["aras", "yurtici", "kolayGelsin"];
const HEPSIBURADA_AVG_CARRIERS: HepsiburadaCarrierId[] = ["aras", "yurtici", "hepsiJet"];

function trendyolAverageInclVat(desi: number): number | null {
  const d = Math.round(Math.max(0, desi));
  const vals: number[] = [];
  for (const c of TRENDYOL_AVG_CARRIERS) {
    const ex = getTrendyolKargoExclVat(d, c);
    if (ex != null) vals.push(trendyolKargoToInclVat(ex));
  }
  if (vals.length === 0) return null;
  const sum = vals.reduce((a, b) => a + b, 0);
  return Math.round((sum / vals.length) * 100) / 100;
}

function hepsiburadaAverageInclVat(desi: number): number | null {
  const d = Math.round(Math.max(0, desi));
  const vals: number[] = [];
  for (const c of HEPSIBURADA_AVG_CARRIERS) {
    const ex = getHepsiburadaKargoExclVat(d, c);
    if (ex != null) vals.push(hepsiburadaKargoToInclVat(ex));
  }
  if (vals.length === 0) return null;
  const sum = vals.reduce((a, b) => a + b, 0);
  return Math.round((sum / vals.length) * 100) / 100;
}

/**
 * KDV dahil / panel kargo maliyeti (₺).
 * carrierKey: "average" | firma anahtarı
 */
export function getCargoPrice(
  platform: MarketplacePlatform,
  carrierKey: string,
  desi: number
): number | null {
  const d = Math.round(Math.max(0, desi));

  if (platform === "trendyol") {
    if (carrierKey === "average") {
      return trendyolAverageInclVat(d);
    }
    const excl = getTrendyolKargoExclVat(d, carrierKey as TrendyolCarrierId);
    return excl != null ? trendyolKargoToInclVat(excl) : null;
  }

  if (platform === "hepsiburada") {
    if (carrierKey === "average") {
      return hepsiburadaAverageInclVat(d);
    }
    const excl = getHepsiburadaKargoExclVat(d, carrierKey as HepsiburadaCarrierId);
    return excl != null ? hepsiburadaKargoToInclVat(excl) : null;
  }

  if (platform === "shopier") {
    if (carrierKey === "average") {
      return shopierAverageKargo(d);
    }
    return getShopierKargo(d, carrierKey as ShopierCarrierId);
  }

  if (platform === "n11") {
    if (carrierKey === "average") {
      return n11AverageKargoInclVat(d);
    }
    const excl = getN11KargoExclVat(d, carrierKey as N11CarrierId);
    return excl != null ? n11KargoToInclVat(excl) : null;
  }

  return null;
}

export function listCargoCarriers(platform: MarketplacePlatform): { id: string; label: string }[] {
  if (platform === "trendyol") {
    return [
      { id: "average", label: "Ortalama fiyat (önerilen)" },
      { id: "aras", label: "Aras" },
      { id: "dhl", label: "DHL eCommerce" },
      { id: "kolayGelsin", label: "Kolay Gelsin" },
      { id: "ptt", label: "PTT" },
      { id: "surat", label: "Sürat" },
      { id: "tex", label: "TEX" },
      { id: "yurtici", label: "Yurtiçi" },
      { id: "cevaTedarik", label: "CEVA Tedarik" },
      { id: "ceva", label: "CEVA" },
      { id: "horoz", label: "Horoz" },
    ];
  }
  if (platform === "hepsiburada") {
    return [
      { id: "average", label: "Ortalama fiyat (önerilen)" },
      { id: "aras", label: "Aras" },
      { id: "dhl", label: "DHL" },
      { id: "hepsiJet", label: "HepsiJet" },
      { id: "kolayGelsin", label: "Kolay Gelsin" },
      { id: "ptt", label: "PTT" },
      { id: "surat", label: "Sürat" },
      { id: "yurtici", label: "Yurtiçi" },
      { id: "cevaTedarik", label: "CEVA Tedarik" },
      { id: "ceva", label: "CEVA Lojistik" },
      { id: "hepsiJetXl", label: "HepsiJet XL" },
      { id: "horoz", label: "Horoz" },
    ];
  }
  if (platform === "shopier") {
    return [
      { id: "average", label: "Ortalama fiyat (önerilen)" },
      { id: "ptt", label: "PTT Kargo" },
      { id: "dhl", label: "MNG (DHL eCommerce)" },
      { id: "yurtici", label: "Yurtiçi Kargo" },
    ];
  }
  if (platform === "n11") {
    return [
      { id: "average", label: "Ortalama fiyat (önerilen)" },
      { id: "aras", label: "Aras Kargo" },
      { id: "surat", label: "Sürat Kargo" },
      { id: "ptt", label: "PTT Kargo" },
      { id: "yurtici", label: "Yurtiçi Kargo" },
      { id: "kolayGelsin", label: "Kolay Gelsin" },
      { id: "dhl", label: "DHL e-Commerce" },
    ];
  }
  return [{ id: "average", label: "Elle girilecek" }];
}

export const MAX_DESI_OPTION = 33;

/** Platforma göre desi seçenek üst sınırı (Shopier panel 0–12) */
export function maxDesiForPlatform(platform: MarketplacePlatform): number {
  if (platform === "shopier") return 12;
  return MAX_DESI_OPTION;
}
