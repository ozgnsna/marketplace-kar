import type { ProfitInputs } from "@/types/profit";

/**
 * Hesaplama türü için akıllı öneri (otomatik mod değişikliği yapmaz).
 * `salePrice` müşterinin ödediği efektif tutar olmalı (indirim ve 4 al 3 öde sonrası).
 */
export type RecommendedModeKind = "list" | "discount";

/** `calculateProfit` ile aynı mantık: kampanyalı efektif satış fiyatı */
export function computeEffectiveCustomerPrice(
  inputs: Pick<ProfitInputs, "salePrice" | "discountRate" | "fourForThree">
): number {
  const sale = Math.max(0, inputs.salePrice);
  const dr = Math.max(0, inputs.discountRate);
  const priceAfterDiscount = dr > 0 ? sale * (1 - dr / 100) : sale;
  return inputs.fourForThree ? priceAfterDiscount * 0.75 : priceAfterDiscount;
}

export function getRecommendedMode({
  listPrice,
  salePrice,
  discountRate,
}: {
  /** Listede görünen / nominal liste fiyatı */
  listPrice: number;
  /** Kampanya ve indirim sonrası müşterinin ödediği efektif tutar */
  salePrice: number;
  /** İndirim oranı % (0 ise indirim yok) */
  discountRate: number;
}): RecommendedModeKind {
  const dr = Math.max(0, discountRate);
  if (dr > 0) return "discount";

  const list = Math.max(0, listPrice);
  const sale = Math.max(0, salePrice);
  if (list <= 0) return "list";

  const relDiff = Math.abs(list - sale) / list;
  if (relDiff > 0.0005) return "discount";

  return "list";
}
