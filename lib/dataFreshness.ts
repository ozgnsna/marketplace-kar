/**
 * Komisyon veri setlerinin (Trendyol/Hepsiburada TSV kaynakları) en son doğrulandığı tarih.
 *
 * Trendyol/Hepsiburada'dan gelen bir komisyon güncellemesini `data/*-commission-source.tsv`
 * dosyalarına işlediğinde bu tarihi de güncelle — sitedeki "verilerimiz güncel" güven
 * rozetinin tek kaynağı burası. Elle güncellenir, otomatik değildir.
 */
export const COMMISSION_DATA_UPDATED_AT = "2026-08-21";

export function formatDataFreshnessLabel(): string {
  const d = new Date(COMMISSION_DATA_UPDATED_AT);
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}
