import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hepsiburada Komisyon Hesaplama Rehberi",
  description:
    "Hepsiburada komisyon oranlarıyla net kâr hesaplama adımları: kategori seçimi, iade etkisi, kargo maliyeti ve minimum satış fiyatı planı.",
};

export default function HepsiburadaKomisyonHesaplamaPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          Hepsiburada komisyon hesaplama: Kârlı satış için detaylı yol haritası
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            Hepsiburada&apos;da ürün fiyatı belirlerken sadece komisyon oranını görmek yeterli değildir.
            Gerçek sonuç, platform kesintileri ile operasyon maliyetlerinin birlikte değerlendirilmesiyle
            ortaya çıkar. Satış fiyatı, komisyon, kargo, paketleme, tahsilat ve kampanya etkisini tek
            tabloda görmeden karar veren satıcılar çoğu zaman ciro büyütse de net marjda beklenen sonuca
            ulaşamaz. Bu sayfa, Hepsiburada odaklı kârlılık hesabını anlaşılır adımlarla ele alır.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Hepsiburada komisyonu nasıl doğru okunmalı?
          </h2>
          <p>
            Komisyon oranı kategoriye göre değişir ve bu oran ürünün hakediş yapısını doğrudan etkiler.
            Yanlış kategori eşlemesi, beklediğinizden daha yüksek kesinti anlamına gelebilir. Bu yüzden
            ürününüzün hangi kategoriye girdiğini doğrulamak ilk adımdır. Komisyonu doğru aldıktan sonra
            tahsilat yönetim bedeli, sabit hizmet bedelleri ve varsa ek platform ücretlerini de denklemde
            tutmanız gerekir. Aksi halde modeliniz gerçekteki hakedişten sapar.
          </p>
          <p>
            Komisyon hesaplaması tek başına bir oran oyunu değildir; matrahın hangi fiyat olduğu da önem
            taşır. Kampanya dönemlerinde müşterinin ödediği efektif fiyat ile liste fiyatı arasında fark
            oluşur. Bu farkın kesintilere etkisi kârlılığı ciddi şekilde değiştirir. Bu nedenle kampanyalı
            ve kampanyasız senaryoları ayrı hesaplamak her zaman daha sağlıklıdır.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Sık gözden kaçan giderler: kargo, iade, paketleme, reklam
          </h2>
          <p>
            Kargo maliyeti satıcı marjını en hızlı aşındıran kalemlerden biridir. Desi artışı, taşıyıcı
            değişimi veya dönemsel ücret güncellemeleri nedeniyle ürün bazında kargo gideri farklılaşabilir.
            Özellikle düşük marjlı ürünlerde 10-20 TL fark bile tüm kârı silebilir. Paketleme gideri küçük
            görünse de yüksek sipariş adedinde toplam etki büyür. Bu yüzden sipariş başına tüm sabit gideri
            sistematik biçimde eklemek gerekir.
          </p>
          <p>
            İade oranı, e-ticaret kârlılığında belirleyici bir risktir. Ürünün kategori dinamikleri,
            müşteri beklentisi ve teslimat kalitesi iade olasılığını etkiler. Modelinizde iade payını sıfır
            kabul etmek, tahmininizi iyimser hale getirir. Benzer şekilde reklam gideri de özellikle yoğun
            rekabette zorunlu bir maliyet unsuruna dönüşebilir. Reklamsız satışla elde edilen marjı
            gerçekçi bir taban senaryo, reklamlı satış marjını ise büyüme senaryosu olarak izlemek faydalı
            olur.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Minimum satış fiyatı ve hedef marj planı
          </h2>
          <p>
            Karlı büyüme için önce ürün bazında başa baş fiyatı belirlemelisiniz. Bunun için alış maliyeti,
            komisyon, kargo, paketleme, hizmet bedelleri, iade ve reklam etkisini aynı hesapta toplamak
            gerekir. Ardından hedeflediğiniz net kâr oranını ekleyerek minimum satış fiyatını
            oluşturabilirsiniz. Bu yaklaşım fiyat indirimlerinde ne kadar hareket alanınız olduğunu da net
            gösterir.
          </p>
          <p>
            Ürün portföyü büyüdükçe manuel hesaplama yerine standart bir araçla ilerlemek büyük zaman
            kazandırır. Ayrıca kategori oranları ve operasyon giderleri dönemsel olarak değişebildiği için
            modeli düzenli güncellemek gerekir. Özellikle kampanya dönemleri öncesinde fiyat eşiği ve
            marj hedefinizi revize etmek, sonradan sürpriz zararlar yaşamanızı engeller.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Hepsiburada satışları için pratik hesaplama aracı
          </h2>
          <p>
            Ana sayfadaki hesaplama aracı, Hepsiburada komisyon ve gider yapısını tek ekranda analiz ederek
            net kârı hızlıca görmenize yardımcı olur. Ürün maliyeti, komisyon oranı, kargo ve kampanya
            bilgilerini girdiğinizde anlık sonuç alabilir; farklı fiyat senaryolarını karşılaştırabilirsiniz.
            Böylece fiyat kararlarını sezgi yerine veriye dayalı şekilde alırsınız.
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm font-medium text-[#0B1F3B]">
              Hepsiburada komisyon ve net kârını hemen hesapla
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex rounded-xl bg-[#0B1F3B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#122b4f]"
            >
              Hesaplama aracına git
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
