import type { CommissionCategoryRow } from "@/data/commissionCategories";
import { normalizeSearchText } from "@/lib/normalizeSearchText";

/** Varsayılan sonuç üst sınırı */
export const DEFAULT_SEARCH_LIMIT = 10;

/** `needle` karakterleri `haystack` içinde sırayla geçiyorsa true (basit fuzzy). */
export function subsequenceMatch(haystack: string, needle: string): boolean {
  if (!needle) return true;
  let i = 0;
  for (const c of needle) {
    const j = haystack.indexOf(c, i);
    if (j === -1) return false;
    i = j + 1;
  }
  return true;
}

function rowBlobNormalized(row: CommissionCategoryRow): string {
  return normalizeSearchText(
    [row.fullPath, row.mainCategory, row.subCategory, ...row.keywords].join(" ")
  );
}

function pathNormalized(row: CommissionCategoryRow): string {
  return normalizeSearchText(row.fullPath);
}

/** Anlamlı sorgu parçaları (en az 2 karakter). */
function significantTokens(normalizedQuery: string): string[] {
  const parts = normalizedQuery.split(/\s+/).map((t) => t.trim()).filter(Boolean);
  const sig = parts.filter((t) => t.length >= 2);
  if (sig.length === 0 && normalizedQuery.length >= 2) return [normalizedQuery];
  return sig;
}

/**
 * Çok kelimeli sorguda listelemek için minimum skor (zayıf/bağlantısız eşleşmeler elenir).
 */
function minScoreThreshold(sig: string[], _q: string): number {
  if (sig.length >= 2) return 85_000;
  if (sig.length === 1) return 18_000;
  return 0;
}

/**
 * Komisyon satırı için alaka skoru. 0 = listelenmemeli.
 * Öncelik: tam/phrase path > tüm terimler path'te > terim path/keyword > fuzzy.
 */
export function scoreCategoryMatch(row: CommissionCategoryRow, queryNormalized: string): number {
  const q = queryNormalized.trim();
  if (!q) return 0;

  const sig = significantTokens(q);
  if (sig.length === 0) return 0;

  const pathNorm = pathNormalized(row);
  const blob = rowBlobNormalized(row);
  const mainSub = normalizeSearchText(`${row.mainCategory} ${row.subCategory}`);

  /** Çok kelimeli: her anlamlı terim blob içinde olmalı (tek kelimeye düşük alaka). */
  if (sig.length >= 2) {
    if (!sig.every((t) => blob.includes(t))) return 0;
  }

  let score = 0;

  // --- Katman 1: tam / phrase (en yüksek) ---
  if (pathNorm === q) {
    score += 1_000_000;
  } else if (q.length >= 2 && pathNorm.includes(q)) {
    score += 500_000 + Math.min(50_000, q.length * 2_000);
  } else if (q.length >= 2 && mainSub.includes(q)) {
    score += 320_000;
  }

  // --- Katman 2: çok kelimede tüm terimler path'te ---
  if (sig.length >= 2 && sig.every((t) => pathNorm.includes(t))) {
    score += 280_000;
  } else if (
    sig.length >= 2 &&
    sig.every((t) => row.keywords.some((k) => normalizeSearchText(k).includes(t)))
  ) {
    score += 120_000;
  }

  // --- Katman 3: terim bazlı (path > keyword > genel blob) ---
  for (const t of sig) {
    if (pathNorm.includes(t)) {
      score += 80_000;
    } else if (row.keywords.some((k) => normalizeSearchText(k).includes(t))) {
      score += 28_000;
    } else if (blob.includes(t)) {
      score += 8_000;
    }
  }

  // --- Katman 4: fuzzy (düşük; tek kelimede daha anlamlı) ---
  if (sig.length === 1) {
    const t = sig[0];
    if (!pathNorm.includes(t)) {
      if (subsequenceMatch(pathNorm, t)) score += 22_000;
      else if (subsequenceMatch(blob, t)) score += 12_000;
    }
  } else if (sig.length >= 2 && score < 200_000) {
    if (subsequenceMatch(pathNorm, q)) score += 25_000;
  }

  const threshold = minScoreThreshold(sig, q);
  if (score < threshold) return 0;
  return score;
}

/** Aynı yol + aynı komisyon (PDF tekrarları) — listede bir kez göster */
function rowDedupeKey(row: CommissionCategoryRow): string {
  return `${row.platform}\0${row.fullPath}\0${row.commissionRate}`;
}

/**
 * Skor sırasını koruyarak tekil satırlar alınır; limit kadar dolana kadar devam edilir.
 */
function takeUniqueRowsInScoreOrder(
  scored: { row: CommissionCategoryRow; score: number }[],
  limit: number
): CommissionCategoryRow[] {
  const seen = new Set<string>();
  const out: CommissionCategoryRow[] = [];
  for (const { row } of scored) {
    const key = rowDedupeKey(row);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
    if (out.length >= limit) break;
  }
  return out;
}

function takeUniqueRowsAlphabetical(rows: CommissionCategoryRow[], limit: number): CommissionCategoryRow[] {
  const sorted = [...rows].sort((a, b) => a.fullPath.localeCompare(b.fullPath, "tr"));
  return takeUniqueRowsInScoreOrder(
    sorted.map((row) => ({ row, score: 1 })),
    limit
  );
}

/**
 * Yazdıkça filtreleme: normalize edilmiş sorgu, alaka skoru + minimum eşik + sıralama.
 */
export function searchCommissionCategories(
  rows: CommissionCategoryRow[],
  query: string,
  options?: { limit?: number }
): CommissionCategoryRow[] {
  const limit = options?.limit ?? DEFAULT_SEARCH_LIMIT;
  const q = normalizeSearchText(query.trim());

  if (!q) {
    return takeUniqueRowsAlphabetical(rows, limit);
  }

  const scored = rows
    .map((row) => ({ row, score: scoreCategoryMatch(row, q) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.row.fullPath.localeCompare(b.row.fullPath, "tr"));

  return takeUniqueRowsInScoreOrder(scored, limit);
}
