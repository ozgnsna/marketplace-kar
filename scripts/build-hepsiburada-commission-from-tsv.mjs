/**
 * `data/hepsiburada-commission-source.tsv` dosyasından
 * `data/hepsiburadaCommissionCategories.generated.json` üretir.
 *
 * Beklenen sütunlar (tab):
 * id, Ana Kategori, Kategori, Ürün Grubu, Komisyon % (KDV Dahil)
 *
 * Kullanım: node scripts/build-hepsiburada-commission-from-tsv.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TSV_PATH = path.join(root, "data", "hepsiburada-commission-source.tsv");
const OUT_PATH = path.join(root, "data", "hepsiburadaCommissionCategories.generated.json");

function parsePct(cell) {
  const s = String(cell ?? "").trim();
  const m = s.match(/^([\d.,]+)\s*%?$/);
  if (!m) return NaN;
  return parseFloat(m[1].replace(",", "."));
}

function formatLabel(rate) {
  const s = rate.toFixed(2).replace(".", ",");
  return `%${s}`;
}

function buildRows(tsvText) {
  const lines = tsvText.split(/\r?\n/).map((l) => l.replace(/^\uFEFF/, ""));
  const rows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (i === 0 && /Ana Kategori/i.test(line) && /id/i.test(line)) continue;

    const parts = line.split("\t");
    if (parts.length < 5) {
      console.warn("Atlanan satır (5 sütun gerekli):", line.slice(0, 120));
      continue;
    }

    const id = parts[0]?.trim() ?? "";
    const ana = parts[1]?.trim() ?? "";
    const kat = parts[2]?.trim() ?? "";
    const urun = parts[3]?.trim() ?? "";
    const rate = parsePct(parts[4]);

    if (!id || !Number.isFinite(rate)) {
      console.warn("Atlanan satır:", line.slice(0, 120));
      continue;
    }

    const segs = [ana, kat, urun].filter((s) => s.length > 0);
    const fullPath = segs.join(" > ");

    rows.push({
      id,
      platform: "hepsiburada",
      fullPath,
      commissionRate: rate,
      commissionLabel: formatLabel(rate),
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
  console.error("Hepsiburada satır:", data.length, "→", OUT_PATH);
}

main();
