/**
 * Hepsiburada komisyon verisini `data/hepsiburada-commission-source.tsv` dosyasına aktarır.
 *
 * Öncelik: `data/hepsiburadaCommissionCategories.generated.json` (üretilmiş liste)
 * Yoksa: `data/hepsiburadaCommissionCategories.ts` içindeki eski dizi satırları (regex, geriye dönük)
 *
 * TSV sütunları: id, Ana Kategori, Kategori, Ürün Grubu, Komisyon % (KDV Dahil)
 *
 * Kullanım: node scripts/export-hepsiburada-ts-to-tsv.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const JSON_PATH = path.join(root, "data", "hepsiburadaCommissionCategories.generated.json");
const TS_PATH = path.join(root, "data", "hepsiburadaCommissionCategories.ts");
const TSV_PATH = path.join(root, "data", "hepsiburada-commission-source.tsv");

function splitFullPath(fullPath) {
  const parts = fullPath
    .split(/\s*>\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return { ana: "", kat: "", urun: "" };
  if (parts.length === 1) return { ana: parts[0], kat: "", urun: "" };
  if (parts.length === 2) return { ana: parts[0], kat: parts[1], urun: "" };
  return {
    ana: parts[0],
    kat: parts[1],
    urun: parts.slice(2).join(" > "),
  };
}

function escapeTsvCell(s) {
  const t = String(s ?? "");
  if (/[\t\n\r"]/.test(t)) return `"${t.replace(/"/g, '""')}"`;
  return t;
}

function rowsFromJson() {
  const raw = fs.readFileSync(JSON_PATH, "utf8");
  const data = JSON.parse(raw);
  return data.map((row) => {
    const { ana, kat, urun } = splitFullPath(row.fullPath);
    return { id: row.id, ana, kat, urun, rate: row.commissionRate };
  });
}

function rowsFromLegacyTs() {
  const src = fs.readFileSync(TS_PATH, "utf8");
  const re =
    /\{\s*id:\s*"([^"]+)"\s*,\s*platform:\s*"hepsiburada"\s*,\s*fullPath:\s*"([^"]*)"\s*,\s*commissionRate:\s*([\d.]+)\s*,\s*commissionLabel:\s*"([^"]*)"\s*\}/g;

  const rows = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    const [, id, fullPath, rateStr] = m;
    const rate = parseFloat(rateStr);
    if (!Number.isFinite(rate)) continue;
    const { ana, kat, urun } = splitFullPath(fullPath);
    rows.push({ id, ana, kat, urun, rate });
  }
  return rows;
}

function main() {
  const rows = fs.existsSync(JSON_PATH) ? rowsFromJson() : rowsFromLegacyTs();

  if (!rows.length) {
    console.error("Kaynak bulunamadı veya satır yok:", JSON_PATH, TS_PATH);
    process.exit(1);
  }

  const lines = [
    ["id", "Ana Kategori", "Kategori", "Ürün Grubu", "Komisyon % (KDV Dahil)"].join("\t"),
    ...rows.map((r) =>
      [
        escapeTsvCell(r.id),
        escapeTsvCell(r.ana),
        escapeTsvCell(r.kat),
        escapeTsvCell(r.urun),
        `${r.rate.toFixed(2)}%`,
      ].join("\t")
    ),
  ];

  fs.writeFileSync(TSV_PATH, lines.join("\n") + "\n", "utf8");
  console.error("Yazıldı:", TSV_PATH, "satır:", rows.length);
}

main();
