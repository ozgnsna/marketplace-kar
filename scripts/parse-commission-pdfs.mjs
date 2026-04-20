/**
 * PDF dosyalarından metin çıkarıp komisyon kategorileri JSON üretir.
 * Trendyol: 6. sütun = Kategori Komisyon %
 *
 * Kullanım: node scripts/parse-commission-pdfs.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFParse } from "pdf-parse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TRENDYOL_PDF = path.join(
  process.env.TRENDYOL_PDF ||
    "C:/Users/ozgun/AppData/Roaming/Cursor/User/workspaceStorage/59431492c3c83bb9b448f6cbcaf52774/pdfs/406aa87f-c20d-4ed9-8a06-11e1b41ba7c4/guncel_trendyol_komisyon_oranlari.pdf"
);
const HB_PDF = path.join(
  process.env.HB_PDF ||
    "C:/Users/ozgun/AppData/Roaming/Cursor/User/workspaceStorage/59431492c3c83bb9b448f6cbcaf52774/pdfs/65a5b475-f273-44e5-b0f9-3f0fcc24e3a0/hepsiburadakomisyon.pdf"
);

async function pdfToText(filePath) {
  const buf = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buf });
  const result = await parser.getText();
  await parser.destroy();
  return result.text || "";
}

/** Yeni veri satırı: `12 \tModa \t...` — `28 \t21.50%` gibi vade satırları hariç */
function isTrendyolDataRowStart(line) {
  if (!/^\d+\s+\t/.test(line)) return false;
  const parts = line.split("\t").map((s) => s.trim());
  if (parts.length < 2) return false;
  if (/^[\d.]+%$/.test(parts[1])) return false;
  return true;
}

function splitTrendyolBlocks(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let cur = [];
  for (const line of lines) {
    const t = line.replace(/^\uFEFF/, "");
    if (/^Kolon No:/i.test(t)) continue;
    if (/^No\s*\t/i.test(t) && /Kategori/i.test(t)) continue;
    if (/^--\s*\d+\s+of\s+\d+\s+--$/.test(t.trim())) continue;
    if (isTrendyolDataRowStart(t)) {
      if (cur.length) blocks.push(cur.join("\n"));
      cur = [t];
    } else if (cur.length) cur.push(t);
  }
  if (cur.length) blocks.push(cur.join("\n"));
  return blocks;
}

function parseTrendyolBlock(block) {
  const lines = block.split(/\n/);
  if (!lines.length) return null;
  const first = lines[0];
  if (!isTrendyolDataRowStart(first)) return null;

  const parts = first.split("\t").map((s) => s.trim());
  if (parts.length < 4) return null;
  const no = parts[0];
  const kategori = parts[1] || "";
  const alt = parts[2] || "";

  let vade = "";
  let commission = NaN;
  let urun = "";

  if (
    parts.length >= 6 &&
    /^\d+$/.test(parts[4]) &&
    /^[\d.]+%$/.test(parts[5])
  ) {
    urun = parts[3];
    vade = parts[4];
    commission = parseFloat(parts[5].replace("%", ""));
  } else {
    const urunChunks = [parts.slice(3).join("\t").trim()];
    let i = 1;
    for (; i < lines.length; i++) {
      const line = lines[i];
      const vm = line.match(/^\s*(\d+)\s+([\d.]+)\s*%/);
      if (vm) {
        vade = vm[1];
        commission = parseFloat(vm[2]);
        break;
      }
      urunChunks.push(line.trim());
    }
    if (!Number.isFinite(commission)) return null;
    urun = urunChunks.join(" ").replace(/\s+/g, " ").trim();
  }

  if (!Number.isFinite(commission)) return null;
  const segments = [kategori, alt, urun].filter(Boolean);
  const fullPath = segments.join(" > ");
  const keywords = [
    ...new Set(
      fullPath
        .split(/[,>&]|\s+/)
        .map((x) => x.trim().toLowerCase())
        .filter((w) => w.length > 1)
    ),
  ].slice(0, 45);

  return {
    no,
    kategori,
    alt,
    urun,
    fullPath,
    keywords,
    commissionRate: commission,
    commissionLabel: `%${commission}`,
  };
}

function parseTrendyol(text) {
  const blocks = splitTrendyolBlocks(text);
  const rows = [];
  let seq = 0;
  const seen = new Set();

  for (const block of blocks) {
    const p = parseTrendyolBlock(block);
    if (!p) continue;
    const key = `${p.no}|${p.fullPath}|${p.commissionRate}`;
    if (seen.has(key)) continue;
    seen.add(key);
    seq += 1;
    rows.push({
      id: `ty-${p.no}-${seq}`,
      platform: "trendyol",
      mainCategory: p.kategori,
      subCategory: p.urun.length > 90 ? p.urun.slice(0, 87) + "…" : p.urun,
      fullPath: p.fullPath.length > 220 ? p.fullPath.slice(0, 217) + "…" : p.fullPath,
      keywords: p.keywords,
      commissionRate: p.commissionRate,
      commissionLabel: p.commissionLabel,
    });
  }
  return rows;
}

/** HB PDF tablo başlığı / (+KDV) tekrarlarını kaldırır */
function cleanHepsiburadaPath(raw) {
  let p = raw
    .replace(/^(\+?\d+\s*)?(i̇ş|iş|İş)\s+günü\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
  p = p.replace(
    /^\(\+KDV\)\s*Marka\s+Marka\s+Kategori\s+Komisyon\s*\(\+KDV\)\s*Vade\s+/i,
    ""
  );
  p = p.replace(/^\(\+KDV\)\s*Marka\s+Marka\s+Kategori\s+Komisyon\s+Vade\s+/i, "");
  p = p.replace(/^Marka\s+Marka\s+Kategori\s+Komisyon\s*\(\+KDV\)\s*Vade\s+/i, "");
  p = p.replace(/^Marka\s+Marka\s+Kategori\s+Komisyon\s+Vade\s+/i, "");
  p = p.replace(/^Marka\s+Marka\s+Kategori\s+Komisyon\s+/i, "");
  p = p.replace(/^\(\+KDV\)\s*Vade\s+/i, "");
  p = p.replace(/^\(\+KDV\)\s*/g, "");
  p = p.replace(/^Vade\s+/i, "");
  return p.replace(/\s+/g, " ").trim();
}

function parseHepsiburada(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length);
  const rows = [];
  let buf = [];
  let seq = 0;

  function makeHbRow(pathPart, rateStr) {
    let p = cleanHepsiburadaPath(pathPart);
    const pct = Math.round(parseFloat(rateStr.replace(",", ".")) * 100) / 100;
    if (!Number.isFinite(pct) || p.length < 4) return;
    if (/^Ana Kategori$/i.test(p)) return;
    if (/^Komisyon$/i.test(p)) return;
    if (/^Marka Kategori$/i.test(p)) return;
    if (/^Vade$/i.test(p)) return;
    if (/^\(\+KDV\)$/i.test(p)) return;

    const parts = p.split(/\s+/).filter(Boolean);
    const main = parts[0] || "Genel";
    const sub = parts.slice(1, 6).join(" ") || p;
    const fullPath = p.length > 260 ? p.slice(0, 257) + "…" : p;

    seq += 1;
    rows.push({
      id: `hb-${seq}`,
      platform: "hepsiburada",
      mainCategory: main,
      subCategory: sub.length > 120 ? sub.slice(0, 117) + "…" : sub,
      fullPath,
      keywords: [
        ...new Set(
          p.split(/[,/&]/).flatMap((x) => x.trim().split(/\s+/)).filter((w) => w.length > 1).map((w) => w.toLowerCase())
        ),
      ].slice(0, 55),
      commissionRate: pct,
      commissionLabel: `%${pct}`,
    });
  }

  for (const line of lines) {
    if (/^EK\.4|^--\s*\d+\s+of|^V12-/i.test(line)) {
      buf = [];
      continue;
    }
    if (/^Ana Kategori Kategori Ürün/i.test(line)) {
      buf = [];
      continue;
    }

    const full = line.match(/^(.+?)\s+([\d,\.]+)%\s*Teslimat\s*$/i);
    if (full) {
      const pathEnd = full[1].trim();
      const rate = full[2];
      const pathPart = [buf.join(" "), pathEnd].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
      makeHbRow(pathPart, rate);
      buf = [];
      continue;
    }

    const rateOnly = line.match(/^([\d,\.]+)%\s*Teslimat\s*$/i);
    if (rateOnly) {
      const pathPart = buf.join(" ").replace(/\s+/g, " ").trim();
      makeHbRow(pathPart, rateOnly[1]);
      buf = [];
      continue;
    }

    if (/^\+?\d+\s*İş\s*Günü/i.test(line)) continue;

    buf.push(line);
  }

  return rows;
}

async function main() {
  let ty = [];
  let hb = [];

  if (fs.existsSync(TRENDYOL_PDF)) {
    const txt = await pdfToText(TRENDYOL_PDF);
    ty = parseTrendyol(txt);
    console.error("Trendyol rows:", ty.length);
  } else {
    console.error("Trendyol dosyası yok:", TRENDYOL_PDF);
  }

  if (fs.existsSync(HB_PDF)) {
    const txt = await pdfToText(HB_PDF);
    hb = parseHepsiburada(txt);
    console.error("Hepsiburada rows:", hb.length);
  } else {
    console.error("HB dosyası yok:", HB_PDF);
  }

  const out = { trendyol: ty, hepsiburada: hb };
  const outPath = path.join(root, "data", "commissionCategories.generated.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 0), "utf8");
  console.error("Yazıldı:", outPath, "toplam", ty.length + hb.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
