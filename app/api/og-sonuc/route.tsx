import { ImageResponse } from "next/og";
import { getProfitStatus } from "@/lib/getProfitStatus";

export const runtime = "edge";

const STATUS_COLOR: Record<string, string> = {
  zarar: "#ef4444",
  dusuk_kar: "#f59e0b",
  iyi: "#22C55E",
};

const PLATFORM_LABEL: Record<string, string> = {
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
  shopier: "Shopier",
  n11: "n11",
  pttavm: "PttAVM",
};

function parseNum(v: string | null, fallback = 0): number {
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function formatTry(n: number): string {
  // Not: Satori'nin varsayılan yazı tipi ₺ simgesini içermiyor (kutu/□ olarak
  // render ediyor), bu yüzden bu OG görselinde özellikle "TL" yazısı kullanılıyor.
  const sign = n < 0 ? "-" : "";
  const abs = Math.round(Math.abs(n));
  return `${sign}${abs.toLocaleString("tr-TR")} TL`;
}

/**
 * Kullanıcının paylaştığı bir hesaplama sonucu için dinamik OG görseli.
 * /sonuc sayfasının metadata'sında kullanılır — WhatsApp/Instagram/Telegram'da
 * link paylaşılınca bu görsel otomatik önizleme olarak çıkar.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform") ?? "trendyol";
  const netProfit = parseNum(searchParams.get("netProfit"));
  const marginPercent = parseNum(searchParams.get("marginPercent"));
  const salePrice = parseNum(searchParams.get("salePrice"));

  const status = getProfitStatus({ netProfit, profitMarginPercent: marginPercent });
  const accent = STATUS_COLOR[status.status] ?? STATUS_COLOR.iyi;
  const platformLabel = PLATFORM_LABEL[platform] ?? "Pazaryeri";
  const marginLabel = marginPercent.toFixed(1).replace(".", ",");
  const totalDeduction = salePrice - netProfit;
  const barFill = Math.max(4, Math.min(100, marginPercent));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(145deg, #02060d 0%, #0B1F3B 55%, #143d38 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 1,
              color: "#02060d",
              background: accent,
              padding: "6px 16px",
              borderRadius: 999,
            }}
          >
            {platformLabel.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 700, opacity: 0.45, letterSpacing: 2 }}>
            PAZARKAR
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 26, fontSize: 28, fontWeight: 600, opacity: 0.85 }}>
          {formatTry(salePrice)}&apos;lik satış, gerçekte...
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 4 }}>
          <div style={{ fontSize: 100, fontWeight: 800, color: accent, lineHeight: 1 }}>
            {formatTry(netProfit)}
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, opacity: 0.75 }}>net kâr</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 26 }}>
          <div
            style={{
              display: "flex",
              width: 340,
              height: 16,
              borderRadius: 999,
              background: "rgba(255,255,255,0.14)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: `${barFill}%`,
                height: "100%",
                borderRadius: 999,
                background: accent,
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700 }}>Marj %{marginLabel}</div>
        </div>

        <div style={{ display: "flex", marginTop: 14, fontSize: 24, fontWeight: 500, opacity: 0.7 }}>
          Toplam kesinti: {formatTry(totalDeduction)} — {status.label}
        </div>

        <div style={{ display: "flex", marginTop: 42, fontSize: 24, opacity: 0.6 }}>
          www.pazarkar.com — 30 saniyede, ücretsiz, kayıtsız
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
