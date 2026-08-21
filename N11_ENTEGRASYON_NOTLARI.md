# N11 Komisyon + Kargo Verisi — Cursor Entegrasyon Notları

Kaynaklar:
- [N11 Mağaza Destek Merkezi — Komisyon Oranları](https://magazadestek.n11.com/s/komisyon-oranlari), 21.08.2026 itibarıyla. Sayfadaki 38 sayfa / 3719 kategori satırının tamamı çekildi.
- [N11 Özel Kargo Kampanyası](https://www.n11.com/kampanyalar/ozel-kargo-kampanyasi), 21.08.2026 itibarıyla. Desi/kg başına 6 kargo firması için anlaşmalı fiyat tablosunun tamamı + ek ücret tabloları.

## Bu pakette ne var

### Komisyon oranları
- `data/n11-commission-source.tsv` — ham kaynak, Trendyol/Hepsiburada'daki TSV deseniyle aynı mantıkta (elle düzenlenebilir).
- `data/n11CommissionCategories.generated.json` — TSV'den üretilmiş, doğrudan kullanılabilir hâli (3719 kayıt, önceden derlendi).
- `data/n11CommissionCategories.ts` — `hepsiburadaCommissionCategories.ts` ile birebir aynı desende TypeScript sarmalayıcı.
- `scripts/build-n11-commission-from-tsv.mjs` — `build-hepsiburada-commission-from-tsv.mjs` ile aynı desende, TSV'yi JSON'a derleyen script.

### Kargo fiyatları
- `data/n11-kargo-fiyatlari-source.tsv` — ham kaynak, desi/kg kademesi (Dosya, 1-100, "+" = 100 üzeri birim fiyat) × 6 kargo firması.
- `data/n11KargoFiyatlari.generated.json` — TSV'den üretilmiş, kullanıma hazır (102 satır).
- `data/n11KargoFiyatlari.ts` — TS sarmalayıcı + `calculateN11ShippingFee(desiKg, carrier)` yardımcı fonksiyonu.
- `data/n11KargoEkUcretler.ts` — ana tabloya girmeyen diğer veriler: Horoz Lojistik / Ceva Tedarik Zinciri / Ceva Lojistik minimum taşıma bedelleri, sepet tutarına göre kademeli ücret, başarısız teslimat kesinti oranları, ağır kargo eşikleri.
- `scripts/build-n11-kargo-from-tsv.mjs` — TSV → JSON derleme scripti.

**Not:** Kargo fiyatları N11'de sık güncelleniyor (mağaza destek duyurularında ayda birkaç kez "Kargo Fiyatlarındaki Güncelleme" bildirimi çıkıyor) — bu tabloyu periyodik olarak kampanya sayfasından yenilemek gerekecek. Ayrıca kaynak sayfadaki nota göre bu fiyatlara **KDV, Posta Hizmet Bedeli ve SMS gibi ücretler dahil değil**.

## N11'in ücret yapısı (Trendyol/Hepsiburada'dan farklı)

N11'de kategori başına tek bir komisyon oranı değil, üç ayrı kesinti var:

1. **Komisyon Oranı** (`commissionRate`) — kategoriye göre değişir, 3719 kategoride **0 ile 28 arasında 27 farklı değer** görüldü.
2. **Pazarlama Hizmet Bedeli** (`marketingFeePercent`) — kategorilerin ezici çoğunluğunda **%1 + KDV**, küçük bir alt kümede (bazı çocuk/aksesuar kategorileri) **%0.17 + KDV**.
3. **Pazaryeri Hizmet Bedeli** (`marketplaceFeePercent`) — **tüm kategorilerde sabit %0.67 + KDV**. Bu aslında kategori bazlı değil, platform sabiti — istenirse `platformDefaults.ts`'e sabit oran olarak taşınabilir.

Ayrıca her kategoride **Hakediş Süresi** (`payoutDays`, ödemenin kaç iş günü sonra yapıldığı) var — 5, 14, 15, 20, 22, 24 gün olmak üzere 6 farklı değer görüldü.

`ProfitInputs` tipinde (`types/profit.ts`) bugün sadece tek bir `commissionRate` ve tek bir `hizmetBedeli` alanı var. N11 eklenirken karar verilmesi gereken nokta: Pazarlama + Pazaryeri hizmet bedellerinin ikisi birden `hizmetBedeli`/`commissionRate` içine mi toplanacak, yoksa hesaplama motoruna N11'e özgü iki yeni alan mı eklenecek. Veri her ihtimale hazır (üç alan da JSON'da ayrı ayrı duruyor).

## Önerilen entegrasyon adımları (Trendyol/Hepsiburada desenini izleyerek)

1. `types/profit.ts` → `MarketplacePlatform` tipine `"n11"` ekle.
2. `data/platformDefaults.ts` → `platformDefaults` objesine bir `n11` girişi ekle (Pazaryeri Hizmet Bedeli %0.67 sabit oranını buraya taşımak mantıklı olabilir).
3. `data/commissionCategories.ts` içine N11'i üçüncü platform olarak kur:
   - `N11_COMMISSION_CATEGORIES` importla (yeni `n11CommissionCategories.ts` dosyasından),
   - Hepsiburada'daki `mapHbRawToRow` benzeri bir `mapN11RawToRow` yaz (zaten `mainCategory`/`subCategory`/`fullPath`/`keywords` hazır geliyor, ekstra dönüşüm gerekmez),
   - `COMMISSION_CATEGORIES` Record'una `n11: n11Rows` satırını ekle.
4. `package.json` → `scripts` içine ekle:
   ```json
   "generate:n11-commission": "node scripts/build-n11-commission-from-tsv.mjs"
   ```
5. UI tarafında platform seçiciye N11 seçeneğini ekle (mevcut Trendyol/Hepsiburada/Shopier seçim bileşeni neredeyse muhtemelen).
6. Kargo tarafı için: `n11KargoFiyatlari.ts`'teki `calculateN11ShippingFee` fonksiyonu `ProfitInputs.kargo` alanına otomatik değer önermek için kullanılabilir (desi + kargo firması seçince ücret otomatik dolsun diye) — mevcut akışta `kargo` elle giriliyor, N11 için bir "otomatik hesapla" kısayolu eklemek opsiyonel bir iyileştirme.
7. `package.json` → `scripts` içine ayrıca ekle:
   ```json
   "generate:n11-kargo": "node scripts/build-n11-kargo-from-tsv.mjs"
   ```

## Sırada: Pttavm

Aynı akış Pttavm için de tekrarlanacak — Pttavm'nin komisyon ve kargo sayfaları açıldığında aynı yöntemle (tüm sayfalar taranıp) `pttavm-commission-source.tsv` + `pttavmCommissionCategories.generated.json` + `.ts` sarmalayıcı + build script (ve varsa kargo tablosu için aynısı) üretilip bu pakete eklenecek.
