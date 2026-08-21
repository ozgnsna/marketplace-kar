/**
 * `data/n11-commission-source.tsv` dosyasından
 * `data/n11CommissionCategories.generated.json` üretir.
 *
 * Kaynak: N11 Mağaza Destek Merkezi → Komisyon Oranları
 * (https://magazadestek.n11.com/s/komisyon-oranlari)
 *
 * Beklenen sütunlar (tab):
 * id, Üst Kategori, Alt Kategori 1, Alt Kategori 2, Ürün Grubu (Leaf),
 * Komisyon % (KDV Dahil), Pazarlama Hizmet Bedeli %, Pazaryeri Hizmet Bedeli %,
 * Hakediş Süresi (Gün)
 *
 * N11'e özgü not: komisyonun yanında iki ek kesinti daha var —
 * Pazarlama Hizmet Bedeli (kategorilerin büyük çoğunluğunda %1 + KDV, küçük
 * bir alt kümede %0.17 + KDV) ve sabit Pazaryeri Hizmet Bedeli (%0.67 + KDV,
 * tüm kategorilerde aynı). Hakediş süresi de kategoriye göre 5-24 iş günü
 * arasında değişiyor. Bu üç alan generated.json'da marketingFeePercent /
 * marketplaceFeePercent / payoutDays olarak ayrı tutulur.
 *
 * Kullanım: node scripts/build-n11-commission-from-tsv.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TSV_PATH = path.join(root, "data", "n11-commission-source.tsv");
const OUT_PATH = path.join(root, "data", "n11CommissionCategories.generated.json");

function parsePct(cell) {
  const s = String(cell ?? "").trim();
  const m = s.match(/^%?\s*([\d.,]+)/);
  if (!m) return NaN;
  return parseFloat(m[1].replace(",", "."));
}

function parseDays(cell) {
  const digits = String(cell ?? "").replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : NaN;
}

function keywordsFromPath(fullPath) {
  return [
    ...new Set(
      fullPath
        .split(/[,>&/|]+|\s+/)
        .map((x) => x.trim().toLocaleLowerCase("tr-TR"))
        .filter((w) => w.length > 1)
    ),
  ].slice(0, 100);
}

function buildRows(tsvText) {
  const lines = tsvText.split(/\r?\n/).map((l) => l.replace(/^﻿/, ""));
  const rows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (i === 0 && /Üst Kategori/i.test(line) && /id/i.test(line)) continue;

    const parts = line.split("\t");
    if (parts.length < 9) {
      console.warn("Atlanan satır (9 sütun gerekli):", line.slice(0, 120));
      continue;
    }

    const id = parts[0]?.trim() ?? "";
    const ust = parts[1]?.trim() ?? "";
    const alt1 = parts[2]?.trim() ?? "";
    const alt2 = parts[3]?.trim() ?? "";
    const leaf = parts[4]?.trim() ?? "";
    const commission = parsePct(parts[5]);
    const marketingFeePercent = parsePct(parts[6]);
    const marketplaceFeePercent = parsePct(parts[7]);
    const payoutDays = parseDays(parts[8]);

    if (!id || !Number.isFinite(commission)) {
      console.warn("Atlanan satır:", line.slice(0, 120));
      continue;
    }

    const segs = [ust, alt1, alt2, leaf].filter((s) => s.length > 0);
    const fullPath = segs.join(" > ");

    rows.push({
      id,
      platform: "n11",
      mainCategory: ust,
      subCategory: leaf,
      fullPath,
      keywords: keywordsFromPath(fullPath),
      commissionRate: commission,
      commissionLabel: `%${commission}`,
      marketingFeePercent: Number.isFinite(marketingFeePercent) ? marketingFeePercent : 1,
      marketplaceFeePercent: Number.isFinite(marketplaceFeePercent) ? marketplaceFeePercent : 0.67,
      payoutDays: Number.isFinite(payoutDays) ? payoutDays : null,
    });
  }

  return rows;
}

function main() {
  if (!fs.existsSync(TSV_PATH)) {
    console.error("TSV bulunamadı:", TSV_PATH);
    process.exit(1);
  }

  const tsvText = fs.readFileSync(TSV_PATH, "utf8");
  const data = buildRows(tsvText);
  fs.writeFileSync(OUT_PATH, JSON.stringify(data, null, 0), "utf8");
  console.error("N11 satır:", data.length, "→", OUT_PATH);
}

main();
