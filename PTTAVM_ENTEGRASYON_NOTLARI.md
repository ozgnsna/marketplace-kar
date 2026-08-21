# PttAVM Komisyon + Kargo Verisi — Cursor Entegrasyon Notları

Kaynaklar (ikisi de PttAVM Tedarikçi Platformu'nun kimlik doğrulamalı satıcı
paneli üzerinden — merchant.pttavm.com/account-management/integration-information —
indirildi, 21.08.2026 itibarıyla):
- **"PttAVM Kategori Bazlı Komisyon Listesi.pdf"** — 118 sayfa, 5034 kategori. Temiz metin katmanlı, tablo grid'i olan bir PDF.
- **"PttAVM Kargo Fiyatları.pdf"** — 11 sayfa. Taranmış/görüntü tabanlı (metin katmanı yok) — veri, sayfa görüntülerinden doğrudan görsel okuma + doğrulanmış formüllerle çıkarıldı (aşağıda detay var).

## Bu pakette ne var

### Komisyon oranları
- `data/pttavm-commission-source.tsv` — ham kaynak, kenar listesi (edge list) formatında: `id, parentId, parentName, name, commissionRate` (elle düzenlenebilir).
- `data/pttavmCommissionCategories.generated.json` — TSV'den üretilmiş, doğrudan kullanılabilir hâli (5034 kayıt, önceden derlendi).
- `data/pttavmCommissionCategories.ts` — N11/Hepsiburada ile aynı desende TypeScript sarmalayıcı (`PTTAVM_COMMISSION_CATEGORIES`).
- `scripts/build-pttavm-commission-from-tsv.mjs` — TSV'yi JSON'a derleyen script.

### Kargo fiyatları
- `data/pttavm-kargo-fiyatlari-source.tsv` — ham kaynak, desi/kg kademesi × fiyat (1001 satır: 0-100 arası 101 kademe + 101-1000 arası tam sayı desi başına 900 satır).
- `data/pttavmKargoFiyatlari.generated.json` — TSV'den üretilmiş, kullanıma hazır (1001 satır, her satırda `tier` etiketinin yanında hesaplanmış `minKg`/`maxKg` de var).
- `data/pttavmKargoFiyatlari.ts` — TS sarmalayıcı + `calculatePttavmShippingFee(desiKg)` yardımcı fonksiyonu.
- `scripts/build-pttavm-kargo-from-tsv.mjs` — TSV → JSON derleme scripti.

## PttAVM'in komisyon yapısı (N11/Trendyol/Hepsiburada'dan farklı)

PttAVM'in kategori ağacı **sabit 2 seviyeli (Ana Kategori > Alt Kategori) değil**,
2 ile 7 seviye arasında değişen bir ağaç — ve N11/Trendyol/Hepsiburada'nın aksine
**sadece yaprak kategorilerin değil, ağaçtaki HER seviyenin kendi komisyon oranı
var**. Örnek: "Elektronik" kendi başına %25, altındaki "Bilgisayar & Tablet" %20,
onun altındaki daha spesifik bir kategori kendi oranını taşıyabiliyor.

Bu, veri modelini etkiliyor: `fullPath` alanı ağaçta yukarı doğru yürüyerek
(parent zincirini takip ederek) inşa edildi, ama bir üründe hangi kategori
seviyesinin seçileceği (en genel mi, en spesifik mi) ürünün kendi kategorizasyon
derinliğine bağlı — `commissionRate` her düğümde bağımsız olarak duruyor, `.ts`
dosyasındaki yorumda bu açıkça belirtildi.

## Kargo verisinin çıkarılma yöntemi (şeffaflık için önemli)

Kaynak PDF taranmış/görüntü tabanlı olduğu için (metin katmanı yok), klasik PDF
metin/tablo çıkarma araçları (pdfplumber, OCR) güvenilir sonuç vermedi. Bunun
yerine:
1. **0 - 100 kg/desi arası (101 satır):** PDF sayfa 1-2'nin yüksek çözünürlüklü
   görüntüsünden doğrudan görsel olarak transkribe edildi.
2. **101 - 1000 kg/desi arası (900 satır):** PDF'in 6 farklı sayfasından
   (1, 2, 3, 4, 7, 11) örneklenen değer noktalarıyla doğrulanan iki doğrusal
   formülle üretildi:
   - 101 ≤ desi ≤ 300: `fiyat = 1253.18 + 7.875 × (desi - 101)`
   - 301 ≤ desi ≤ 1000: `fiyat = 2962.85 + 8.25 × (desi - 301)`

   (300 → 301 arasında PTT'nin tablosunda ani bir kademe sıçraması var; formül
   bu sınırın iki tarafında ayrı ayrı doğrulandı.)

### Bilinen veri notları (kaynak PDF'e ait, transkripsiyon hatası değil)

- **Satır "300.0":** PDF'de görsel olarak **2820,30** okundu; genel formül
  **2820,31** verirdi (kademe sınırındaki 1 kuruşluk yuvarlama farkı, çünkü 300
  formülle hesaplanan bir nokta, 101/301 gibi doğrulanmış bir çapa nokta değil).
  Bu pakette **PDF'in literal değeri (2820.30)** kullanıldı.
- **Satır "642.0":** PDF'de **5512,10** yazıyor, ama bu hem formülün beklediği
  **5776,10** değeriyle uyuşmuyor hem de satır "610.0"ın değeriyle **birebir
  aynı** — PTT'nin kendi PDF'inde bir kopyala-yapıştır hatası olduğu
  değerlendirildi. Bu pakette **formülden gelen 5776.10** kullanıldı. Cursor
  tarafında farklı karar verilirse, kaynak TSV'de bu satırı elle `5512.1`e
  çevirip `npm run generate:pttavm-kargo` ile yeniden derlemek yeterli.

Kaynak sayfada KDV/ek ücret istisnası notu N11'deki kadar net görünmüyordu —
entegrasyon öncesi PttAVM panelinden bu fiyatlara nelerin dahil olduğu teyit
edilmesi önerilir.

### Düzeltilmiş anomali: "#N/A" kategori adı (22.08.2026, canlı sitede tespit edildi)

Komisyon PDF'inin kenar listesinde 13 kategori (id: 24, 26, 27, 28, 29, 30, 31,
32, 33, 34, 35, 36, 4125 — Dizüstü Bilgisayarlar, Tabletler, Veri Depolama,
Bilgisayar Bileşenleri, Çevre Birimleri, Monitörler, Yazılım Ürünleri, Ağ &
Modem, Yazıcı & Aksesuarları, Barkod Ürünleri, Yenilenmiş & İkinci El Ürünler,
Bilgisayar Aksesuarları, Sunucu) `parentId=17` taşıyor, ama **id=17'nin kendi
satırı PDF'te hiç yok** — bu yüzden PTT'nin export'unda bu 13 kategorinin
`parentName` hücresi literal olarak `"#N/A"` yazıyordu (muhtemelen PDF Excel'den
export edilirken bir VLOOKUP/formül hatası). Bu, `fullPath`'e sızıp
`pazarkar.com`'da "#N/A > Dizüstü Bilgisayarlar Aksesuarları" gibi görünüyordu
(119 kayıt etkilendi — 13 doğrudan + tüm alt kategorileri; **komisyon oranları
etkilenmedi**, sadece görüntülenen yol bozuktu).

**Düzeltme:** `pttavm-commission-source.tsv`'de bu 13 satırın `parentName`
sütunu `"#N/A"` yerine **"Bilgisayar & Tablet"** olarak dolduruldu ve JSON
yeniden derlendi. Bu isim PDF'te doğrudan teyit edilmedi — id=17'nin, id=25
("Elektronik > Bilgisayar & Tablet", %20) adlı ayrı/doğru kayıtlı kategoriden
farklı, muhtemelen yeniden yapılandırma sırasında PDF export'ta koptuğu için
kendi satırını kaybetmiş bir **kopya/yetim düğüm** olduğu değerlendirildi —
13 çocuğunun hepsinin (dizüstü, tablet, depolama, bileşen, çevre birimi vb.)
tipik bir "Bilgisayar & Tablet" alt kırılımı olması bu tahmini güçlü kılıyor.
PTT panelinden teyit edilirse ve farklı bir isim çıkarsa, aynı TSV'deki 13
satırda tek noktadan düzeltilip yeniden derlenebilir.

## Önerilen entegrasyon adımları (N11 ile aynı deseni izleyerek)

1. `types/profit.ts` → `MarketplacePlatform` tipine `"pttavm"` ekle (N11
   eklendiyse `"trendyol" | "hepsiburada" | "shopier" | "n11" | "pttavm"`).
2. `data/platformDefaults.ts` → `platformDefaults` objesine bir `pttavm`
   girişi ekle.
3. `data/commissionCategories.ts` içine PttAVM'i kur:
   - `PTTAVM_COMMISSION_CATEGORIES` importla,
   - Hepsiburada/N11'deki `mapHbRawToRow`/`mapN11RawToRow` benzeri bir
     `mapPttavmRawToRow` yaz (zaten `mainCategory`/`subCategory`/`fullPath`/
     `keywords` hazır geliyor),
   - `COMMISSION_CATEGORIES` Record'una `pttavm: pttavmRows` satırını ekle.
   - **Dikkat:** Ağacın her seviyesi kendi oranını taşıdığı için, kategori
     arama/seçim UI'ında kullanıcıya hem genel hem spesifik seviyeleri
     gösterip göstermeyeceğinize karar verin (bkz. yukarıdaki "komisyon
     yapısı" notu).
4. `package.json` → `scripts` içine ekle:
   ```json
   "generate:pttavm-commission": "node scripts/build-pttavm-commission-from-tsv.mjs",
   "generate:pttavm-kargo": "node scripts/build-pttavm-kargo-from-tsv.mjs"
   ```
5. UI tarafında platform seçiciye PttAVM seçeneğini ekle.
6. Kargo tarafı için: `pttavmKargoFiyatlari.ts`'teki
   `calculatePttavmShippingFee(desiKg)` fonksiyonu `ProfitInputs.kargo`
   alanına otomatik değer önermek için kullanılabilir (N11'in
   `calculateN11ShippingFee`'siyle aynı mantık, ama PttAVM'de tek taşıyıcı
   olduğu için `carrier` parametresi yok).

## Durum

N11 ve PttAVM için komisyon + kargo verisi tamamlandı ve teslim edildi. Şu an
için başka bir pazaryeri eklenmesi planlanmıyor.
