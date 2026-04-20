/**
 * Türkçe arama için metin normalizasyonu (küçük harf, aksanları sadeleştirme).
 */
export function normalizeSearchText(input: string): string {
  return input
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}
