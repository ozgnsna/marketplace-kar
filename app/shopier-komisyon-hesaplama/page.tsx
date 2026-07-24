import { GuideCta } from "@/components/seo/GuideCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { pageMetadata } from "@/lib/seoMetadata";
import { SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Shopier Komisyon Hesaplama — Ciro Dilimi ve Net Kâr",
  description:
    "Shopier komisyon hesaplama: aylık ciro dilimine göre işlem ücreti, sabit hizmet bedeli ve kargo ile net kârı bulun. Pazaryeri kâr hesaplama aracı.",
  path: "/shopier-komisyon-hesaplama",
  keywords: ["shopier komisyon hesaplama", "shopier ücret", "pazaryeri kar hesaplama"],
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Shopier komisyonu kategoriye göre mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayır. Shopier kategori komisyonu yerine önceki ay cirosuna göre işlem ücreti dilimleri uygular. Ayrıca işlem başına sabit ücret kesilir.",
      },
    },
    {
      "@type": "Question",
      name: "Shopier'de net kâr nasıl hesaplanır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Satış tutarından dilim oranı, sabit hizmet bedeli, kargo ve ürün maliyetini düşerek net kâr bulunur. Pazarkar aracı bu kalemleri birlikte hesaplar.",
      },
    },
  ],
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Shopier Komisyon Hesaplama",
  description: metadata.description,
  inLanguage: "tr-TR",
  mainEntityOfPage: `${SITE_URL}/shopier-komisyon-hesaplama`,
  author: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
  publisher: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
};

export default function ShopierKomisyonHesaplamaPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <JsonLd data={[faqJsonLd, articleJsonLd]} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          Shopier komisyon hesaplama: Ciro dilimiyle net kâr
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            Shopier, Trendyol veya Hepsiburada gibi kategori bazlı komisyon yerine aylık satış
            hacmine (ciro dilimine) göre işlem ücreti uygular. Bu yüzden{" "}
            <strong>Shopier komisyon hesaplama</strong> yaparken önce bir önceki ay toplam
            cironuzu bilmek gerekir. Dilim oranı KDV dahil düşünülmeli; her satışa eklenen sabit
            işlem ücreti (panelde 0,49 TL + KDV) de modele eklenmelidir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Shopier&apos;de kârı belirleyen kalemler
          </h2>
          <p>
            İşlem ücreti dilimi, sabit hizmet bedeli, anlaşmalı kargo (desi/firma) ve ürün maliyeti
            ana kalemlerdir. Kampanya veya kupon kullandığınızda efektif satış düşer; ücretler ise
            devam edebilir. Bu nedenle Shopier satışlarında da{" "}
            <a
              href="/pazaryeri-kar-hesaplama"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              pazaryeri kâr hesaplama
            </a>{" "}
            disiplini geçerlidir: sipariş başına net marjı bilmeden fiyat kırmayın.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Trendyol ile farkı
          </h2>
          <p>
            Trendyol&apos;da kategori komisyonu öne çıkar (
            <a
              href="/trendyol-komisyon-hesaplama"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Trendyol komisyon hesaplama
            </a>
            ). Shopier&apos;de ise ciro dilimi belirleyicidir. Aynı ürünü iki kanalda satıyorsanız
            ayrı senaryo kurun; aksi halde bir kanalın marjını diğerine taşımak yanıltıcı olur.
          </p>

          <GuideCta title="Shopier net kârını hesapla" />
          <RelatedGuides currentPath="/shopier-komisyon-hesaplama" />
        </div>
      </div>
    </main>
  );
}
