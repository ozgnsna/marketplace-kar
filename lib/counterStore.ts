/**
 * "Bugüne kadar X hesaplama yapıldı" sosyal kanıt sayacı için basit Redis (Upstash REST) katmanı.
 *
 * Vercel serverless'ta dosya tabanlı bir sayaç kalıcı olmadığı için Upstash Redis REST API
 * kullanılıyor — ek bir npm paketi gerekmiyor, düz `fetch` ile çalışıyor.
 *
 * Kurulum: Vercel projesine "Upstash for Redis" marketplace entegrasyonunu ekleyince
 * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (veya KV_REST_API_URL / KV_REST_API_TOKEN)
 * env değişkenleri otomatik eklenir. Env değişkenleri yoksa bu modül sessizce no-op olur —
 * sayaç UI'da gösterilmez, uygulamanın geri kalanı etkilenmez.
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const CALC_COUNT_KEY = "pazarkar:calc_count";

export function isCounterConfigured(): boolean {
  return Boolean(REDIS_URL && REDIS_TOKEN);
}

async function redisCommand(path: string): Promise<unknown> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(`${REDIS_URL}/${path}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown };
    return data.result ?? null;
  } catch {
    return null;
  }
}

/** Sayacı bir artırır, yeni değeri döner. Redis bağlı değilse sessizce null döner. */
export async function incrementCalcCount(): Promise<number | null> {
  const result = await redisCommand(`incr/${CALC_COUNT_KEY}`);
  return typeof result === "number" ? result : null;
}

/** Mevcut sayacı okur (artırmadan). Redis bağlı değilse null döner. */
export async function readCalcCount(): Promise<number | null> {
  const result = await redisCommand(`get/${CALC_COUNT_KEY}`);
  if (result === null || result === undefined) return null;
  const n = typeof result === "string" ? parseInt(result, 10) : result;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}
