/**
 * PDF / tablo metninden kalan Hepsiburada başlık kalıntılarını kaldırır.
 * Komisyon oranı zaten KDV dahil listelerden gelir; "(+KDV)" satırda yineleyici gürültüdür.
 */
export function stripCommissionPathNoise(path: string): string {
  let p = path.trim();
  p = p.replace(/^(\+?\d+\s*)?(i̇ş|iş|İş)\s+günü\s*/i, "");
  p = p.replace(
    /^\(\+KDV\)\s*Marka\s+Marka\s+Kategori\s+Komisyon\s*\(\+KDV\)\s*Vade\s+/i,
    ""
  );
  p = p.replace(/^\(\+KDV\)\s*Marka\s+Marka\s+Kategori\s+Komisyon\s+Vade\s+/i, "");
  p = p.replace(/^Marka\s+Marka\s+Kategori\s+Komisyon\s*\(\+KDV\)\s*Vade\s+/i, "");
  p = p.replace(/^Marka\s+Marka\s+Kategori\s+Komisyon\s+Vade\s+/i, "");
  p = p.replace(/^Marka\s+Marka\s+Kategori\s+Komisyon\s+/i, "");
  p = p.replace(/^\(\+KDV\)\s*Vade\s+/i, "");
  p = p.replace(/^\(\+KDV\)\s*/g, "");
  p = p.replace(/^Vade\s+/i, "");
  return p.replace(/\s+/g, " ").trim();
}
