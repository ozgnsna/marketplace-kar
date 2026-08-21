/**
 * `data/n11-kargo-fiyatlari-source.tsv` dosyasından
 * `data/n11KargoFiyatlari.generated.json` üretir.
 *
 * Kaynak: n11 Özel Kargo Kampanyası sayfası
 * (https://www.n11.com/kampanyalar/ozel-kargo-kampanyasi) — desi/kg başına
 * anlaşmalı kargo fiyatları, 6 kargo firması için (Aras, Sürat, PTT, Yurtiçi,
 * Kolay Gelsin, DHL e-Commerce).
 *
 * NOT: Bu fiyatlar sık güncelleniyor (mağaza destek duyurularında ayda
 * birkaç kez "Kargo Fiyatlarındaki Güncelleme" bildirimi çıkıyor) — TSV'yi
 * kampanya sayfasındaki güncel tablo ile senkron tutmak gerekir.
 *
 * TSV sütunları (tab): desiKg, Aras Kargo, Sürat Kargo, PTT Kargo,
 * Yurtiçi Kargo, Kolay Gelsin, DHL e-Commerce
 *
 * Satırlar: "Dosya" (evrak), 1..100 (kg/desi kademeleri), "+" (100 üzeri her
 * ek kg/desi için birim fiyat).
 *
 * Kullanım: node scripts/build-n11-kargo-from-tsv.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TSV_PATH = path.join(root, "data", "n11-kargo-fiyatlari-source.tsv");
const OUT_PATH = path.join(root, "data", "n11KargoFiyatlari.generated.json");

const CARRIER_KEYS = ["aras", "surat", "ptt", "yurtici", "kolayGelsin", "dhl"];

function parseTRY(cell) {
  const s = String(cell ?? "").trim();
  if (!s || s === "-") return null;
  const n = parseFloat(s.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function buildRows(tsvText) {
  const lines = tsvText.split(/\r?\n/).map((l) => l.replace(/^﻿/, ""));
  const rows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (i === 0 && /desiKg/i.test(line)) continue;

    const parts = line.split("\t");
    if (parts.length < 7) {
      console.warn("Atlanan satır (7 sütun gerekli):", line.slice(0, 120));
      continue;
    }

    const tier = parts[0]?.trim() ?? "";
    const row = { tier };
    CARRIER_KEYS.forEach((key, idx) => {
      row[key] = parseTRY(parts[idx + 1]);
    });
    rows.push(row);
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
  console.error("N11 kargo satır:", data.length, "→", OUT_PATH);
}

main();
