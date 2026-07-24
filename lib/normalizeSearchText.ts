/**
 * Türkçe arama için metin normalizasyonu.
 * tr-TR küçük harfte I→ı olduğu için ASCII i/ı birleştirilir (iphone ↔ Iphone).
 */
export function normalizeSearchText(input: string): string {
  return input
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i");
}
