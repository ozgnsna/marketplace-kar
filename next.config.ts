import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Aynı Wi‑Fi’den telefon/tablet ile `http://192.168.x.x:3000` üzerinden açınca
   * gelen CORS uyarısını kaldırır. IP’n değişirse burayı güncelle veya ekle.
   */
  allowedDevOrigins: ["192.168.1.106"],
};

export default nextConfig;
