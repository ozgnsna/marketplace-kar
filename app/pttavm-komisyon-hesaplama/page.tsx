import { GuideCta } from "@/components/seo/GuideCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { pageMetadata } from "@/lib/seoMetadata";
import { SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "PttAVM Komisyon Hesaplama — Kategori Oranı ve Net Kâr",
  description:
    "PttAVM komisyon hesaplama: 5000+ kategori oranı ve anlaşmalı kargo ile net kârı bulun. Pazarkar ile ücretsiz hesaplayın.",
  path: "/pttavm-komisyon-hesaplama",
  keywords: ["pttavm komisyon hesaplama", "pttavm komisyon oranları", "pazaryeri kar hesaplama"],
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "PttAVM komisyonu nasıl hesaplanır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PttAVM kategori ağacında her seviyenin kendi komisyon oranı olabilir. Ürününüzün atandığı kategori seviyesini seçip satış, kargo ve maliyetle net kârı hesaplayın.",
      },
    },
    {
      "@type": "Question",
      name: "PttAVM kargo ücreti nasıl bulunur?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PttAVM anlaşmalı kargo tablosu desi/kg kademesine göre tek taşıyıcı fiyatı verir. Pazarkar desi seçince tahmini kargoyu forma yazar.",
      },
    },
  ],
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "PttAVM Komisyon Hesaplama",
  description: metadata.description,
  inLanguage: "tr-TR",
  mainEntityOfPage: `${SITE_URL}/pttavm-komisyon-hesaplama`,
  author: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
  publisher: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
};

export default function PttavmKomisyonHesaplamaPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <JsonLd data={[faqJsonLd, articleJsonLd]} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          PttAVM komisyon hesaplama: Kategori + kargo
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            PttAVM, kategori bazlı komisyon uygular; ağaç 2–7 seviye derinliğinde olabilir ve{" "}
            <strong>her seviyenin kendi oranı</strong> bulunur.{" "}
            <strong>PttAVM komisyon hesaplama</strong> yaparken panelde ürününüzün atandığı
            kategori seviyesini seçmek kritiktir. Pazarkar’da 5000+ kategori satırından arayıp
            seçebilir, anlaşmalı kargo tablosunu da aynı hesapta kullanabilirsiniz.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            PttAVM&apos;de kârı belirleyen kalemler
          </h2>
          <p>
            Kategori komisyonu, anlaşmalı kargo (desi), stopaj, tahsilat/reklam (varsa) ve ürün
            maliyeti ana girdilerdir. Kampanya veya indirimde efektif satış düşer; kesintiler
            devam edebilir. Bu nedenle{" "}
            <a
              href="/pazaryeri-kar-hesaplama"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              pazaryeri kâr hesaplama
            </a>{" "}
            disiplini PttAVM için de geçerlidir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Diğer pazaryerleriyle farkı
          </h2>
          <p>
            Trendyol, Hepsiburada ve n11 de kategori komisyonu kullanır; n11’de ek yüzde hizmet
            bedelleri vardır. Shopier ciro dilimiyle çalışır. PttAVM’de tek taşıyıcılı anlaşmalı
            kargo tablosu ve çok seviyeli kategori ağacı öne çıkar.
          </p>

          <GuideCta title="PttAVM net kârını hesapla" />
          <RelatedGuides currentPath="/pttavm-komisyon-hesaplama" />
        </div>
      </div>
    </main>
  );
}
