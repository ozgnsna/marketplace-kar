import type { FieldSourceTag, TrackedInputKey } from "@/types/fieldSources";
import type { ProfitResult } from "@/types/profit";

export type EnrichedBreakdownRow = {
  label: string;
  amount: number;
  description: string;
  sourceTag?: FieldSourceTag;
};

/** Etiket → alan anahtarı (sheet / cashflow farklı etiketler için) */
function labelToKey(label: string): TrackedInputKey | "purchasePrice" | "returnRate" | null {
  const map: Record<string, TrackedInputKey | "purchasePrice" | "returnRate"> = {
    "Komisyon tutarı": "commissionRate",
    Komisyon: "commissionRate",
    "Tahsilat yönetim bedeli": "paymentFeeRate",
    "Tahsilat yönetim / işlem": "paymentFeeRate",
    "MP stopaj": "stopajRate",
    Stopaj: "stopajRate",
    "Reklam / görünürlük": "advertisingRate",
    "Hizmet bedeli": "hizmetBedeli",
    "Kargo bedeli": "kargo",
    "Kargo (müşteri ödüyor)": "kargo",
    Paketleme: "paketleme",
    "Listeleme / vitrin bedeli": "listingFee",
    "Listeleme / vitrin": "listingFee",
    "Depoya gönderim": "warehouseShippingFee",
    "Diğer sabit": "otherFixed",
    "Diğer sabit giderler": "otherFixed",
    "Alış (KDV dahil)": "purchasePrice",
    "Alış fiyatı (KDV dahil)": "purchasePrice",
    "İade / risk payı (liste üzerinden)": "returnRate",
    "İade oranı (net kâra etki)": "returnRate",
  };
  return map[label] ?? null;
}

const DESCRIPTIONS: Record<string, string> = {
  "Komisyon tutarı": "Liste fiyatı üzerinden uygulanan pazaryeri komisyon kesintisi.",
  Komisyon: "Seçilen matrah üzerinden uygulanan komisyon tutarı.",
  "Tahsilat yönetim bedeli":
    "Ödeme / tahsilat işlem ücreti (oran × matrah). Sipariş tutarına göre kademeli oran uygulanabilir.",
  "Tahsilat yönetim / işlem":
    "Ödeme altyapısı ve tahsilat yönetim kesintisi. Sipariş tutarına göre kademeli oran uygulanabilir.",
  "MP stopaj": "Mal platformu stopajı (oran × matrah).",
  Stopaj: "Stopaj kesintisi.",
  "Reklam / görünürlük": "Reklam veya görünürlük payı (oran × matrah).",
  "Hizmet bedeli": "Pazaryeri sabit veya işlem bazlı hizmet bedeli.",
  "Kargo bedeli": "Satıcıya yansıyan kargo maliyeti (KDV dahil).",
  "Kargo (müşteri ödüyor)": "Kargo müşteri tarafından ödendiği için satıcı gideri 0 kabul edilir.",
  Paketleme: "Ambalaj ve paketleme maliyeti.",
  "Listeleme / vitrin bedeli": "Listeleme veya vitrin ücreti.",
  "Listeleme / vitrin": "Listeleme veya vitrin ücreti.",
  "Depoya gönderim": "Depoya sevkiyat veya giriş bedeli.",
  "Diğer sabit": "Diğer sabit gider kalemleri.",
  "Diğer sabit giderler": "Ek sabit giderler.",
  "İade / risk payı (liste üzerinden)": "İade ve risk için liste fiyatı üzerinden ayrılan pay.",
  "Alış (KDV dahil)": "Ürün maliyeti (KDV dahil).",
  "Alış fiyatı (KDV dahil)": "Ürün maliyeti (KDV dahil).",
};

function sourceLabel(tag: FieldSourceTag | undefined): string {
  if (!tag) return "";
  switch (tag) {
    case "manual":
      return "Manuel";
    case "category":
      return "Kategoriye göre";
    case "platform_default":
      return "Platform varsayılanı";
    case "cargo_auto":
      return "Otomatik";
    case "auto":
      return "Otomatik";
    default:
      return "";
  }
}

export function enrichBreakdown(
  result: ProfitResult,
  sources: Partial<Record<TrackedInputKey | "purchasePrice", FieldSourceTag>>
): EnrichedBreakdownRow[] {
  return result.breakdown.map((row) => {
    const key = labelToKey(row.label);
    const tag = key && key in sources ? sources[key as TrackedInputKey] : undefined;
    const description = DESCRIPTIONS[row.label] ?? "Gider kalemi.";
    return {
      label: row.label,
      amount: row.amount,
      description,
      sourceTag: tag,
    };
  });
}

export { sourceLabel };
