import { GuideCta } from "@/components/seo/GuideCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { pageMetadata } from "@/lib/seoMetadata";
import { SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Trendyol Komisyon Hesaplama 2026 — Net Kâr Rehberi",
  description:
    "Trendyol komisyon hesaplama: kategori oranı, kargo, hizmet bedeli, stopaj ve kampanya dahil net kârı doğru bulun. Ücretsiz pazaryeri kâr hesaplama aracı.",
  path: "/trendyol-komisyon-hesaplama",
  keywords: [
    "trendyol komisyon hesaplama",
    "trendyol komisyon oranı",
    "trendyol net kâr",
    "pazaryeri kar hesaplama",
  ],
});

const faq = [
  {
    q: "Trendyol komisyon hesaplama nasıl yapılır?",
    a: "Önce ürün kategorinizin komisyon oranını bulun. Komisyon genelde KDV hariç satış matrahı üzerinden hesaplanır. Ardından kargo, platform hizmet bedeli, tahsilat, stopaj, reklam ve iade etkisini ekleyerek net kârı bulun.",
  },
  {
    q: "Sadece komisyon oranına bakmak yeter mi?",
    a: "Hayır. Düşük komisyonlu ürün yüksek kargo veya iade nedeniyle zarar edebilir. Pazaryeri kâr hesaplama için tüm kesintileri birlikte görmelisiniz.",
  },
  {
    q: "Kampanyalı satışta komisyon nasıl etkilenir?",
    a: "İndirim sonrası müşterinin ödediği tutar düşer; bazı kesintiler devam eder. Liste fiyatı ve indirimli satış senaryolarını ayrı hesaplamak gerekir.",
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
  headline: "Trendyol Komisyon Hesaplama 2026",
  description: metadata.description,
  inLanguage: "tr-TR",
  mainEntityOfPage: `${SITE_URL}/trendyol-komisyon-hesaplama`,
  author: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
  publisher: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
};

export default function TrendyolKomisyonHesaplamaPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <JsonLd data={[faqJsonLd, articleJsonLd]} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          Trendyol komisyon hesaplama: Net kârı doğru çıkaran adımlar
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            <strong>Trendyol komisyon hesaplama</strong>, satıcıların en çok aradığı işlemlerden
            biridir; çünkü kategori oranı tek başına kârı göstermez. Gerçek net sonuç için komisyonun
            yanında kargo, platform hizmet bedeli, tahsilat yönetimi, stopaj, reklam ve iade riskini de
            aynı tabloda toplamak gerekir. Bu rehber, Trendyol özelinde komisyonu doğru okuyup{" "}
            <strong>pazaryeri kâr hesaplama</strong> sürecini adım adım anlatır.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Trendyol komisyonu nasıl hesaplanır?
          </h2>
          <p>
            Trendyol komisyonu ürün kategorisine göre değişir. Oranı bulduktan sonra satış matrahını
            (çoğu senaryoda KDV hariç tutar) oranla çarparak komisyon tutarını bulursunuz. Yanlış
            kategori seçimi beklenenden yüksek kesinti demektir; bu yüzden ürün kartındaki kategori
            eşleşmesini doğrulamak ilk adımdır. Komisyon KDV&apos;si de hakediş/kâr modelinizde ayrı
            satır olarak izlenmelidir.
          </p>
          <p>
            Örnek yaklaşım: Satış fiyatından KDV&apos;yi ayırın → kategori komisyonunu uygulayın →
            kargo ve sabit bedelleri ekleyin → ürün maliyetini düşün → kalan net kârı görün. Aynı
            ürün için kampanyalı ve kampanyasız iki senaryo çalışmak, fiyat kırarken zarar riskini
            azaltır.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Komisyon dışında net kârı bozan kalemler
          </h2>
          <p>
            Desiye bağlı kargo, sipariş başına hizmet bedeli, tahsilat oranı, şahıs işletmelerinde
            stopaj ve reklam harcaması marjı hızla eritebilir. Özellikle düşük fiyatlı ürünlerde 10–20
            TL sabit gider farkı tüm kârı silebilir. İade oranı yüksek kategorilerde ise &quot;kağıt
            üstü kâr&quot; ile gerçekleşen kâr birbirinden ayrılır; modelinize makul bir iade payı
            koymak gerekir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Minimum satış fiyatı nasıl bulunur?
          </h2>
          <p>
            Hedeflediğiniz net marjı belirleyin. Tüm kesintileri ve ürün maliyetini ekleyerek başa baş
            fiyatı hesaplayın; üzerine hedef kârı koyarak minimum satış fiyatına ulaşın. Bu eşik
            olmadan yapılan kampanya indirimleri çoğu zaman ciroyu artırır, kârı düşürür.
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

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Ücretsiz Trendyol komisyon ve kâr aracı
          </h2>
          <p>
            Pazarkar hesaplayıcısında kategori aramasıyla güncel komisyon oranını seçebilir; kargo
            desi tablosu, kampanya ve iade alanlarıyla net kâr ile minimum satış fiyatını anında
            görebilirsiniz. Trendyol yanında Hepsiburada ve Shopier senaryolarını da aynı ekranda
            karşılaştırabilirsiniz.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Kategoriye özel rehberler
          </h2>
          <p>
            Komisyon oranı kategoriden kategoriye büyük fark gösterebiliyor. En çok aranan iki kategori
            için ayrı rehberlerimize bakabilirsiniz:{" "}
            <a
              href="/trendyol-giyim-komisyon-hesaplama"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Trendyol giyim komisyon hesaplama
            </a>{" "}
            ve{" "}
            <a
              href="/trendyol-elektronik-komisyon-hesaplama"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Trendyol elektronik komisyon hesaplama
            </a>
            .
          </p>

          <GuideCta title="Trendyol komisyonunu ve net kârını şimdi hesapla" />
          <RelatedGuides currentPath="/trendyol-komisyon-hesaplama" />
        </div>
      </div>
    </main>
  );
}
