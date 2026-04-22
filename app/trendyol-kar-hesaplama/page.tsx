import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trendyol Kâr Hesaplama Rehberi 2026",
  description:
    "Trendyol satışlarında komisyon, kargo, iade, kampanya ve ek giderleri hesaba katarak net kârınızı doğru hesaplama adımları.",
};

export default function TrendyolKarHesaplamaPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          Trendyol kâr hesaplama: Net kazancı doğru görmek için pratik rehber
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            Trendyol&apos;da ürün satarken en sık yapılan hata, sadece alış ve satış fiyatını karşılaştırıp
            kâr hesabı yapmaktır. Gerçekte ise komisyon, kargo, hizmet bedelleri, reklam harcaması,
            kampanya kesintileri ve iade etkisi gibi birçok kalem net sonucu ciddi şekilde değiştirir. Bu
            nedenle sağlıklı bir analiz için her siparişi bir mini gelir tablosu gibi ele almak gerekir.
            Özellikle hızlı büyümek isteyen satıcılar için cirodan çok net kârı izlemek kritik önemdedir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Trendyol&apos;da kârı belirleyen ana maliyet kalemleri
          </h2>
          <p>
            İlk adım, ürünün size gerçek maliyetini doğru tanımlamaktır. Tedarik fiyatı yanında ithalat
            maliyeti, kur farkı, KDV etkisi ve paketleme gibi kalemleri de eklemeniz gerekir. Sonrasında
            Trendyol komisyon oranı kategoriye göre değiştiği için doğru kategori seçimi çok önemlidir.
            Aynı ürün farklı kategoride listelenirse kârlılık farklı çıkabilir. Buna ek olarak tahsilat
            yönetim bedeli ve sabit platform bedelleri sipariş başına marjınızı aşağı çekebilir.
          </p>
          <p>
            Kargo tarafında satıcının üstlendiği bedel ve desi değişimi de net kârı doğrudan etkiler.
            Bazı satıcılar kargoyu müşteri öder varsayımıyla ilerler; fakat kampanya dönemlerinde bu durum
            değişebilir. Reklam harcaması ayrı bir başlıktır: özellikle rekabeti yüksek kategorilerde
            reklamsız satış zorlaştığı için reklamı opsiyonel değil, planlı bir maliyet unsuru olarak
            düşünmek gerekir. Son olarak iade oranı, kârlı görünen modeli kolayca zarara çevirebileceği
            için senaryoya mutlaka dahil edilmelidir.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Neden sadece komisyon oranına bakmak yetmez?
          </h2>
          <p>
            Bir ürünün komisyonu düşük olsa bile yüksek iade oranı veya agresif kampanya baskısı nedeniyle
            net marj beklenenden düşük olabilir. Tersi de mümkündür: komisyonu görece yüksek bir kategoride
            güçlü tedarik avantajı ve düşük iade oranı sayesinde daha iyi kârlılık yakalanabilir. Bu yüzden
            tek bir yüzde yerine toplam kesinti yükünü ve sipariş başına net kârı ölçmek daha doğru bir
            yaklaşımdır. Satış hacmi büyüdükçe küçük görünen farklar aylık toplamda ciddi tutarlara ulaşır.
          </p>
          <p>
            Doğru ölçüm için iki temel senaryoyu ayrı ayrı çalışmak faydalıdır: liste fiyatı üzerinden
            normal satış ve indirimli/kampanyalı satış. Kampanya döneminde müşterinin ödediği efektif tutar
            düştüğü için gelir tarafı azalır, bazı kesintiler ise devam eder. Bu kırılım yapılmadan verilen
            fiyat kararları çoğu zaman hatalı olur. Satıcı panelinizde gördüğünüz hakediş kayıtları ile
            hesaplama sonuçlarınızı düzenli karşılaştırarak modelinizi zamanla daha da isabetli hale
            getirebilirsiniz.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Fiyatlandırma stratejisi: minimum satış fiyatı nasıl bulunur?
          </h2>
          <p>
            Sağlıklı fiyatlandırmada hedef sadece satış yapmak değil, sürdürülebilir marj üretmektir.
            Bunun için öncelikle kabul edeceğiniz minimum kâr oranını belirleyin. Ardından tüm sabit ve
            değişken giderleri ekleyerek başa baş noktasını hesaplayın. Son adımda hedef kârı bu değerin
            üzerine koyup minimum satış fiyatınızı oluşturun. Bu yöntemi kullanmak, dönemsel kampanyalara
            rağmen zarar yazmadan satışa devam etmenizi sağlar.
          </p>
          <p>
            Ürün portföyü geniş satıcılarda her SKU için tek tek manuel hesap yapmak zor olduğundan,
            kategori bazlı şablonlar oluşturmak verimlidir. Benzer komisyon ve kargo yapısına sahip
            ürünleri gruplandırıp standart varsayımlar tanımlayabilirsiniz. Böylece yeni ürün eklerken
            başlangıç fiyatını çok daha hızlı belirlersiniz. Düzenli güncelleme yaparak komisyon veya
            lojistik değişikliklerini modele işlemek de kritik bir operasyondur.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1F3B]">
            Hesaplama aracını kullanarak hızlı karar verin
          </h2>
          <p>
            Tüm bu adımları tek ekranda pratik şekilde görmek için ana sayfadaki Trendyol ve Hepsiburada
            uyumlu kâr hesaplama aracını kullanabilirsiniz. Araç; komisyon, kargo, kampanya, iade ve diğer
            giderleri birlikte değerlendirerek net kâr ve marjı anında gösterir. Ayrıca hedef fiyat
            planlaması yaparak ürününüzün hangi fiyatın altına düşmemesi gerektiğini hızlıca görebilirsiniz.
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm font-medium text-[#0B1F3B]">
              Trendyol için net kârını şimdi hesapla
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex rounded-xl bg-[#0B1F3B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#122b4f]"
            >
              Ana sayfadaki hesaplama aracına git
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
