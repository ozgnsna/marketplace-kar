import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pazarkar — Pazaryeri kâr hesaplama ve Trendyol komisyon hesaplama";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        <div style={{ fontSize: 28, fontWeight: 600, opacity: 0.85, letterSpacing: 1 }}>
          PAZARKAR
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 58,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Pazaryeri kâr hesaplama
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 32,
            fontWeight: 500,
            opacity: 0.9,
            maxWidth: 980,
            lineHeight: 1.35,
          }}
        >
          Trendyol komisyon hesaplama · Hepsiburada · Shopier
        </div>
        <div style={{ marginTop: 40, fontSize: 24, opacity: 0.7 }}>
          www.pazarkar.com
        </div>
      </div>
    ),
    { ...size }
  );
}
