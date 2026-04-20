import type { MarketplacePlatform } from "@/types/profit";

/** Sabit ₺ ve % oranları — formda otomatik doldurma için başlangıç profili */
export type PlatformDefaultProfile = {
  serviceFee: number;
  packaging: number;
  stopajRate: number;
  paymentFeeRate: number;
  advertisingRate: number;
  listingFee: number;
  warehouseShippingFee: number;
  otherFixed: number;
};

/**
 * Platform varsayılan gider profili.
 * TODO: Hepsiburada gerçek sabit gider profili buraya yazılacak.
 */
export const platformDefaults: Record<MarketplacePlatform, PlatformDefaultProfile> = {
  trendyol: {
    /** Sipariş bazlı platform hizmet bedeli (satıcı paneli / sözleşmeye göre güncellenir) */
    serviceFee: 13.19,
    packaging: 0,
    stopajRate: 1,
    paymentFeeRate: 1.2,
    advertisingRate: 0,
    listingFee: 0,
    warehouseShippingFee: 0,
    otherFixed: 0,
  },
  hepsiburada: {
    serviceFee: 12.6,
    packaging: 2.5,
    stopajRate: 1,
    paymentFeeRate: 1.5,
    advertisingRate: 0,
    listingFee: 0,
    warehouseShippingFee: 0,
    otherFixed: 0,
  },
};

export const PLATFORM_DEFAULTS_PLACEHOLDER =
  "TODO: gerçek HB sabit gider profili ve TY kesintileri buradan güncellenecek";
