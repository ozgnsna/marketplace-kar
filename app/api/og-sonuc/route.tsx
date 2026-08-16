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
};

function parseNum(v: string | null, fallback = 0): number {
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function formatTry(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.round(Math.abs(n));
  return `${sign}₺${abs.toLocaleString("tr-TR")}`;
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
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.85, letterSpacing: 1 }}>
            PAZARKAR
          </div>
          <div style={{ fontSize: 22, opacity: 0.55 }}>· {platformLabel} satışı</div>
        </div>

        <div style={{ marginTop: 30, fontSize: 30, fontWeight: 600, opacity: 0.85 }}>
          {formatTry(salePrice)}&apos;lik satış, gerçekte...
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 22, marginTop: 8 }}>
          <div style={{ fontSize: 104, fontWeight: 800, color: accent, lineHeight: 1 }}>
            {formatTry(netProfit)}
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, opacity: 0.75 }}>net kâr</div>
        </div>

        <div style={{ marginTop: 20, fontSize: 28, fontWeight: 500, opacity: 0.8 }}>
          Marj: %{marginLabel} — {status.label}
        </div>

        <div style={{ marginTop: 48, fontSize: 24, opacity: 0.6 }}>
          www.pazarkar.com — ücretsiz, kayıtsız
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
