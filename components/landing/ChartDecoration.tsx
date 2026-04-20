/** Arka planda minimal yükselen eğri; dikkat dağıtmadan finansal büyüme hissi */
export function ChartDecoration() {
  return (
    <div
      className="pointer-events-none absolute -right-4 bottom-0 top-0 z-0 flex w-[min(85vw,420px)] items-end justify-end select-none sm:-right-2 lg:w-[460px]"
      aria-hidden
    >
      <div
        className="translate-x-[8%] translate-y-[12%] scale-[0.92] opacity-[0.22] blur-[1px] sm:translate-x-[4%] sm:opacity-[0.26] sm:blur-md lg:opacity-[0.28]"
        style={{ filter: "drop-shadow(0 0 40px rgba(52, 211, 153, 0.12))" }}
      >
        <svg viewBox="0 0 360 220" className="h-[min(52vw,240px)] w-auto max-w-none sm:h-[min(44vw,260px)] lg:h-[280px]">
          <defs>
            <linearGradient id="chart-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(148 163 184)" stopOpacity="0.35" />
              <stop offset="55%" stopColor="rgb(52 211 153)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="rgb(110 231 183)" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.07" />
              <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Yumuşak alan */}
          <path
            fill="url(#chart-fill)"
            d="M 0 175 C 55 168 95 155 140 130 C 185 105 230 95 275 72 C 310 55 335 48 360 42 L 360 220 L 0 220 Z"
          />
          {/* Ana çizgi — ince, minimal */}
          <path
            fill="none"
            stroke="url(#chart-line)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M 0 175 C 55 168 95 155 140 130 C 185 105 230 95 275 72 C 310 55 335 48 360 42"
          />
          <circle cx="360" cy="42" r="3" fill="rgb(110 231 183)" fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
