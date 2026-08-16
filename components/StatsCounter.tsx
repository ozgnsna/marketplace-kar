"use client";

import { useEffect, useState } from "react";

/** Bu eşiğin altında gösterilmez — küçük sayılar güven yerine şüphe uyandırır. */
const MIN_DISPLAY_THRESHOLD = 25;

/** Ana sayfa hero'sunda "Bugüne kadar X hesaplama yapıldı" sosyal kanıt satırı. */
export function StatsCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { count?: number | null } | null) => {
        if (!cancelled && data && typeof data.count === "number") {
          setCount(data.count);
        }
      })
      .catch(() => {
        /* sayaç kritik değil, sessizce yut */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null || count < MIN_DISPLAY_THRESHOLD) return null;

  const formatted = new Intl.NumberFormat("tr-TR").format(count);

  return (
    <p className="mt-2 w-full text-[11px] font-medium leading-snug tracking-wide text-white/75 sm:text-xs">
      Bugüne kadar <span className="font-semibold text-white">{formatted}</span> hesaplama yapıldı
    </p>
  );
}
