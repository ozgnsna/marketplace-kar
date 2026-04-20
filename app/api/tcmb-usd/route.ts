import { NextResponse } from "next/server";

const TCMB_TODAY = "https://www.tcmb.gov.tr/kurlar/today.xml";

/** TCMB bazen yavaş yanıt verir veya bağlantı takılır; süresiz beklemeyi engelle */
const TCMB_FETCH_TIMEOUT_MS = 12_000;

function parseDecimal(s: string): number {
  const t = s.trim().replace(",", ".");
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : NaN;
}

function extractTag(block: string, tag: string): number {
  const m = block.match(new RegExp(`<${tag}>([^<]*)</${tag}>`, "i"));
  if (!m?.[1]) return NaN;
  return parseDecimal(m[1]);
}

/**
 * TCMB günlük kurlar (today.xml) — USD için döviz alış / satış.
 * Kaynak: https://www.tcmb.gov.tr/kurlar/kur-gelisimi.xml
 */
export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TCMB_FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(TCMB_TODAY, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/xml, text/xml, */*",
        /** Bazı kurumlarda boş User-Agent ile istekler reddedilebilir veya takılabilir */
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "TCMB sunucusundan yanıt alınamadı" },
        { status: 502 }
      );
    }

    const xml = await res.text();

    const header = xml.match(/<Tarih_Date[^>]*Tarih="([^"]*)"/);
    const bulletin = xml.match(/Bulten_No="([^"]*)"/);
    const dateLabel = header?.[1] ?? null;
    const bulletinNo = bulletin?.[1] ?? null;

    const usdBlock = xml.match(
      /<Currency[^>]*Kod="USD"[^>]*>([\s\S]*?)<\/Currency>/i
    );
    if (!usdBlock?.[1]) {
      return NextResponse.json(
        { error: "XML içinde USD kuru bulunamadı" },
        { status: 502 }
      );
    }

    const block = usdBlock[1];
    const forexBuying = extractTag(block, "ForexBuying");
    const forexSelling = extractTag(block, "ForexSelling");

    if (!Number.isFinite(forexBuying) || !Number.isFinite(forexSelling)) {
      return NextResponse.json(
        { error: "USD kuru okunamadı" },
        { status: 502 }
      );
    }

    /** USD/TRY maliyeti için yaygın referans: TCMB döviz satış (1 USD kaç TL) */
    const suggestedTryPerUsd = forexSelling;

    return NextResponse.json({
      source: "TCMB",
      url: TCMB_TODAY,
      dateLabel,
      bulletinNo,
      forexBuying,
      forexSelling,
      suggestedTryPerUsd,
      note:
        "suggestedTryPerUsd = ForexSelling (TCMB ABD doları döviz satış). İşletme politikasına göre manuel düzenleyebilirsiniz.",
    });
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      {
        error: aborted
          ? "TCMB yanıt vermedi (zaman aşımı). Kur alanını manuel girebilirsiniz."
          : "Kur çekilirken hata oluştu",
      },
      { status: aborted ? 504 : 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
