/**
 * Yeni komisyon PDF'lerinden oranları okuyup mevcut temiz TSV hiyerarşisini günceller.
 * - Trendyol: marka varyantlarını tekilleştirir, alt/ürün yollarını TSV sözlüğüyle eşler
 * - Hepsiburada: oranları günceller, ürün grubu detayını arama için doldurur
 * - Arama için anahtar kelimeleri zenginleştirir
 *
 * Kullanım:
 *   TRENDYOL_PDF=... HB_PDF=... node scripts/parse-commission-pdfs.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFParse } from "pdf-parse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TRENDYOL_PDF =
  process.env.TRENDYOL_PDF ||
  path.join("C:/Users/ozgun/Downloads", "Trendyol Komisyon Oranları.pdf");
const HB_PDF =
  process.env.HB_PDF ||
  path.join("C:/Users/ozgun/Downloads", "Hepsiburada Komisyon Oranları.pdf");

const TY_TSV = path.join(root, "data", "trendyol-commission-source.tsv");
const HB_TSV = path.join(root, "data", "hepsiburada-commission-source.tsv");
const TY_JSON = path.join(root, "data", "commissionCategories.generated.json");
const HB_JSON = path.join(root, "data", "hepsiburadaCommissionCategories.generated.json");

async function pdfToText(filePath) {
  const buf = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buf });
  const result = await parser.getText();
  await parser.destroy();
  return result.text || "";
}

function norm(s) {
  return String(s ?? "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/&/g, " ")
    .replace(/[^a-z0-9çğıöşü\s/]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keywordsFromPath(fullPath) {
  const parts = fullPath
    .split(/[,>&/|]+|\s+/)
    .map((x) => x.trim().toLocaleLowerCase("tr-TR"))
    .filter((w) => w.length > 1 && !["ve", "veya", "ile", "icin", "için"].includes(w));
  return [...new Set(parts)].slice(0, 100);
}

function escapeTsvCell(s) {
  const t = String(s ?? "");
  if (/[\t\n\r"]/.test(t)) return `"${t.replace(/"/g, '""')}"`;
  return t;
}

function parsePct(cell) {
  const m = String(cell ?? "")
    .trim()
    .match(/^([\d.,]+)\s*%?$/);
  if (!m) return NaN;
  return parseFloat(m[1].replace(",", "."));
}

/* -------------------- Trendyol -------------------- */

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
      if (cur.length) blocks.push(cur);
      cur = [t];
    } else if (cur.length) cur.push(t);
  }
  if (cur.length) blocks.push(cur);
  return blocks;
}

function extractTrendyolPdfRates(text) {
  /** @type {{ kategori: string, blob: string, rate: number }[]} */
  const out = [];
  const seen = new Set();

  for (const block of splitTrendyolBlocks(text)) {
    const first = block[0];
    const head = first.split("\t").map((s) => s.trim());
    const kategori = (head[1] || "").trim();
    if (!kategori) continue;

    const joined = block.join("\n");
    const rateMatch = joined.match(/\t(\d{1,2})\s+\t([\d.]+)%/);
    if (!rateMatch) continue;
    const rate = parseFloat(rateMatch[2]);
    if (!Number.isFinite(rate)) continue;

    let mid = joined.slice(0, rateMatch.index).replace(/^\d+\s*\t[^\t]*\t/, "");
    mid = mid.replace(/\n/g, " ").replace(/\t/g, " ").replace(/\s+/g, " ").trim();

    const key = `${norm(kategori)}|${norm(mid)}|${rate}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ kategori, blob: mid, rate });
  }
  return out;
}

function loadTrendyolTsv(tsvText) {
  const lines = tsvText.split(/\r?\n/).map((l) => l.replace(/^\uFEFF/, ""));
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (i === 0 && /Kategori/i.test(line) && /Alt Kategori/i.test(line)) continue;
    const parts = line.split("\t");
    if (parts.length < 4) continue;
    const kategori = parts[0]?.trim() ?? "";
    const alt = parts[1]?.trim() ?? "";
    const urun = parts[2]?.trim() ?? "";
    const rate = parsePct(parts[3]);
    if (!kategori || !Number.isFinite(rate)) continue;
    rows.push({ kategori, alt, urun, rate, matched: false });
  }
  return rows;
}

function scoreTyMatch(tsvRow, pdfRow) {
  if (norm(tsvRow.kategori) !== norm(pdfRow.kategori)) return 0;
  const blob = norm(pdfRow.blob);
  const alt = norm(tsvRow.alt);
  const urun = norm(tsvRow.urun);
  if (!alt) return 0;
  let score = 0;
  if (blob.includes(alt)) score += 50 + Math.min(alt.length, 40);
  if (urun && blob.includes(urun)) score += 80 + Math.min(urun.length, 60);
  else if (urun) {
    // Ürün listesindeki parçalardan en az 2'si blob'da
    const bits = urun
      .split(/[/,]/)
      .map((x) => x.trim())
      .filter((x) => x.length >= 3);
    const hit = bits.filter((b) => blob.includes(b)).length;
    if (hit >= 2) score += 40 + hit * 5;
    else if (hit === 1 && bits.length === 1) score += 35;
  }
  // Tam birleşik eşleşme (PDF alt+ürün yapışık)
  const glued = norm(tsvRow.alt + tsvRow.urun);
  if (glued.length > 8 && blob.includes(glued.replace(/\s+/g, ""))) score += 100;
  if (blob === norm(`${tsvRow.alt} ${tsvRow.urun}`)) score += 200;
  return score;
}

function mergeTrendyol(tsvRows, pdfRows) {
  const updated = tsvRows.map((r) => ({ ...r }));
  let updates = 0;
  let added = 0;

  // Her TSV satırı için en iyi PDF eşleşmesini bul (ters yön: TSV→PDF)
  for (let i = 0; i < updated.length; i++) {
    let bestPdf = null;
    let bestScore = 0;
    for (const pdf of pdfRows) {
      const sc = scoreTyMatch(updated[i], pdf);
      if (sc > bestScore) {
        bestScore = sc;
        bestPdf = pdf;
      }
    }
    if (bestPdf && bestScore >= 50) {
      if (updated[i].rate !== bestPdf.rate) {
        updated[i].rate = bestPdf.rate;
        updates += 1;
      }
      updated[i].matched = true;
    }
  }

  // Eşleşmeyen PDF satırlarını ekleme — hiyerarşiyi kirletmesin
  return { rows: updated, updates, added };
}

function buildTrendyolJson(rows) {
  return rows.map((r, idx) => {
    const segments = [r.kategori, r.alt, r.urun].filter(Boolean);
    const fullPathRaw = segments.join(" > ");
    return {
      id: `ty-${idx + 1}`,
      platform: "trendyol",
      mainCategory: r.kategori,
      subCategory: r.urun
        ? r.urun.length > 120
          ? r.urun.slice(0, 117) + "…"
          : r.urun
        : r.alt.length > 120
          ? r.alt.slice(0, 117) + "…"
          : r.alt,
      fullPath: fullPathRaw.length > 360 ? fullPathRaw.slice(0, 357) + "…" : fullPathRaw,
      keywords: keywordsFromPath(fullPathRaw),
      commissionRate: r.rate,
      commissionLabel: `%${r.rate}`,
    };
  });
}

function writeTrendyolTsv(rows) {
  const lines = [
    ["Kategori", "Alt Kategori", "Ürün Grubu", "Kategori Komisyon % (KDV Dahil)"].join("\t"),
    ...rows.map((r) =>
      [
        escapeTsvCell(r.kategori),
        escapeTsvCell(r.alt),
        escapeTsvCell(r.urun),
        `${Number(r.rate).toFixed(2)}%`,
      ].join("\t")
    ),
  ];
  fs.writeFileSync(TY_TSV, lines.join("\n") + "\n", "utf8");
}

/* -------------------- Hepsiburada -------------------- */

function extractHepsiburadaPdfRows(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const rows = [];
  let buf = [];

  function isVadeLine(line) {
    // Örn. "+7 İş Günü" / "+24 iş Günü" — \b Unicode'da güvenilir değil
    return /^\+?\d+\s+\S+\s+[Gg][uüUÜ]n[uüUÜ]\s*$/.test(line.trim());
  }

  function cleanBlob(pathPart) {
    let p = pathPart
      .replace(/\+?\d+\s+\S+\s+[Gg][uüUÜ]n[uüUÜ]/g, " ")
      .replace(
        /^\(\+KDV\)\s*Marka\s+Marka\s+Kategori\s+Komisyon\s*\(\+KDV\)\s*Vade\s+/i,
        ""
      )
      .replace(/^\(\+KDV\)\s*Marka\s+Marka\s+Kategori\s+Komisyon\s+Vade\s+/i, "")
      .replace(/^Marka\s+Marka\s+Kategori\s+Komisyon\s*\(\+KDV\)\s*Vade\s+/i, "")
      .replace(/^Marka\s+Marka\s+Kategori\s+Komisyon\s+Vade\s+/i, "")
      .replace(/^Marka\s+Marka\s+Kategori\s+Komisyon\s+/i, "")
      .replace(/^\(\+KDV\)\s*Vade\s+/i, "")
      .replace(/^\(\+KDV\)\s*/i, "")
      .replace(/^Vade\s+/i, "")
      .replace(/\s+/g, " ")
      .trim();
    return p;
  }

  function push(pathPart, rateStr) {
    let p = cleanBlob(pathPart);
    p = p
      .replace(/^\(\+KDV\)\s*/i, "")
      .replace(/^Vade\s+/i, "")
      .trim();
    const pct = Math.round(parseFloat(String(rateStr).replace(",", ".")) * 100) / 100;
    if (!Number.isFinite(pct) || p.length < 4) return;
    if (/^(Ana Kategori|Komisyon|Vade|Marka)/i.test(p)) return;
    rows.push({ blob: p, rate: pct });
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
    if (isVadeLine(line)) continue;

    const full = line.match(/^(.+?)\s+([\d,\.]+)%\s*Teslimat\s*$/i);
    if (full) {
      push([buf.join(" "), full[1]].filter(Boolean).join(" ").replace(/\s+/g, " "), full[2]);
      buf = [];
      continue;
    }
    const rateOnly = line.match(/^([\d,\.]+)%\s*Teslimat\s*$/i);
    if (rateOnly) {
      push(buf.join(" ").replace(/\s+/g, " "), rateOnly[1]);
      buf = [];
      continue;
    }
    buf.push(line);
  }
  return rows;
}

function loadHepsiburadaTsv(tsvText) {
  const lines = tsvText.split(/\r?\n/).map((l) => l.replace(/^\uFEFF/, ""));
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (i === 0 && /Ana Kategori/i.test(line) && /id/i.test(line)) continue;
    const parts = line.split("\t");
    if (parts.length < 5) continue;
    const id = parts[0]?.trim() ?? "";
    const ana = parts[1]?.trim() ?? "";
    const kat = parts[2]?.trim() ?? "";
    const urun = parts[3]?.trim() ?? "";
    const rate = parsePct(parts[4]);
    if (!id || !Number.isFinite(rate)) continue;
    rows.push({ id, ana, kat, urun, rate });
  }
  return rows;
}

function scoreHbMatch(tsvRow, pdfBlob) {
  const blob = norm(pdfBlob);
  const ana = norm(tsvRow.ana);
  const kat = norm(tsvRow.kat);
  if (!ana || (!blob.startsWith(ana) && !blob.includes(` ${ana} `) && !blob.includes(ana))) return 0;
  let score = 20 + Math.min(ana.length, 20);
  if (kat && blob.includes(kat)) {
    score += 60 + Math.min(kat.length, 40);
    if (blob.includes(`${ana} ${kat}`) || (blob.startsWith(ana) && blob.includes(kat))) {
      score += 40;
    }
  } else if (kat) {
    const bits = kat.split(/[/\s]+/).filter((x) => x.length >= 3);
    const hit = bits.filter((b) => blob.includes(b)).length;
    if (hit === 0) return 0;
    score += hit * 10;
  }
  // Tam kategori adı PDF'de yoksa (çok genel satırlar) yanlış zenginleştirmeyi engelle
  // Örn. "Aksesuar > Aksesuar" satırına takı detayı yapışmasın
  if (kat && ana === kat) {
    // Genel satır: blob "Ana Ana ..." veya "Ana ürün..." olmalı; başka alt kategori adı içeriyorsa düşür
    const foreign = ["altın / takı", "saat/gözlük", "valiz", "bebek"].some((f) => blob.includes(f) && !kat.includes(f.split(" ")[0]));
    if (foreign && !blob.includes(`${ana} ${ana}`)) score -= 80;
  }
  if (tsvRow.urun) {
    const bits = norm(tsvRow.urun)
      .split(/[/,]/)
      .map((x) => x.trim())
      .filter((x) => x.length >= 3);
    const hit = bits.filter((b) => blob.includes(b)).length;
    score += hit * 8;
  }
  return score;
}

/** PDF blob'dan ana/kat sonrası kalan ürün listesini çıkar */
function extractHbUrunDetail(pdfBlob, ana, kat) {
  let rest = pdfBlob.replace(/\s+/g, " ").trim();
  const stripOnce = (prefix) => {
    if (!prefix) return;
    const nRest = rest.toLocaleLowerCase("tr-TR");
    const nPre = prefix.toLocaleLowerCase("tr-TR");
    if (nRest.startsWith(nPre)) {
      rest = rest.slice(prefix.length).trim();
    }
  };
  stripOnce(ana);
  stripOnce(kat);
  return rest.replace(/^[,/&\-\s]+/, "").replace(/\s+/g, " ").trim();
}

function mergeHepsiburada(tsvRows, pdfRows) {
  const updated = tsvRows.map((r) => ({ ...r }));
  let updates = 0;
  let enriched = 0;

  // Her TSV satırı → en iyi PDF (çakışmada yanlış satırı ezmeyi azaltır)
  for (let i = 0; i < updated.length; i++) {
    let bestPdf = null;
    let bestScore = 0;
    for (const pdf of pdfRows) {
      const sc = scoreHbMatch(updated[i], pdf.blob);
      if (sc > bestScore) {
        bestScore = sc;
        bestPdf = pdf;
      }
    }
    if (bestPdf && bestScore >= 50) {
      if (updated[i].rate !== bestPdf.rate) {
        updated[i].rate = bestPdf.rate;
        updates += 1;
      }
      const isGeneric = norm(updated[i].ana) === norm(updated[i].kat);
      const anaNorm = norm(updated[i].ana);
      let enrichPdf = bestPdf;
      if (isGeneric) {
        // Genel satır: "Ana Ana ürün..." PDF satırını tercih et
        const preferred = pdfRows.find((p) => norm(p.blob).startsWith(`${anaNorm} ${anaNorm}`));
        if (preferred) enrichPdf = preferred;
        else if (!norm(bestPdf.blob).startsWith(`${anaNorm} ${anaNorm}`)) {
          continue;
        }
      }
      const detail = extractHbUrunDetail(enrichPdf.blob, updated[i].ana, updated[i].kat)
        .replace(/\+?\d+\s+\S+\s+[Gg][uüUÜ]n[uüUÜ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (detail.length >= 6) {
        if (!updated[i].urun || detail.length > updated[i].urun.length + 3) {
          updated[i].urun = detail;
          enriched += 1;
        }
      }
    }
  }

  return { rows: updated, updates, enriched };
}

function buildHepsiburadaJson(rows) {
  return rows.map((r) => {
    const segs = [r.ana, r.kat, r.urun].filter((s) => s && s.length);
    const fullPath = segs.join(" > ");
    return {
      id: r.id,
      platform: "hepsiburada",
      fullPath,
      commissionRate: r.rate,
      commissionLabel: `%${r.rate.toFixed(2).replace(".", ",")}`,
    };
  });
}

function writeHepsiburadaTsv(rows) {
  const lines = [
    ["id", "Ana Kategori", "Kategori", "Ürün Grubu", "Komisyon % (KDV Dahil)"].join("\t"),
    ...rows.map((r) =>
      [
        escapeTsvCell(r.id),
        escapeTsvCell(r.ana),
        escapeTsvCell(r.kat),
        escapeTsvCell(r.urun),
        `${Number(r.rate).toFixed(2)}%`,
      ].join("\t")
    ),
  ];
  fs.writeFileSync(HB_TSV, lines.join("\n") + "\n", "utf8");
}

/* -------------------- main -------------------- */

async function main() {
  if (!fs.existsSync(TRENDYOL_PDF)) {
    console.error("Trendyol PDF yok:", TRENDYOL_PDF);
    process.exit(1);
  }
  if (!fs.existsSync(HB_PDF)) {
    console.error("HB PDF yok:", HB_PDF);
    process.exit(1);
  }
  if (!fs.existsSync(TY_TSV) || !fs.existsSync(HB_TSV)) {
    console.error("TSV kaynakları eksik");
    process.exit(1);
  }

  const tyText = await pdfToText(TRENDYOL_PDF);
  const hbText = await pdfToText(HB_PDF);

  const tyPdf = extractTrendyolPdfRates(tyText);
  const hbPdf = extractHepsiburadaPdfRows(hbText);
  console.error("PDF Trendyol unique rate rows:", tyPdf.length);
  console.error("PDF Hepsiburada rows:", hbPdf.length);

  const tyTsv = loadTrendyolTsv(fs.readFileSync(TY_TSV, "utf8"));
  const hbTsv = loadHepsiburadaTsv(fs.readFileSync(HB_TSV, "utf8"));
  console.error("TSV Trendyol:", tyTsv.length, "Hepsiburada:", hbTsv.length);

  const tyMerged = mergeTrendyol(tyTsv, tyPdf);
  const hbMerged = mergeHepsiburada(hbTsv, hbPdf);
  console.error(
    `Trendyol: ${tyMerged.updates} oran güncellendi, ${tyMerged.added} yeni satır eklendi → ${tyMerged.rows.length}`
  );
  console.error(
    `Hepsiburada: ${hbMerged.updates} oran güncellendi, ${hbMerged.enriched} ürün detayı zenginleştirildi → ${hbMerged.rows.length}`
  );

  writeTrendyolTsv(tyMerged.rows);
  writeHepsiburadaTsv(hbMerged.rows);

  const tyJson = buildTrendyolJson(tyMerged.rows);
  const hbJson = buildHepsiburadaJson(hbMerged.rows);

  // Shared JSON (TY runtime); HB array kept for reference
  let prevHb = [];
  if (fs.existsSync(TY_JSON)) {
    try {
      prevHb = JSON.parse(fs.readFileSync(TY_JSON, "utf8")).hepsiburada || [];
    } catch {
      /* ignore */
    }
  }
  fs.writeFileSync(
    TY_JSON,
    JSON.stringify({ trendyol: tyJson, hepsiburada: hbJson.length ? hbJson : prevHb }, null, 0),
    "utf8"
  );
  fs.writeFileSync(HB_JSON, JSON.stringify(hbJson, null, 0), "utf8");

  console.error("Yazıldı:", TY_TSV);
  console.error("Yazıldı:", HB_TSV);
  console.error("Yazıldı:", TY_JSON, "TY", tyJson.length);
  console.error("Yazıldı:", HB_JSON, "HB", hbJson.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
