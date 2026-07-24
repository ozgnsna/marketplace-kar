/**
 * Shopier işlem ücreti dilimleri (panel: Ücretlendirme → İşlem Ücretleri).
 * Oranlar KDV hariç; uygulamada KDV dahil (% × 1,20) kullanılır.
 * Her işleme ek sabit: 0,49 TL + KDV → platformDefaults.serviceFee (0,59 TL).
 */

/** KDV hariç oran → formda kullanılan KDV dahil % */
function inclVatPct(excl: number): number {
  return Math.round(excl * 1.2 * 100) / 100;
}

type Tier = {
  id: string;
  label: string;
  detail: string;
  exclPct: number;
  fxExclPct: number;
  keywords: string[];
};

/** Panel tablosu — Aylık Toplam Satış → TL / Döviz işlem */
const TIERS: Tier[] = [
  {
    id: "shopier-tier-25k-alti",
    label: "25.000 TL altı",
    detail: "Yeni / düşük hacim",
    exclPct: 5.99,
    fxExclPct: 6.99,
    keywords: ["yeni", "baslangic", "düşük", "dusuk", "ciro", "dilim", "25000", "tl"],
  },
  {
    id: "shopier-tier-25k-90k",
    label: "25.000 – 89.999 TL",
    detail: "Aylık toplam satış",
    exclPct: 5.49,
    fxExclPct: 6.49,
    keywords: ["ciro", "dilim", "25000", "90000", "tl"],
  },
  {
    id: "shopier-tier-90k-250k",
    label: "90.000 – 249.999 TL",
    detail: "Aylık toplam satış",
    exclPct: 4.99,
    fxExclPct: 5.99,
    keywords: ["ciro", "dilim", "90000", "250000", "tl"],
  },
  {
    id: "shopier-tier-250k-450k",
    label: "250.000 – 449.999 TL",
    detail: "Aylık toplam satış",
    exclPct: 4.49,
    fxExclPct: 5.49,
    keywords: ["ciro", "dilim", "250000", "450000", "tl"],
  },
  {
    id: "shopier-tier-450k-1_2m",
    label: "450.000 – 1.199.999 TL",
    detail: "Aylık toplam satış",
    exclPct: 3.99,
    fxExclPct: 4.99,
    keywords: ["ciro", "dilim", "450000", "1200000", "tl"],
  },
  {
    id: "shopier-tier-1_2m-2_2m",
    label: "1.200.000 – 2.199.999 TL",
    detail: "Aylık toplam satış",
    exclPct: 3.49,
    fxExclPct: 4.49,
    keywords: ["ciro", "dilim", "1200000", "2200000", "tl"],
  },
  {
    id: "shopier-tier-2_2m-ustu",
    label: "2.200.000 TL ve üzeri",
    detail: "En düşük dilim",
    exclPct: 2.99,
    fxExclPct: 3.99,
    keywords: ["ciro", "dilim", "2200000", "yuksek", "yüksek", "minimum", "tl"],
  },
];

export const SHOPIER_COMMISSION_NOTE =
  "Kaynak: Shopier panel İşlem Ücretleri. Oranlar KDV hariçtir; formda KDV dahil yazılır. Her işleme +0,49 TL (+KDV) sabit bedel hizmet bedeline eklenir. AMEX uluslararası ödemelerde ek %1,75 (KDV hariç) uygulanabilir.";

export const SHOPIER_COMMISSION_CATEGORIES = TIERS.flatMap((t) => {
  const tlRate = inclVatPct(t.exclPct);
  const fxRate = inclVatPct(t.fxExclPct);
  return [
    {
      id: t.id,
      platform: "shopier" as const,
      mainCategory: "TL işlem",
      subCategory: t.label,
      fullPath: `Shopier > TL işlem > ${t.label} > ${t.detail} (KDV hariç %${t.exclPct.toFixed(2)} + 0,49 TL)`,
      keywords: [
        "shopier",
        "ciro",
        "dilim",
        "tl",
        "islem",
        "işlem",
        "ucret",
        "ücret",
        ...t.keywords,
        ...t.label.toLocaleLowerCase("tr-TR").split(/\s+/),
      ],
      commissionRate: tlRate,
      commissionLabel: `%${tlRate}`,
    },
    {
      id: `${t.id}-fx`,
      platform: "shopier" as const,
      mainCategory: "Döviz işlem",
      subCategory: t.label,
      fullPath: `Shopier > Döviz işlem > ${t.label} > ${t.detail} (KDV hariç %${t.fxExclPct.toFixed(2)} + 0,49 TL)`,
      keywords: [
        "shopier",
        "ciro",
        "dilim",
        "doviz",
        "döviz",
        "fx",
        "usd",
        "eur",
        "islem",
        "işlem",
        ...t.keywords,
        ...t.label.toLocaleLowerCase("tr-TR").split(/\s+/),
      ],
      commissionRate: fxRate,
      commissionLabel: `%${fxRate}`,
    },
  ];
});
