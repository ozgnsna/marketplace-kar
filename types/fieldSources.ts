/** Hesap dökümünde ve formlarda otomatik / manuel kaynağı göstermek için */
export type FieldSourceTag =
  | "auto"
  | "manual"
  | "category"
  | "platform_default"
  | "cargo_auto";

export type TrackedInputKey =
  | "commissionRate"
  | "paymentFeeRate"
  | "stopajRate"
  | "advertisingRate"
  | "kargo"
  | "paketleme"
  | "hizmetBedeli"
  | "listingFee"
  | "warehouseShippingFee"
  | "otherFixed";

export const TRACKED_INPUT_KEYS: ReadonlySet<string> = new Set<TrackedInputKey>([
  "commissionRate",
  "paymentFeeRate",
  "stopajRate",
  "advertisingRate",
  "kargo",
  "paketleme",
  "hizmetBedeli",
  "listingFee",
  "warehouseShippingFee",
  "otherFixed",
]);
