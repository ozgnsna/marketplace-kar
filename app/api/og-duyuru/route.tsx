import { ImageResponse } from "next/og";
import { getAnnouncementBySlug } from "@/data/announcements";

export const runtime = "edge";

const PLATFORM_LABEL: Record<string, string> = {
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
  shopier: "Shopier",
  n11: "n11",
  genel: "Pazaryeri",
};

/** Duyuru/haber kartı OG görseli — /duyuru/[slug] için. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const announcement = getAnnouncementBySlug(slug);

  const title = announcement?.title ?? "Pazaryeri komisyon ve kâr duyuruları";
  const platformLabel = PLATFORM_LABEL[announcement?.platform ?? "genel"] ?? "Pazaryeri";
  const dateLabel = announcement
    ? new Date(announcement.date).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

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
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 1,
              color: "#02060d",
              background: "#22C55E",
              padding: "6px 16px",
              borderRadius: 999,
            }}
          >
            DUYURU
          </div>
          <div style={{ display: "flex", fontSize: 22, opacity: 0.65 }}>
            {platformLabel}
            {dateLabel ? ` · ${dateLabel}` : ""}
          </div>
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.18,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ marginTop: 48, fontSize: 24, opacity: 0.6 }}>
          www.pazarkar.com — ücretsiz, kayıtsız
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
