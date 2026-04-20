import { platformDefaults } from "@/data/platformDefaults";
import { getPaymentFeeRateByOrderAmount } from "@/lib/getPaymentFeeTier";
import type { ProfitInputs } from "@/types/profit";

const hb = platformDefaults.hepsiburada;

/** Varsayılan platform: Hepsiburada; sabit/oran alanları platform profiliyle başlar (manuel düzenlenebilir) */
export const DEFAULT_PROFIT_INPUTS: ProfitInputs = {
  platform: "hepsiburada",
  commissionCategoryId: "",
  calculationMode: "sheet",
  feePercentBase: "discountedPrice",
  purchasePrice: 0,
  salePrice: 0,
  commissionRate: 0,
  kargo: 0,
  paketleme: hb.packaging,
  hizmetBedeli: hb.serviceFee,
  stopajRate: hb.stopajRate,
  advertisingRate: hb.advertisingRate,
  paymentFeeRate: getPaymentFeeRateByOrderAmount(0),
  otherFixed: hb.otherFixed,
  listingFee: hb.listingFee,
  warehouseShippingFee: hb.warehouseShippingFee,
  customerPaysShipping: false,
  discountRate: 0,
  fourForThree: false,
  returnRate: 0,
  vatRate: 0,
};
