import { GuideCta } from "@/components/seo/GuideCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { pageMetadata } from "@/lib/seoMetadata";
import { SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Hepsiburada Giyim Komisyon Hesaplama 2026 — Net Kâr Rehberi",
  description:
    "Hepsiburada'da giyim ve spor giyim kategorisi komisyon oranı, kargo ve iade dahil net kâr hesaplama rehberi.",
  path: "/hepsiburada-giyim-komisyon-hesaplama",
  keywords: [
    "hepsiburada giyim komisyon hesaplama",
    "hepsiburada giyim komisyon oranı",
    "hepsiburada komisyon hesaplama",
    "pazaryeri kar hesaplama",
  ],
});

const faq = [
  {
    q: "Hepsiburada'da giyim kategorisinin komisyon oranı kaç?",
    a: "Giyim ana kategorisi (bluz, etek, ceket, pantolon, gömlek, tişört, çocuk giyim, iç/üst/alt giyim, çoraplar) ve spor giyim & ayakkabı alt kategorileri, örnek veri setimizde aynı komisyon bandında görünüyor. Kesin oranı ürününüzün alt kategorisine göre hesaplayıcıdan doğrulayın; Hepsiburada oranları dönem dönem günceller.",
  },
  {
    q: "Hepsiburada'da Trendyol'a göre giyim komisyonu farklı mı?",
    a: "Evet, iki platformun komisyon tarifeleri birbirinden bağımsızdır ve aynı ürün grubu için farklı oranlar uygulanabilir. Her platform için ayrı hesaplama yapmak, hangi kanalda hangi ürünün daha kârlı olduğunu görmenizi sağlar.",
  },
  {
    q: "Hepsiburada'da hizmet bedeli giyim kârını nasıl etkiler?",
    a: "Hepsiburada'da komisyona ek olarak sipariş başına sabit bir hizmet bedeli uygulanabilir; düşük fiyatlı giyim ürünlerinde bu sabit bedel oransal olarak büyük bir etki yaratabilir, hesaplamaya mutlaka dahil edin.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Hepsiburada Giyim Komisyon Hesaplama 2026",
  description: metadata.description,
  inLanguage: "tr-TR",
  mainEntityOfPage: `${SITE_URL}/hepsiburada-giyim-komisyon-hesaplama`,
  author: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
  publisher: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
};

export default function HepsiburadaGiyimKomisyonHesaplamaPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <JsonLd data={[faqJsonLd, articleJsonLd]} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          Hepsiburada giyim komisyon hesaplama: sabit hizmet bedelini unutmayın
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            <strong>Hepsiburada giyim komisyon hesaplama</strong> yaparken çoğu satıcı yalnızca yüzdesel
            komisyona bakar; oysa platformun sipariş başına uygulayabildiği sabit hizmet bedeli, özellikle
            düşük fiyatlı tişört, çorap veya iç giyim gibi ürünlerde net kârı oran kadar etkileyebilir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Giyim ve spor giyim alt kategorilerinde komisyon
          </h2>
          <p>
            Bluz, etek, ceket, pantolon, gömlek, tişört, çocuk giyim ve iç/üst/alt giyim gibi ana giyim
            alt kategorileri örnek veri setimizde aynı komisyon bandında toplanıyor; spor giyim ve spor
            ayakkabı da benzer bir orana sahip. Tam rakam ürün kartınızın bağlı olduğu alt kategoriye göre
            değişebilir ve zaman içinde güncellenebilir — kesin oranı her zaman hesaplayıcıdaki kategori
            aramasından doğrulayın.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Sabit hizmet bedeli düşük fiyatlı üründe daha çok yakar
          </h2>
          <p>
            Hepsiburada&apos;da bazı kategorilerde komisyona ek olarak sipariş başına sabit bir hizmet
            bedeli uygulanır. 100 TL&apos;lik bir tişörtte bu sabit bedel marjın önemli bir kısmını
            oluşturabilirken, 1000 TL&apos;lik bir dış giyim ürününde etkisi oransal olarak çok daha
            küçüktür. Bu yüzden giyimde fiyat bandına göre kârlılık farklı davranabilir; ürün portföyünüzü
            fiyat aralığına göre ayrı ayrı değerlendirmek isabetli olur.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            İade oranı ve kargo etkisi
          </h2>
          <p>
            Giyimde iade oranı diğer kategorilere göre yüksek seyreder; beden ve kalıp uyumsuzluğu en sık
            iade nedenidir. Kargo tarafında ise Hepsiburada&apos;nın anlaşmalı kargo tablosu üzerinden desi
            bazlı otomatik hesaplama yapmak, elle girilen tahmini rakamlardan daha isabetli sonuç verir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">Sık sorulan sorular</h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q}>
                <h3 className="text-base font-semibold text-[#0B1F3B]">{item.q}</h3>
                <p className="mt-1">{item.a}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Ücretsiz Hepsiburada giyim kâr hesaplayıcı
          </h2>
          <p>
            Pazarkar hesaplayıcısında Hepsiburada&apos;yı seçip kategori aramasına ürününüzü yazarak
            güncel komisyon oranını, hizmet bedelini ve kargo desisini birlikte hesaplayabilir, net kârı
            ve minimum satış fiyatını anında görebilirsiniz.
          </p>

          <GuideCta title="Hepsiburada giyim kârını şimdi hesapla" />
          <RelatedGuides currentPath="/hepsiburada-giyim-komisyon-hesaplama" />
        </div>
      </div>
    </main>
  );
}
