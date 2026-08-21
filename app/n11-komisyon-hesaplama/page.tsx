import { GuideCta } from "@/components/seo/GuideCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { pageMetadata } from "@/lib/seoMetadata";
import { SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "n11 Komisyon Hesaplama — Kategori Oranı ve Net Kâr",
  description:
    "n11 komisyon hesaplama: kategori komisyonu, pazarlama ve pazaryeri hizmet bedeli ile net kârı bulun. 3700+ kategori oranı Pazarkar'da.",
  path: "/n11-komisyon-hesaplama",
  keywords: ["n11 komisyon hesaplama", "n11 komisyon oranları", "pazaryeri kar hesaplama"],
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "n11 komisyonu nasıl hesaplanır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "n11'de kategoriye göre komisyon oranı yanında pazarlama hizmet bedeli ve sabit pazaryeri hizmet bedeli (%0,67 + KDV) kesilir. Pazarkar bu üç kalemi birlikte hesaba katar.",
      },
    },
    {
      "@type": "Question",
      name: "n11'de net kâr nasıl bulunur?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Satış tutarından komisyon, hizmet bedelleri, kargo, stopaj ve ürün maliyetini düşerek net kâr bulunur. Kategori seçince oranlar otomatik dolar.",
      },
    },
  ],
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "n11 Komisyon Hesaplama",
  description: metadata.description,
  inLanguage: "tr-TR",
  mainEntityOfPage: `${SITE_URL}/n11-komisyon-hesaplama`,
  author: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
  publisher: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
};

export default function N11KomisyonHesaplamaPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <JsonLd data={[faqJsonLd, articleJsonLd]} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          n11 komisyon hesaplama: Kategori + hizmet bedelleri
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            n11, Trendyol ve Hepsiburada gibi kategori bazlı komisyon uygular; ancak tek oran
            yetmez.{" "}
            <strong>n11 komisyon hesaplama</strong> yaparken kategori komisyonuna ek olarak
            pazarlama hizmet bedeli ve tüm kategorilerde sabit pazaryeri hizmet bedeli (%0,67 +
            KDV) de düşülmelidir. Pazarkar’da 3700+ kategori listesinden arayıp seçince bu
            kalemler forma yansır.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            n11&apos;de kârı belirleyen kalemler
          </h2>
          <p>
            Komisyon oranı, pazarlama / pazaryeri hizmet bedelleri, anlaşmalı kargo (desi/firma),
            stopaj ve ürün maliyeti ana girdilerdir. Kampanya veya indirimde efektif satış düşer;
            kesintiler devam edebilir. Bu nedenle n11 satışlarında da{" "}
            <a
              href="/pazaryeri-kar-hesaplama"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              pazaryeri kâr hesaplama
            </a>{" "}
            disiplini geçerlidir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Diğer pazaryerleriyle farkı
          </h2>
          <p>
            Trendyol ve Hepsiburada’da da kategori komisyonu vardır; n11’de ek yüzde hizmet
            bedelleri daha belirgindir. Shopier ise ciro dilimi kullanır (
            <a
              href="/shopier-komisyon-hesaplama"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Shopier komisyon hesaplama
            </a>
            ). Aynı ürünü birden fazla kanalda satıyorsanız her platform için ayrı senaryo kurun.
          </p>

          <GuideCta title="n11 net kârını hesapla" />
          <RelatedGuides currentPath="/n11-komisyon-hesaplama" />
        </div>
      </div>
    </main>
  );
}
