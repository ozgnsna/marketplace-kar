import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pazaryeri Komisyon Oranları ve Kâr Rehberi",
  description:
    "Trendyol ve Hepsiburada komisyon oranlarının kârlılığa etkisi, kategori seçimi, gider yönetimi ve doğru fiyatlandırma stratejileri.",
};

export default function PazaryeriKomisyonOranlariPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          Pazaryeri komisyon oranları: Sadece yüzde değil, toplam kârlılık resmi
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            E-ticarette en çok sorulan sorulardan biri, “Bu kategorinin komisyonu kaç?” sorusudur. Bu soru
            önemli olsa da tek başına yeterli değildir. Çünkü aynı komisyon oranına sahip iki ürün, farklı
            kargo yapısı, iade oranı, kampanya baskısı ve operasyon gideri nedeniyle tamamen farklı net kâr
            sonuçları üretebilir. Pazaryeri satışlarında doğru strateji, komisyonu merkezde tutup tüm
            maliyetleri aynı tabloda değerlendirmektir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Komisyon oranları neden kategoriye göre değişir?
          </h2>
          <p>
            Pazaryerleri, farklı ürün gruplarındaki rekabet seviyesi, operasyonel maliyet ve iade
            dinamiklerine göre farklı komisyon oranları uygular. Bu nedenle ürününüzün kategori eşleşmesi
            sadece görünürlük açısından değil, finansal performans açısından da kritiktir. Yanlış kategori
            ataması doğrudan fazla kesinti anlamına gelebilir. Özellikle birden fazla benzer alt kategori
            varsa ürün kartını açmadan önce oranları karşılaştırmak gerekir.
          </p>
          <p>
            Trendyol ve Hepsiburada gibi platformlarda komisyon listeleri zaman içinde güncellenebilir.
            Bu yüzden birkaç ay önce çalışan bir marj modeli bugün geçersiz olabilir. Sağlıklı süreç için
            komisyon güncellemelerini düzenli takip etmek, fiyatlama modelinizi belirli aralıklarla revize
            etmek ve yeni oranları satış kararına hızlı yansıtmak gerekir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Komisyon dışında net kârı değiştiren 5 kritik faktör
          </h2>
          <p>
            Birinci faktör ürünün gerçek alış maliyetidir. İthalat, kur, vergi ve yan giderler dahil
            edilmeden yapılan hesaplar eksik kalır. İkinci faktör kargo ve paketleme maliyetidir; özellikle
            desi artışı marja ciddi yük bindirir. Üçüncü faktör kampanya etkisidir: indirimli satışta
            efektif müşteri fiyatı düştüğünde kâr marjı beklenenden hızlı eriyebilir. Dördüncü faktör iade
            oranıdır; iade oranı yüksek kategorilerde nominal marj her zaman gerçeği yansıtmaz. Beşinci
            faktör reklam harcamalarıdır; organik trafik zayıfsa reklamı modelden çıkarmak yanıltıcı olur.
          </p>
          <p>
            Bu kalemler birlikte ele alındığında “komisyonu düşük ürün her zaman daha kârlıdır” yaklaşımı
            çoğu zaman yanlış çıkar. Daha doğru yaklaşım, kategori bazında toplam kesinti yükünü hesaplamak
            ve sipariş başına net kârı karşılaştırmaktır. Böylece ciro odaklı değil, sürdürülebilir kârlılık
            odaklı bir ürün karması oluşturabilirsiniz.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Fiyatlandırma ve marj yönetiminde pratik yöntem
          </h2>
          <p>
            Etkili bir yöntem, her ürün için önce başa baş satış fiyatını hesaplamaktır. Tüm kesintiler
            dahil edildiğinde bu eşik fiyatın altında yapılan satışlar zarar üretir. Sonrasında hedef marj
            ekleyerek minimum satış fiyatını tanımlarsınız. Kampanya dönemleri için ayrıca ikinci bir eşik
            belirlemek, yoğun indirim dönemlerinde kontrolsüz fiyat kırmayı engeller.
          </p>
          <p>
            Operasyon büyüdükçe bu yaklaşımı ürün gruplarına uyarlamak gerekir. Benzer komisyon ve lojistik
            yapısına sahip SKU&apos;ları tek modelde toplayarak karar süreçlerini hızlandırabilirsiniz. Haftalık
            veya aylık periyotlarla gerçekleşen hakediş verilerini kontrol edip model varsayımlarını
            güncellemek, hesaplama doğruluğunu sürekli artırır. Böylece hem marj kaybını azaltır hem de
            fiyat rekabetinde daha güvenli hareket edersiniz.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Güncel oranlar + gerçekçi kâr analizi için tek ekran
          </h2>
          <p>
            Komisyon oranlarını sadece okumak yerine doğrudan satış senaryosuna uygulamak en verimli
            yöntemdir. Ana sayfadaki hesaplama aracı ile ürün maliyeti, kategori komisyonu, kargo, reklam,
            iade ve kampanya etkilerini birlikte değerlendirerek net kârı saniyeler içinde görebilirsiniz.
            Bu sayede hangi ürünün hangi fiyat bandında satılması gerektiğini veriyle belirleyebilir, yanlış
            fiyatlama nedeniyle oluşan görünmez zararları engelleyebilirsiniz.
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm font-medium text-[#0B1F3B]">
              Pazaryeri komisyonlarını net kâra çevirerek analiz et
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex rounded-xl bg-[#0B1F3B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#122b4f]"
            >
              Ana sayfa hesaplama aracını aç
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
