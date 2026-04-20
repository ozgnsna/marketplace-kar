export type MarketplacePlatform = "trendyol" | "hepsiburada";

/** E-tablo: liste matrahı + risk satırı. Basit: indirimli satış üzerinden çarpan iade. */
export type CalculationMode = "sheet" | "cashflow";

/** % kesintilerin matrahı (sadece cashflow modunda anlamlı; sheet modunda her zaman liste) */
export type FeePercentBase = "listPrice" | "discountedPrice";

export interface ProfitInputs {
  platform: MarketplacePlatform;
  /** data/commissionCategories.ts kayıt id (ty-* / hb-*); boşsa komisyon manuel */
  commissionCategoryId: string;
  calculationMode: CalculationMode;
  feePercentBase: FeePercentBase;

  /** Maliyet: doğrudan TL KDV dahil */
  purchasePrice: number;

  /** Liste / satış fiyatı (₺) */
  salePrice: number;

  commissionRate: number;
  kargo: number;
  paketleme: number;
  hizmetBedeli: number;
  stopajRate: number;
  advertisingRate: number;
  /** Tahsilat yönetim / ödeme işlem */
  paymentFeeRate: number;
  otherFixed: number;
  /** Listeleme / vitrin bedeli (KDV dahil, ₺) */
  listingFee: number;
  /** Depoya gönderim (KDV dahil, ₺) */
  warehouseShippingFee: number;
  customerPaysShipping: boolean;

  discountRate: number;
  fourForThree: boolean;
  /** İade veya risk: sheet modunda liste üzerinden gider satırı; cashflow modunda net kâra çarpan */
  returnRate: number;

  /** KDV oranı — sadece KDV ayrıştırması için (örn. 20) */
  vatRate: number;
}

export interface ExpenseBreakdownItem {
  label: string;
  amount: number;
}

/** KDV dahil tutarlardan tahmini ayrıştırma (mali müşavirlik yerine geçmez) */
export interface VatDetailEstimate {
  vatRate: number;
  saleVat: number;
  purchaseVat: number;
  shippingVat: number;
  commissionVat: number;
  /** Kaba tahmin: satış KDV − (alış + kargo) indirilebilir KDV */
  netVatPositionEstimate: number;
}

export interface ProfitResult {
  calculationMode: CalculationMode;
  listPrice: number;
  customerPriceAfterDiscount: number;
  netCollection?: number;
  effectiveSalePrice: number;
  priceAfterDiscount: number;
  commission: number;
  stopaj: number;
  advertising: number;
  paymentFee: number;
  returnRiskAmount: number;
  totalExpenses: number;
  breakdown: ExpenseBreakdownItem[];
  profitBeforeReturns: number;
  netProfit: number;
  profitMarginPercent: number;
  marginOnCostPercent: number;
  /** NeSatılır benzeri: net kâr / alış (yatırım geri dönüş) */
  roiOnCostPercent: number;
  vatDetail?: VatDetailEstimate;
  isLoss: boolean;
}
