/**
 * N11 kargo kampanya sayfasındaki (https://www.n11.com/kampanyalar/ozel-kargo-kampanyasi,
 * 21.08.2026) diğer tablolar — ana desi/kg fiyat tablosuna (`n11KargoFiyatlari.ts`)
 * girmeyen ek ücretler. Veri az ve düzensiz (her firmanın kendi tablo şekli var)
 * olduğu için TSV/build-script pipeline'ı yerine doğrudan burada tutuluyor;
 * güncellendiğinde elle düzenlenmesi yeterli.
 */

/** Alternatif taşıyıcılar: desi/kg tablosu yerine minimum taşıma bedeli + birim fiyat üzerinden çalışırlar */
export const N11_KARGO_MINIMUM_TASIMA_BEDELI = {
  horozLojistik: {
    label: "Horoz Lojistik",
    minimumBedelSehirIci: 676.72,
    minimumBedelSehirDisi: 676.72,
    desiKgBirimFiyatiSehirIci: 13.46,
    desiKgBirimFiyatiSehirDisi: 15.79,
  },
  cevaTedarikZinciri: {
    label: "Ceva Tedarik Zinciri",
    minimumBedelSehirIci: 489.73,
    minimumBedelSehirDisi: 489.73,
    desiKgBirimFiyatiSehirIci: 11.48,
    desiKgBirimFiyatiSehirDisi: 15.57,
  },
  cevaLojistik: {
    label: "Ceva Lojistik",
    minimumBedelSehirIci: 716.62,
    minimumBedelSehirDisi: 716.62,
    desiKgBirimFiyatiSehirIci: 14.55,
    desiKgBirimFiyatiSehirDisi: 15.57,
  },
} as const;

/**
 * Sepet (sipariş) tutarına göre kademeli sabit kargo ücreti — kaynak sayfada
 * sadece 2 kademe görüntülendi (sayfa muhtemelen daha fazlasını, ör. scroll ile
 * gösteriyor olabilir; N11 tarafında teyit edilmeli).
 */
export const N11_KARGO_SEPET_ARALIGI = [
  { aralik: "0-149,99 TL", ptt: 38.74, aras: 48.33, surat: 54.58, kolayGelsin: 55.83, dhl: 57.08, yurtici: 83.33 },
  { aralik: "149,99-299,99 TL", ptt: 70.41, aras: 79.16, surat: 85.41, kolayGelsin: 86.66, dhl: 87.91, yurtici: 113.33 },
] as const;

/** Başarısız teslimat durumunda gönderi maliyetinin yüzde kaçının kesileceği */
export const N11_KARGO_BASARISIZ_TESLIMAT_ORANI: Record<string, string> = {
  yurtici: "%50",
  aras: "%50",
  surat: "%50",
  dhl: "%100",
  ptt: "%30",
  kolayGelsinSendeo: "%50",
  cevaTedarikZinciri: "%50",
  horozLojistik: "%100",
  cevaLojistik: "%100",
};

/** Ağır kargo (desi/kg) eşiği — bu değerin üzerinde farklı fiyatlandırma uygulanabilir. "-" = veri yok/uygulanmıyor */
export const N11_KARGO_AGIR_KARGO_ESIGI: Record<string, number | null> = {
  yurtici: 5350,
  aras: 4250,
  surat: 4500,
  dhl: 6750,
  ptt: 3000,
  kolayGelsinSendeo: 5000,
  cevaTedarikZinciri: null,
  horozLojistik: null,
  cevaLojistik: null,
};
