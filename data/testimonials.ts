export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  sector: string;
}

/**
 * Gerçek satıcı yorumları buraya eklenecek.
 *
 * ÖNEMLİ: Sahte / uydurma yorum EKLENMEMELİDİR — bu hem yanıltıcı reklam olur
 * hem de tespit edilirse markaya güven kaybı olarak geri döner. TrendSatıcı
 * karşılaştırmasında vurgulandığı gibi, isim + şehir + sektör ile birlikte gelen
 * GERÇEK yorumlar güven yaratıyor.
 *
 * Nereden toplanır: kendi Trendyol/Hepsiburada satıcı çevrenden, satıcı
 * gruplarından (Facebook/WhatsApp) 3-5 kısa yorum iste. Onay aldıktan sonra
 * aşağıya ekle — dizi boşken Testimonials bileşeni hiçbir şey render etmez.
 */
export const TESTIMONIALS: Testimonial[] = [
  // {
  //   quote: "Kargo ve komisyonu birlikte görünce hangi üründe gerçekten kazandığımı ilk kez net gördüm.",
  //   name: "Ayşe K.",
  //   location: "İzmir",
  //   sector: "Giyim",
  // },
];
