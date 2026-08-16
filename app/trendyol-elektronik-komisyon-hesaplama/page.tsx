import { GuideCta } from "@/components/seo/GuideCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { pageMetadata } from "@/lib/seoMetadata";
import { SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Trendyol Elektronik Komisyon Hesaplama 2026 — Kategoriye Göre Oranlar",
  description:
    "Trendyol elektronik komisyon hesaplama: telefon, elektronik aksesuar, bilgisayar ve akıllı ev ürünlerinde kategoriye göre değişen komisyon oranları ve net kâr.",
  path: "/trendyol-elektronik-komisyon-hesaplama",
  keywords: [
    "trendyol elektronik komisyon hesaplama",
    "trendyol telefon komisyon oranı",
    "trendyol elektronik komisyon oranı",
    "trendyol komisyon hesaplama",
  ],
});

const faq = [
  {
    q: "Trendyol'da elektronik kategorisinin tek bir komisyon oranı var mı?",
    a: "Hayır. Elektronik, Trendyol'daki en geniş oran yelpazesine sahip kategorilerden biri — cep telefonu gibi rekabetin yoğun olduğu alt kategorilerde oran tek haneli seviyelere inerken, aksesuar ve akıllı ev ürünlerinde çok daha yüksek olabilir.",
  },
  {
    q: "Neden telefon komisyonu diğer elektronik ürünlerden düşük?",
    a: "Cep telefonu gibi yüksek fiyatlı, yoğun rekabetli ürünlerde pazaryerleri genelde daha düşük bir komisyon oranı uygular; buna karşılık aksesuar gibi düşük fiyatlı, yüksek marjlı ürünlerde oran daha yüksek olabilir.",
  },
  {
    q: "Düşük komisyonlu bir telefon satmak otomatik olarak kârlı mıdır?",
    a: "Hayır. Komisyon oranı düşük olsa da yüksek satış fiyatı nedeniyle mutlak komisyon tutarı, kargo ve hizmet bedeliyle birlikte ciddi bir kalem oluşturabilir. Net kârı görmek için tutarı, orana değil pazaryeri kâr hesaplama sonucuna göre değerlendirin.",
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
  headline: "Trendyol Elektronik Komisyon Hesaplama 2026",
  description: metadata.description,
  inLanguage: "tr-TR",
  mainEntityOfPage: `${SITE_URL}/trendyol-elektronik-komisyon-hesaplama`,
  author: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
  publisher: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
};

export default function TrendyolElektronikKomisyonHesaplamaPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <JsonLd data={[faqJsonLd, articleJsonLd]} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          Trendyol elektronik komisyon hesaplama: tek rakam değil, geniş bir yelpaze
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            Elektronik, Trendyol&apos;da &quot;elektronik komisyonu şu kadar&quot; diye tek bir rakamla
            özetlenemeyecek kadar geniş bir kategori. Alt kategoriye göre oran birkaç kat farklılık
            gösterebilir; bu yüzden <strong>Trendyol elektronik komisyon hesaplama</strong> yaparken
            ürününüzün tam olarak hangi alt kategoriye düştüğünü doğrulamak, genel bir varsayımdan çok
            daha önemli.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Telefon ile aksesuar arasındaki fark neden bu kadar büyük?
          </h2>
          <p>
            Örnek kategori verimizde cep telefonu gibi yüksek fiyatlı, rekabetin yoğun olduğu ürünlerde
            komisyon oranı tek haneli seviyelere inerken; kablo, kılıf, akıllı priz, akıllı bileklik gibi
            elektronik aksesuar ve akıllı ev ürünlerinde oran çok daha yüksek bir bantta yer alıyor.
            Bilgisayar bileşenleri (anakart, RAM, SSD gibi) ile giyilebilir teknoloji ürünleri de kendi
            aralarında farklı oranlara sahip. Güncel ve ürününüze özel oranı her zaman hesaplayıcıdaki
            kategori aramasından doğrulayın; Trendyol bu oranları dönemsel olarak güncelleyebilir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Düşük komisyon = yüksek kâr değildir
          </h2>
          <p>
            Telefon gibi düşük komisyon oranlı ürünlerde satış fiyatı yüksek olduğu için mutlak komisyon
            tutarı (₺ cinsinden) yine de büyük olabilir; buna kargo, hizmet bedeli ve ürün maliyeti
            eklendiğinde net marj beklenenden ince kalabilir. Tersine, aksesuar gibi yüksek oranlı ama
            düşük fiyatlı ürünlerde toplam kesinti tutarı küçük kalabilir. Doğru karşılaştırma için oran
            yerine <strong>net kâr</strong> ve <strong>net marj yüzdesi</strong>ni yan yana görmek gerekir
            — tam da <strong>pazaryeri kâr hesaplama</strong> aracının yaptığı şey bu.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Elektronikte kargo ve garanti/iade riski
          </h2>
          <p>
            Elektronik ürünlerde desi genelde giyime göre daha yüksektir (özellikle beyaz eşya, büyük
            ev aletleri) ve kırılganlık nedeniyle paketleme maliyeti artabilir. Ayrıca teknik arıza
            kaynaklı iade/garanti talepleri, düşük fiyatlı aksesuarlarda bile marjı önemli ölçüde
            etkileyebilir; iade oranı alanını bu riski yansıtacak şekilde ayarlamak isabetli olur.
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
            Ücretsiz elektronik kâr hesaplayıcı
          </h2>
          <p>
            Pazarkar hesaplayıcısında ürününüzün tam alt kategorisini arayarak güncel komisyon oranını
            otomatik uygulayabilir, kargo ve maliyetlerle birlikte net kârı saniyeler içinde görebilirsiniz.
          </p>

          <GuideCta title="Elektronik kategorinde net kârı şimdi hesapla" />
          <RelatedGuides currentPath="/trendyol-elektronik-komisyon-hesaplama" />
        </div>
      </div>
    </main>
  );
}
