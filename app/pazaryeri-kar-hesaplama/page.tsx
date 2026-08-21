import { GuideCta } from "@/components/seo/GuideCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { pageMetadata } from "@/lib/seoMetadata";
import { SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Pazaryeri Kâr Hesaplama — Trendyol, Hepsiburada, n11, PttAVM, Shopier",
  description:
    "Pazaryeri kâr hesaplama aracı: Trendyol, Hepsiburada, n11, PttAVM ve Shopier kesintileriyle net kâr ve minimum satış fiyatını ücretsiz hesaplayın.",
  path: "/pazaryeri-kar-hesaplama",
  keywords: [
    "pazaryeri kar hesaplama",
    "pazaryeri kâr hesaplama",
    "trendyol komisyon hesaplama",
    "n11 komisyon hesaplama",
    "pttavm komisyon hesaplama",
    "marketplace kâr",
  ],
});

const faq = [
  {
    q: "Pazaryeri kâr hesaplama nedir?",
    a: "Satış fiyatından ürün maliyeti, komisyon, kargo, hizmet bedeli, tahsilat, stopaj, reklam ve iade etkisini düşerek sipariş başına net kârı bulma işlemidir.",
  },
  {
    q: "Hangi pazaryerlerini kapsar?",
    a: "Pazarkar; Trendyol, Hepsiburada, n11, PttAVM ve Shopier için komisyon/kargo varsayımlarıyla net kâr hesaplamayı destekler.",
  },
  {
    q: "Trendyol komisyon hesaplama ile pazaryeri kâr hesabı aynı mı?",
    a: "Trendyol komisyon hesaplama sürecin bir parçasıdır. Tam pazaryeri kâr hesabı komisyonun yanında tüm operasyon kesintilerini de içerir.",
  },
];

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
  headline: "Pazaryeri Kâr Hesaplama",
  description: metadata.description,
  inLanguage: "tr-TR",
  mainEntityOfPage: `${SITE_URL}/pazaryeri-kar-hesaplama`,
  author: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
  publisher: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
};

export default function PazaryeriKarHesaplamaPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <JsonLd data={[faqJsonLd, articleJsonLd]} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          Pazaryeri kâr hesaplama: Ciro değil, net kazancı görün
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            <strong>Pazaryeri kâr hesaplama</strong>, Trendyol, Hepsiburada, n11, PttAVM veya
            Shopier&apos;de satış yapan her satıcının düzenli yapması gereken temel kontroldür. Liste
            fiyatı ile alış fiyatını karşılaştırmak yanıltıcıdır; gerçek sonuç komisyon, kargo,
            kampanya ve iade sonrası kalan net tutardır. Bu sayfa, pazaryeri satışlarında net kârı
            nasıl hesaplayacağınızı ve fiyat kararını nasıl güvenli hale getireceğinizi anlatır.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Neden pazaryeri kâr hesabı şart?
          </h2>
          <p>
            Platformlar ciroyu büyütmeyi kolaylaştırır; ancak kesinti yapısı ürün bazında çok
            farklılaşır. Aynı satış tutarı iki kategoride tamamen farklı net kâr üretebilir. Özellikle
            agresif indirim dönemlerinde efektif satış düşer, sabit giderler ise yerinde kalır. Bu
            yüzden ürün eklemeden veya fiyat kırmadan önce sipariş başı net marjı bilmek gerekir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Adım adım pazaryeri kâr hesaplama
          </h2>
          <p>
            1) Ürün maliyetini (KDV, kur, paketleme dahil) netleştirin. 2) Doğru kategori ile komisyon
            oranını seçin — Trendyol için{" "}
            <a
              href="/trendyol-komisyon-hesaplama"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Trendyol komisyon hesaplama
            </a>{" "}
            mantığıyla ilerleyin. 3) Desiye göre kargo ve platform hizmet bedelini ekleyin. 4)
            Kampanya ve iade senaryosunu ayrı çalışın. 5) Hedef marjla minimum satış fiyatını
            belirleyin.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Platform farkları: Trendyol, Hepsiburada, n11, PttAVM, Shopier
          </h2>
          <p>
            Trendyol, Hepsiburada, n11 ve PttAVM kategori komisyonlarıyla çalışır; n11’de ek olarak
            pazarlama ve pazaryeri hizmet bedelleri vardır. Shopier ise aylık ciro dilimine göre
            işlem ücreti uygular. Kargo tabloları ve sabit bedeller de platforma göre değişir. Bu
            nedenle aynı ürünü farklı pazaryerinde satarken ayrı model kurmak doğru yaklaşımdır.
            Pazarkar aracı beş platformu tek ekranda karşılaştırmanıza yardımcı olur.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Sık sorulan sorular
          </h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q}>
                <h3 className="text-base font-semibold text-[#0B1F3B]">{item.q}</h3>
                <p className="mt-1">{item.a}</p>
              </div>
            ))}
          </div>

          <GuideCta title="Pazaryeri kârını ücretsiz hesapla" />
          <RelatedGuides currentPath="/pazaryeri-kar-hesaplama" />
        </div>
      </div>
    </main>
  );
}
