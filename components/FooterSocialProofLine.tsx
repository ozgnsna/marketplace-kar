"use client";

import { useEffect, useState } from "react";

const TARGET = 137;
const START = 108;
const DURATION_MS = 1100;

export function FooterSocialProofLine({ className = "" }: { className?: string }) {
  const [count, setCount] = useState(START);

  useEffect(() => {
    let rafId = 0;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const t = Math.min((now - startTime) / DURATION_MS, 1);
      const eased = 1 - (1 - t) ** 3;
      setCount(Math.round(START + (TARGET - START) * eased));
      if (t < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <p className={className} aria-live="polite">
      Son 24 saatte {count}+ satıcı hesaplama yaptı
    </p>
  );
}
