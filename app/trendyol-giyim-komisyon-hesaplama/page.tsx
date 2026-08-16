import { GuideCta } from "@/components/seo/GuideCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { pageMetadata } from "@/lib/seoMetadata";
import { SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Trendyol Giyim Komisyon Hesaplama 2026 — Net Kâr Rehberi",
  description:
    "Trendyol'da giyim kategorisi komisyon oranı ve net kâr hesaplama: üst giyim, alt giyim, iç giyim, çocuk giyim ve spor giyimde kesintileri doğru bulun.",
  path: "/trendyol-giyim-komisyon-hesaplama",
  keywords: [
    "trendyol giyim komisyon hesaplama",
    "trendyol giyim komisyon oranı",
    "trendyol tekstil komisyon",
    "trendyol komisyon hesaplama",
  ],
});

const faq = [
  {
    q: "Trendyol'da giyim kategorisinin komisyon oranı kaç?",
    a: "Üst giyim, alt giyim, iç giyim, dış giyim, çocuk giyim, mayo ve spor giyim alt kategorilerinin çoğu aynı bandda toplanır; güncel oranı hesaplayıcıdaki kategori aramasından ürününüze özel doğrulayın, çünkü Trendyol dönem dönem oranları güncelleyebilir.",
  },
  {
    q: "Giyimde komisyon dışında kârı en çok ne etkiler?",
    a: "İade oranı. Giyim, pazaryerinde iade oranı en yüksek kategorilerden biridir (beden/renk uyumsuzluğu, kalıp beklentisi); komisyon düşük görünse bile yüksek iade payı net kârı hızla eritebilir.",
  },
  {
    q: "Kampanyalı satışta giyim komisyonu nasıl değişir?",
    a: "İndirim sonrası müşterinin ödediği tutar üzerinden efektif kazanç değişir; hesaplama modunu (liste fiyatı / indirimli satış) senaryonuza göre doğru seçmek gerekir.",
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
  headline: "Trendyol Giyim Komisyon Hesaplama 2026",
  description: metadata.description,
  inLanguage: "tr-TR",
  mainEntityOfPage: `${SITE_URL}/trendyol-giyim-komisyon-hesaplama`,
  author: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
  publisher: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
};

export default function TrendyolGiyimKomisyonHesaplamaPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <JsonLd data={[faqJsonLd, articleJsonLd]} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          Trendyol giyim komisyon hesaplama: iade riskini de tabloya ekleyin
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            Giyim, Trendyol&apos;da en yüksek işlem hacmine sahip kategorilerden biri — aynı zamanda
            komisyonun tek başına yanıltıcı olduğu kategorilerden biri. <strong>Trendyol giyim komisyon
            hesaplama</strong> yaparken oranın yanında iade oranını da mutlaka modele dahil etmelisiniz;
            aksi halde kâğıt üstünde kârlı görünen bir ürün gerçekte zarar ettirebilir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Giyim alt kategorilerinde komisyon oranı
          </h2>
          <p>
            Üst giyim, alt giyim, iç giyim, dış giyim, çocuk giyim ve mayo gibi ana giyim alt
            kategorilerinin çoğu, kategori listemizdeki örnek veriye göre aynı komisyon bandında
            toplanıyor. Spor giyim de benzer bir oranda yer alıyor. Tam rakam ürün kartınızın bağlı
            olduğu alt kategoriye göre küçük farklar gösterebilir ve Trendyol zaman zaman oranları
            günceller — bu yüzden kesin oranı hesaplayıcıdaki kategori aramasından ürününüze özel
            doğrulamanızı öneririz; sayfa üzerindeki tek bir sabit rakam yerine her zaman güncel
            kategori eşleşmesine güvenin.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Giyimde kârı asıl belirleyen: iade oranı
          </h2>
          <p>
            Giyim kategorisinde beden uyumsuzluğu, kalıp/renk beklentisi ve deneme amaçlı çoklu sipariş
            nedeniyle iade oranı diğer kategorilere göre belirgin şekilde yüksektir. Bir ürün %20
            komisyonla kârlı görünse bile, sipariş başına örneğin %15-25 iade payı eklendiğinde net kâr
            ciddi ölçüde düşebilir; bazı düşük fiyatlı ürünlerde iade kargo maliyeti tek başına marjı
            sıfırlayabilir. Bu yüzden giyimde <strong>pazaryeri kâr hesaplama</strong> yaparken iade
            oranı alanını gerçekçi bir yüzdeyle doldurmak, komisyon oranını doğru bulmak kadar önemlidir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Kargo ve desi etkisi
          </h2>
          <p>
            Giyim ürünleri genelde düşük desili paketlerde gönderilir, bu da kargo maliyetini diğer
            kategorilere göre nispeten kontrol edilebilir kılar. Ancak çoklu ürün gönderimlerinde (örn.
            takım elbise, kışlık dış giyim) desi artışı fark yaratabilir; hesaplama aracındaki desi
            yardımcısıyla paket boyutunu doğru seçmek gerekir.
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
            Ücretsiz giyim kâr hesaplayıcı
          </h2>
          <p>
            Pazarkar hesaplayıcısında kategori aramasına &quot;giyim&quot; yazarak alt kategorinize özel
            güncel komisyon oranını seçebilir, iade oranı ve kargo desisiyle birlikte net kârı ve
            minimum satış fiyatını anında görebilirsiniz.
          </p>

          <GuideCta title="Giyim komisyonunu ve iade etkisini birlikte hesapla" />
          <RelatedGuides currentPath="/trendyol-giyim-komisyon-hesaplama" />
        </div>
      </div>
    </main>
  );
}
