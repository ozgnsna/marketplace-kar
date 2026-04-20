import { platformDefaults } from "@/data/platformDefaults";
import { getPaymentFeeRateByOrderAmount } from "@/lib/getPaymentFeeTier";
import type { MarketplacePlatform } from "@/types/profit";
import type { ProfitInputs } from "@/types/profit";

export function getPlatformDefaults(platform: MarketplacePlatform) {
  return platformDefaults[platform];
}

/** Otomatik doldurma için kısmi patch (mevcut inputları ezmeden birleştirmek için) */
export function applyPlatformDefaultsToInputs(
  platform: MarketplacePlatform,
  prev: ProfitInputs
): ProfitInputs {
  const d = getPlatformDefaults(platform);
  return {
    ...prev,
    platform,
    hizmetBedeli: d.serviceFee,
    paketleme: d.packaging,
    stopajRate: d.stopajRate,
    paymentFeeRate: getPaymentFeeRateByOrderAmount(prev.salePrice),
    advertisingRate: d.advertisingRate,
    listingFee: d.listingFee,
    warehouseShippingFee: d.warehouseShippingFee,
    otherFixed: d.otherFixed,
  };
}
