import { cargoData } from "@/data/cargoData";
import {
  getTrendyolKargoExclVat,
  trendyolKargoToInclVat,
  type TrendyolCarrierId,
} from "@/lib/trendyolKargo";
import type { MarketplacePlatform } from "@/types/profit";

const TRENDYOL_AVG_CARRIERS: TrendyolCarrierId[] = ["aras", "yurtici", "kolayGelsin"];

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

/**
 * KDV dahil kargo maliyeti (₺).
 * carrierKey: "average" | firma anahtarı (Trendyol: trendyolKargo id, HB: cargoData anahtarı)
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
    const tables = cargoData.hepsiburada;
    const table = tables[carrierKey];
    if (!table) return null;
    const v = table[d];
    if (typeof v === "number" && v > 0) return v;
    const nearest = table[d] ?? table[Math.min(d, 5)] ?? table[1];
    return typeof nearest === "number" ? nearest : null;
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
  return [
    { id: "average", label: "Ortalama fiyat (önerilen)" },
    { id: "aras", label: "Aras" },
    { id: "dhl", label: "DHL" },
    { id: "hepsiJet", label: "HepsiJet" },
    { id: "kolayGelsin", label: "Kolay Gelsin" },
    { id: "ptt", label: "PTT" },
    { id: "surat", label: "Sürat" },
    { id: "yurtici", label: "Yurtiçi" },
  ];
}

export const MAX_DESI_OPTION = 33;
