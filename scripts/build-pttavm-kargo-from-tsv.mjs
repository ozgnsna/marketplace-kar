/**
 * `data/pttavm-kargo-fiyatlari-source.tsv` dosyasından
 * `data/pttavmKargoFiyatlari.generated.json` üretir.
 *
 * Kaynak: PttAVM Tedarikçi Platformu → Hesap Yönetimi → Entegrasyon Bilgileri
 * (merchant.pttavm.com/account-management/integration-information, satıcı
 * girişi gerektirir) — "PttAVM Kargo Fiyatları" PDF'i (11 sayfa, taranmış/
 * görüntü tabanlı — metin katmanı yok).
 *
 * İlk 101 satır (0-500 Gr/Desi .. 99,01-100 Kg/Desi) kaynak PDF'in ilk 2
 * sayfasından doğrudan görsel olarak (Claude vision ile) okunarak
 * transkribe edildi. 101-1000 arası 900 satır ise PDF'in geri kalan
 * sayfalarından (1, 2, 3, 4, 7, 11) alınan örnek noktalarla doğrulanmış iki
 * doğrusal formülle üretildi:
 *   - 101 ≤ desi ≤ 300:  fiyat = 1253.18 + 7.875 * (desi - 101)
 *   - 301 ≤ desi ≤ 1000: fiyat = 2962.85 + 8.25   * (desi - 301)
 * (300 → 301 arasında PTT'nin tablosunda ani bir kademe sıçraması var.)
 *
 * Bilinen veri notları (kaynak PDF'e ait, transkripsiyon hatası DEĞİL):
 * - Satır "300.0": PDF'de görsel olarak 2820,30 okundu; genel formül 2820,31
 *   verir (kademe sınırındaki tek satırlık yuvarlama farkı). Bu pakette PDF'in
 *   literal değeri (2820.30) kullanıldı.
 * - Satır "642.0": PDF'de 5512,10 yazıyor ama bu, formülün beklediği 5776,10
 *   değeriyle uyuşmuyor ve satır "610.0"ın değeriyle birebir aynı — PTT'nin
 *   kendi PDF'inde bir kopyala-yapıştır hatası olduğu değerlendirildi. Bu
 *   pakette formülden gelen 5776.10 kullanıldı (PDF'in literal 5512,10 değeri
 *   DEĞİL). Cursor tarafında karar değişebilir — kaynak TSV'de bu satırı
 *   elle 5512.1'e çevirip yeniden derlemek yeterli.
 *
 * TSV sütunları (tab): tier, price
 *
 * Kullanım: node scripts/build-pttavm-kargo-from-tsv.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TSV_PATH = path.join(root, "data", "pttavm-kargo-fiyatlari-source.tsv");
const OUT_PATH = path.join(root, "data", "pttavmKargoFiyatlari.generated.json");

/** TSV'deki "price" sütunu: düz nokta-ondalık (77.5, 1253.18, ...) — Türkçe değil. */
function parsePrice(numStr) {
  return parseFloat(String(numStr).trim());
}

/** Tier etiketlerindeki "Kg/Desi" aralıklarında kullanılan Türkçe virgül-ondalık ("1,01" → 1.01). */
function parseTrDecimal(numStr) {
  return parseFloat(String(numStr).trim().replace(",", "."));
}

/** Tier etiketinden (kg cinsinden) [minKg, maxKg] aralığını çıkarır. */
function parseRange(tier) {
  const t = tier.trim();

  // Saf sayısal: "101.0" .. "1000.0" (nokta ondalık, ingilizce format)
  if (/^\d+(\.\d+)?$/.test(t)) {
    const v = parseFloat(t);
    return [v, v];
  }

  // "0-500 Gr/Desi" veya "501-1000 Gr/Desi"
  let m = t.match(/^(\d+)-(\d+)\s*Gr\/Desi$/i);
  if (m) {
    return [parseInt(m[1], 10) / 1000, parseInt(m[2], 10) / 1000];
  }

  // "1,01-2 Kg/Desi" veya "98,01-99 Kg/Desi" (türkçe ondalık: virgül)
  m = t.match(/^([\d,.]+)-([\d,.]+)\s*Kg\/Desi$/i);
  if (m) {
    return [parseTrDecimal(m[1]), parseTrDecimal(m[2])];
  }

  return [NaN, NaN];
}

function loadRows(tsvText) {
  const lines = tsvText.split(/\r?\n/).map((l) => l.replace(/^﻿/, ""));
  const rows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (i === 0 && /^tier\t/i.test(line)) continue;

    const parts = line.split("\t");
    if (parts.length < 2) {
      console.warn("Atlanan satır (2 sütun gerekli):", line.slice(0, 120));
      continue;
    }

    const tier = parts[0].trim();
    const price = parsePrice(parts[1]);
    const [minKg, maxKg] = parseRange(tier);

    if (!tier || !Number.isFinite(price) || !Number.isFinite(minKg) || !Number.isFinite(maxKg)) {
      console.warn("Atlanan/ayrıştırılamayan satır:", line.slice(0, 120));
      continue;
    }

    rows.push({ tier, minKg, maxKg, price });
  }

  return rows;
}

function main() {
  if (!fs.existsSync(TSV_PATH)) {
    console.error("TSV bulunamadı:", TSV_PATH);
    process.exit(1);
  }

  const tsvText = fs.readFileSync(TSV_PATH, "utf8");
  const rows = loadRows(tsvText).sort((a, b) => a.maxKg - b.maxKg);
  fs.writeFileSync(OUT_PATH, JSON.stringify(rows, null, 0), "utf8");
  console.error("PttAVM kargo satır:", rows.length, "→", OUT_PATH);
}

main();
