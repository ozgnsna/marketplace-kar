/**
 * PttAVM anlaşmalı kargo (panel PDF, 21.08.2026).
 * Kaynak tutarlar KDV/ek ücret netliği belirsiz; TY/HB/N11 ile uyum için formda × 1,20.
 */

import { calculatePttavmShippingFee } from "@/data/pttavmKargoFiyatlari";

export const PTTAVM_CARGO_NOTE =
  "Kaynak: PttAVM Kargo Fiyatları PDF (21 Ağustos 2026). Tek taşıyıcı (PttAVM lojistik). Tablo tutarlarına KDV eklenerek forma yazılır; panelinizdeki nihai fatura ile teyit edin.";

export function pttavmKargoToInclVat(excl: number): number {
  return Math.round(excl * 1.2 * 100) / 100;
}

export function getPttavmKargoExclVat(desi: number): number | null {
  return calculatePttavmShippingFee(desi);
}

export function getPttavmKargoInclVat(desi: number): number | null {
  const excl = getPttavmKargoExclVat(desi);
  return excl != null ? pttavmKargoToInclVat(excl) : null;
}
