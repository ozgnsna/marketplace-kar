/**
 * Trendyol komisyon tablosunu TSV'den okuyup `commissionCategories.generated.json`
 * içindeki `trendyol` dizisini üretir.
 *
 * TSV sütunları (tab ile ayrılmış):
 * Kategori | Alt Kategori | Ürün Grubu | Kategori Komisyon % (KDV Dahil)
 *
 * Kullanım: node scripts/build-trendyol-commission-from-tsv.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TSV_PATH = path.join(root, "data", "trendyol-commission-source.tsv");
const OUT_PATH = path.join(root, "data", "commissionCategories.generated.json");

function keywordsFromPath(fullPath) {
  return [
    ...new Set(
      fullPath
        .split(/[,>&]|\s+/)
        .map((x) => x.trim().toLocaleLowerCase("tr-TR"))
        .filter((w) => w.length > 1)
    ),
  ].slice(0, 45);
}

function parsePct(cell) {
  const s = String(cell ?? "").trim();
  const m = s.match(/^([\d.,]+)\s*%?$/);
  if (!m) return NaN;
  return parseFloat(m[1].replace(",", "."));
}

function buildRows(tsvText) {
  const lines = tsvText.split(/\r?\n/).map((l) => l.replace(/^\uFEFF/, ""));
  const rows = [];
  let seq = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (i === 0 && /Kategori/i.test(line) && /Alt Kategori/i.test(line)) continue;

    const parts = line.split("\t");
    if (parts.length < 4) {
      console.warn("Atlanan satır (en az 4 sütun gerekli):", line.slice(0, 120));
      continue;
    }

    const kategori = parts[0]?.trim() ?? "";
    const alt = parts[1]?.trim() ?? "";
    const urun = parts[2]?.trim() ?? "";
    const commission = parsePct(parts[3]);
    if (!kategori || !Number.isFinite(commission)) {
      console.warn("Atlanan satır:", line.slice(0, 120));
      continue;
    }

    const segments = [kategori, alt, urun].filter(Boolean);
    const fullPathRaw = segments.join(" > ");
    const fullPath =
      fullPathRaw.length > 220 ? fullPathRaw.slice(0, 217) + "…" : fullPathRaw;
    const subCatRaw = urun;
    const subCategory =
      subCatRaw.length > 90 ? subCatRaw.slice(0, 87) + "…" : subCatRaw;

    seq += 1;
    rows.push({
      id: `ty-${seq}-${seq}`,
      platform: "trendyol",
      mainCategory: kategori,
      subCategory,
      fullPath,
      keywords: keywordsFromPath(fullPathRaw),
      commissionRate: commission,
      commissionLabel: `%${commission}`,
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
  const trendyol = buildRows(tsvText);

  let existing = { trendyol: [], hepsiburada: [] };
  if (fs.existsSync(OUT_PATH)) {
    existing = JSON.parse(fs.readFileSync(OUT_PATH, "utf8"));
  }

  const out = {
    trendyol,
    hepsiburada: Array.isArray(existing.hepsiburada) ? existing.hepsiburada : [],
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 0), "utf8");
  console.error("Trendyol satır:", trendyol.length, "→", OUT_PATH);
}

main();
