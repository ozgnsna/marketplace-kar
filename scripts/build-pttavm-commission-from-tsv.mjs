/**
 * `data/pttavm-commission-source.tsv` dosyasından
 * `data/pttavmCommissionCategories.generated.json` üretir.
 *
 * Kaynak: PttAVM Tedarikçi Platformu → Hesap Yönetimi → "Güncel Komisyonlar"
 * linkinden inen "PttAVM-Kategori-Bazlı-Komisyon-Listesi.pdf" (118 sayfa,
 * 5034 kategori). PDF, N11/Trendyol/Hepsiburada'dan farklı olarak düz bir
 * "Ana Kategori > Alt Kategori" tablosu değil, kenar listesi (edge list)
 * şeklinde: her satır bir (parentId, parentName, id, name, rate) çifti ve
 * her kategori (üst seviye dahil) kendi komisyon oranına sahip — 2 ile 7
 * seviye arasında değişen bir ağaç oluşturuyor.
 *
 * TSV sütunları (tab): id, parentId, parentName, name, commissionRate
 * (parentId boşsa o kategori ağacın kökü/en üst seviyesidir)
 *
 * Kullanım: node scripts/build-pttavm-commission-from-tsv.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TSV_PATH = path.join(root, "data", "pttavm-commission-source.tsv");
const OUT_PATH = path.join(root, "data", "pttavmCommissionCategories.generated.json");

function parsePct(cell) {
  const s = String(cell ?? "").trim();
  const m = s.match(/^([\d.,]+)/);
  if (!m) return NaN;
  return parseFloat(m[1].replace(",", "."));
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

function loadNodes(tsvText) {
  const lines = tsvText.split(/\r?\n/).map((l) => l.replace(/^﻿/, ""));
  const nodes = new Map();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (i === 0 && /^id\t/i.test(line)) continue;

    const parts = line.split("\t");
    if (parts.length < 5) {
      console.warn("Atlanan satır (5 sütun gerekli):", line.slice(0, 120));
      continue;
    }

    const id = parts[0]?.trim() ?? "";
    const parentId = parts[1]?.trim() || null;
    const parentName = parts[2]?.trim() || null;
    const name = parts[3]?.trim() ?? "";
    const rate = parsePct(parts[4]);

    if (!id || !name || !Number.isFinite(rate)) {
      console.warn("Atlanan satır:", line.slice(0, 120));
      continue;
    }
    if (nodes.has(id)) continue; // kaynak PDF'de nadiren tekrar eden id — ilkini koru

    nodes.set(id, { id, name, parentId, parentName, rate });
  }

  return nodes;
}

function fullPathFor(nodeId, nodes, depth = 0, seen = new Set()) {
  const n = nodes.get(nodeId);
  if (!n || seen.has(nodeId) || depth > 20) return [];
  seen.add(nodeId);
  if (n.parentId && nodes.has(n.parentId)) {
    return [...fullPathFor(n.parentId, nodes, depth + 1, seen), n.name];
  }
  if (n.parentName) return [n.parentName, n.name];
  return [n.name];
}

function buildRows(nodes) {
  const rows = [];
  for (const [id, n] of nodes) {
    const parts = fullPathFor(id, nodes);
    const fullPath = parts.join(" > ");
    rows.push({
      id: `pttavm-${id}`,
      platform: "pttavm",
      mainCategory: parts[0] ?? n.name,
      subCategory: n.name,
      fullPath,
      keywords: keywordsFromPath(fullPath),
      commissionRate: n.rate,
      commissionLabel: `%${n.rate}`,
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
  const nodes = loadNodes(tsvText);
  const rows = buildRows(nodes);
  fs.writeFileSync(OUT_PATH, JSON.stringify(rows, null, 0), "utf8");
  console.error("PttAVM satır:", rows.length, "→", OUT_PATH);
}

main();
