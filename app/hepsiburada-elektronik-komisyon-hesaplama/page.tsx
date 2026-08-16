import { GuideCta } from "@/components/seo/GuideCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { pageMetadata } from "@/lib/seoMetadata";
import { SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Hepsiburada Elektronik Komisyon Hesaplama 2026 — Telefon ve Aksesuar",
  description:
    "Hepsiburada elektronik ve cep telefonu komisyon hesaplama: telefon, telefon aksesuarları ve elektronik ürünlerde kategoriye göre değişen oranlar.",
  path: "/hepsiburada-elektronik-komisyon-hesaplama",
  keywords: [
    "hepsiburada elektronik komisyon hesaplama",
    "hepsiburada telefon komisyon oranı",
    "hepsiburada cep telefonu komisyon",
    "hepsiburada komisyon hesaplama",
  ],
});

const faq = [
  {
    q: "Hepsiburada'da cep telefonu komisyonu ne kadar?",
    a: "Cep telefonu, Hepsiburada'nın en düşük komisyon oranlı kategorilerinden biri — örnek veri setimizde tek haneli bir bantta yer alıyor. Telefon aksesuarları (kablo, kılıf, şarj cihazı gibi) ise çok daha yüksek bir oranda, kategoriye göre değişen birden fazla bant halinde uygulanıyor.",
  },
  {
    q: "Aynı 'telefon aksesuarı' başlığı altında neden farklı oranlar var?",
    a: "Hepsiburada aksesuar grubunu kendi içinde alt bantlara ayırıyor (kulaklık/hoparlör, kablo/şarj, kılıf/yedek parça gibi); bu yüzden 'aksesuar' tek bir oran değil, ürün tipine göre değişen bir yelpazedir.",
  },
  {
    q: "Düşük komisyonlu telefon satışı otomatik olarak kârlı mı?",
    a: "Hayır. Telefonun satış fiyatı yüksek olduğu için düşük oranda bile mutlak komisyon tutarı büyük olabilir; kargo, hizmet bedeli ve ürün maliyeti ile birlikte net kârı hesaplamadan sadece orana bakmak yanıltıcıdır.",
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
  headline: "Hepsiburada Elektronik Komisyon Hesaplama 2026",
  description: metadata.description,
  inLanguage: "tr-TR",
  mainEntityOfPage: `${SITE_URL}/hepsiburada-elektronik-komisyon-hesaplama`,
  author: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
  publisher: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
};

export default function HepsiburadaElektronikKomisyonHesaplamaPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <JsonLd data={[faqJsonLd, articleJsonLd]} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          Hepsiburada elektronik komisyon hesaplama: telefon ile aksesuar arasındaki uçurum
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            Hepsiburada&apos;da elektronik kategorisi, komisyon oranı açısından platformun en geniş
            yelpazeye sahip alanlarından biri. <strong>Hepsiburada elektronik komisyon hesaplama</strong>{" "}
            yaparken &quot;elektronik&quot; başlığına değil, ürününüzün tam olarak hangi alt kategoride
            (telefon, aksesuar, TV/görüntü, bilgisayar bileşeni) yer aldığına bakmak gerekir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Cep telefonu: en düşük oranlı segment
          </h2>
          <p>
            Örnek kategori verimize göre cep telefonu (Android ve iPhone dahil), Hepsiburada&apos;nın en
            düşük komisyon oranlı ürün gruplarından biri — tek haneli bir bantta yer alıyor. Bu, yüksek
            birim fiyatlı ve rekabetin yoğun olduğu bir kategoride platformun satıcıyı teşvik etme
            stratejisiyle uyumlu. Ancak düşük oran, düşük komisyon tutarı anlamına gelmeyebilir; yüksek
            satış fiyatı nedeniyle ₺ cinsinden komisyon yine de önemli bir kalem olabilir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Aksesuar grubunda geniş bir oran yelpazesi
          </h2>
          <p>
            Telefon aksesuarları kendi içinde birden fazla alt banda ayrılıyor: kulaklık ve taşınabilir
            hoparlör gibi ürünler bir bantta, araç kiti ve bluetooth aksesuarları başka bir bantta, kablo
            ve şarj ürünleri yine farklı bir bantta, kılıf ve yedek parça gibi ürünler ise örnek verimizde
            en yüksek banda yakın bir oranda yer alıyor. Bu geniş yelpaze, &quot;aksesuar zaten ucuz ürün,
            komisyonu önemli değil&quot; varsayımını riskli kılar — düşük fiyatlı bir aksesuarda yüksek
            oranlı komisyon, net marjı beklenenden hızlı eritebilir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Güncel oranı nasıl doğrularım?
          </h2>
          <p>
            Hepsiburada bu oranları dönem dönem günceller; sayfadaki örnek rakamlar genel bir fikir
            vermek içindir. Ürününüze özel kesin oranı, hesaplayıcıdaki kategori aramasına ürün adını
            yazarak (örn. &quot;kulaklık&quot;, &quot;şarj kablosu&quot;, &quot;android telefon&quot;)
            anında görebilirsiniz.
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
            Pazarkar hesaplayıcısında Hepsiburada&apos;yı seçip alt kategorinizi arayarak güncel komisyon
            oranını otomatik uygulayabilir, kargo ve hizmet bedeliyle birlikte net kârı saniyeler içinde
            görebilirsiniz.
          </p>

          <GuideCta title="Hepsiburada elektronik kârını şimdi hesapla" />
          <RelatedGuides currentPath="/hepsiburada-elektronik-komisyon-hesaplama" />
        </div>
      </div>
    </main>
  );
}
