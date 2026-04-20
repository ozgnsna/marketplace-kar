export type ProfitHealthStatus = "zarar" | "dusuk_kar" | "iyi";

export interface ProfitStatusResult {
  status: ProfitHealthStatus;
  label: string;
  message: string;
  recommendation: string;
}

const LOW_MARGIN_THRESHOLD = 10;

/**
 * Net kâr ve satış marjına göre yorum + aksiyon metinleri (UI için).
 * Marj: sonuçtaki kâr marjı % (satış / liste matrahına göre).
 */
export function getProfitStatus({
  netProfit,
  profitMarginPercent,
}: {
  netProfit: number;
  profitMarginPercent: number;
}): ProfitStatusResult {
  const margin = Number.isFinite(profitMarginPercent) ? profitMarginPercent : 0;

  if (netProfit < 0) {
    return {
      status: "zarar",
      label: "Zarar ediyorsun",
      message: "Bu satış mevcut maliyetlerle zarar ettiriyor.",
      recommendation:
        "Öneri: Satış fiyatını artırın, kargo maliyetini düşürün veya komisyon/kesinti oranlarını yeniden kontrol edin.",
    };
  }

  if (margin < LOW_MARGIN_THRESHOLD) {
    return {
      status: "dusuk_kar",
      label: "Kâr çok düşük",
      message: "Satış kârlı görünüyor ama marj oldukça düşük.",
      recommendation:
        "Öneri: Daha güvenli marj için satış fiyatını bir miktar artırmayı değerlendirin.",
    };
  }

  return {
    status: "iyi",
    label: "Bu ürün kârlı",
    message: "Bu satış sağlıklı bir kâr bırakıyor.",
    recommendation: "Öneri: Mevcut fiyat yapısı korunabilir.",
  };
}

export function shouldEmphasizeTargetPrice(status: ProfitHealthStatus): boolean {
  return status === "zarar" || status === "dusuk_kar";
}
