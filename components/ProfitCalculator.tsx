"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calculateProfit } from "@/lib/calculateProfit";
import { DEFAULT_PROFIT_INPUTS } from "@/lib/defaultInputs";
import type { CalculationMode, MarketplacePlatform, ProfitInputs } from "@/types/profit";
import { FormStep } from "@/components/FormStep";
import { NumberField } from "@/components/NumberField";
import { PlatformLogoCards } from "@/components/PlatformLogoCards";
import { ResultCard } from "@/components/ResultCard";
import { TargetPriceCard } from "@/components/TargetPriceCard";
import { PlatformCargoPicker } from "@/components/PlatformCargoPicker";
import { CategorySearchCombobox } from "@/components/CategorySearchCombobox";
import { findCommissionCategory } from "@/data/commissionCategories";
import { DesiHelper } from "@/components/DesiHelper";
import { enrichBreakdown } from "@/lib/enrichBreakdown";
import { getPaymentFeeRateByOrderAmount } from "@/lib/getPaymentFeeTier";
import { applyPlatformDefaultsToInputs } from "@/lib/getPlatformDefaults";
import { getCargoPrice, maxDesiForPlatform } from "@/lib/cargoPrice";
import { LandingHero } from "@/components/landing/LandingHero";
import { HomeGuideLinks } from "@/components/seo/HomeGuideLinks";
import { PsychologyCard } from "@/components/landing/PsychologyCard";
import {
  computeEffectiveCustomerPrice,
  getRecommendedMode,
} from "@/lib/getRecommendedMode";
import { getProfitStatus, shouldEmphasizeTargetPrice } from "@/lib/getProfitStatus";
import { InfoTooltip } from "@/components/InfoTooltip";
import {
  IconDollar,
  IconLira,
  SegmentedControl,
} from "@/components/SegmentedControl";
import type { FieldSourceTag, TrackedInputKey } from "@/types/fieldSources";
import { TRACKED_INPUT_KEYS } from "@/types/fieldSources";

function updateField<K extends keyof ProfitInputs>(
  prev: ProfitInputs,
  key: K,
  value: ProfitInputs[K]
): ProfitInputs {
  return { ...prev, [key]: value };
}

const tryFmt = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
});

const FIELD_VARIANCE_HINT = "Platform varsayılanlarıyla gelir; oranlar pazaryerine göre değişebilir.";

export function ProfitCalculator() {
  const [inputs, setInputs] = useState<ProfitInputs>(DEFAULT_PROFIT_INPUTS);
  const [costMode, setCostMode] = useState<"try" | "usd">("try");
  const [usdExcl, setUsdExcl] = useState(0);
  const [fx, setFx] = useState(32.5);
  const [purchaseVat, setPurchaseVat] = useState(0);
  const [tcmbLoading, setTcmbLoading] = useState(false);
  const [fxInitialLoading, setFxInitialLoading] = useState(true);
  const [tcmbError, setTcmbError] = useState<string | null>(null);
  const [tcmbInfo, setTcmbInfo] = useState<{
    dateLabel: string | null;
    forexBuying: number;
    forexSelling: number;
  } | null>(null);

  const [fieldSources, setFieldSources] = useState<
    Partial<Record<TrackedInputKey | "purchasePrice", FieldSourceTag>>
  >({
    hizmetBedeli: "platform_default",
    paketleme: "platform_default",
    stopajRate: "platform_default",
    advertisingRate: "platform_default",
    listingFee: "platform_default",
    warehouseShippingFee: "platform_default",
    otherFixed: "platform_default",
    paymentFeeRate: "auto",
  });
  const [cargoDesi, setCargoDesi] = useState(2);
  const [cargoCarrier, setCargoCarrier] = useState("average");
  const [kargoAuto, setKargoAuto] = useState(true);

  const applyDesiFromHelper = useCallback(
    (d: number) => {
      setCargoDesi(Math.min(d, maxDesiForPlatform(inputs.platform)));
      setKargoAuto(true);
    },
    [inputs.platform]
  );
  const [paymentFeeAuto, setPaymentFeeAuto] = useState(true);
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);
  const [earlyAccessEmail, setEarlyAccessEmail] = useState("");
  const [earlyAccessFeedback, setEarlyAccessFeedback] = useState<string | null>(null);
  const [earlyAccessBadgeHidden, setEarlyAccessBadgeHidden] = useState(false);
  const prevPlatformRef = useRef<MarketplacePlatform | null>(null);

  useEffect(() => {
    try {
      setEarlyAccessBadgeHidden(
        window.localStorage.getItem("pazarkar.earlyAccessBadge.hidden") === "1"
      );
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25_000);
    (async () => {
      try {
        const r = await fetch("/api/tcmb-usd", { signal: controller.signal });
        const data = (await r.json()) as {
          error?: string;
          suggestedTryPerUsd?: number;
          dateLabel?: string | null;
          forexBuying?: number;
          forexSelling?: number;
        };
        if (cancelled) return;
        if (r.ok && typeof data.suggestedTryPerUsd === "number") {
          setFx(data.suggestedTryPerUsd);
          setTcmbInfo({
            dateLabel: data.dateLabel ?? null,
            forexBuying: data.forexBuying ?? 0,
            forexSelling: data.forexSelling ?? data.suggestedTryPerUsd,
          });
          setTcmbError(null);
        } else {
          setFx(32.5);
          setTcmbInfo(null);
          setTcmbError(null);
        }
      } catch {
        if (!cancelled) {
          setFx(32.5);
          setTcmbInfo(null);
          setTcmbError(null);
        }
      } finally {
        if (!cancelled) setFxInitialLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (prevPlatformRef.current === null) {
      prevPlatformRef.current = inputs.platform;
      return;
    }
    if (prevPlatformRef.current === inputs.platform) return;
    prevPlatformRef.current = inputs.platform;
    setPaymentFeeAuto(inputs.platform !== "shopier");
    setInputs((prev) =>
      applyPlatformDefaultsToInputs(inputs.platform, {
        ...prev,
        commissionCategoryId: "",
      })
    );
    setFieldSources((s) => ({
      ...s,
      hizmetBedeli: "platform_default",
      paketleme: "platform_default",
      stopajRate: "platform_default",
      paymentFeeRate: inputs.platform === "shopier" ? "platform_default" : "auto",
      advertisingRate: "platform_default",
      listingFee: "platform_default",
      warehouseShippingFee: "platform_default",
      otherFixed: "platform_default",
    }));
    setCargoCarrier("average");
    setCargoDesi((d) => Math.min(d, maxDesiForPlatform(inputs.platform)));
    setKargoAuto(true);
  }, [inputs.platform]);

  useEffect(() => {
    if (!paymentFeeAuto || inputs.platform === "shopier") return;
    const rate = getPaymentFeeRateByOrderAmount(inputs.salePrice);
    setInputs((p) => (p.paymentFeeRate === rate ? p : { ...p, paymentFeeRate: rate }));
    setFieldSources((s) => ({ ...s, paymentFeeRate: "auto" }));
  }, [inputs.salePrice, paymentFeeAuto, inputs.platform]);

  useEffect(() => {
    const id = inputs.commissionCategoryId.trim();
    if (!id) return;
    const entry = findCommissionCategory(inputs.platform, id);
    if (!entry) return;
    setInputs((p) => ({ ...p, commissionRate: entry.commissionRate }));
    setFieldSources((s) => ({ ...s, commissionRate: "category" }));
  }, [inputs.platform, inputs.commissionCategoryId]);

  useEffect(() => {
    if (!kargoAuto) return;
    const p = getCargoPrice(inputs.platform, cargoCarrier, cargoDesi);
    if (p == null) return;
    setInputs((prev) => ({ ...prev, kargo: p }));
    setFieldSources((s) => ({ ...s, kargo: "cargo_auto" }));
  }, [inputs.platform, cargoCarrier, cargoDesi, kargoAuto]);

  async function fetchTcmbRate() {
    setTcmbLoading(true);
    setTcmbError(null);
    const controller = new AbortController();
    const clientTimeoutMs = 25_000;
    const timeoutId = setTimeout(() => controller.abort(), clientTimeoutMs);
    try {
      const r = await fetch("/api/tcmb-usd", { signal: controller.signal });
      const data = (await r.json()) as {
        error?: string;
        suggestedTryPerUsd?: number;
        dateLabel?: string | null;
        forexBuying?: number;
        forexSelling?: number;
      };
      if (!r.ok) throw new Error(data.error ?? "Kur alınamadı");
      if (typeof data.suggestedTryPerUsd !== "number") throw new Error("Geçersiz yanıt");
      setFx(data.suggestedTryPerUsd);
      setTcmbInfo({
        dateLabel: data.dateLabel ?? null,
        forexBuying: data.forexBuying ?? 0,
        forexSelling: data.forexSelling ?? data.suggestedTryPerUsd,
      });
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setTcmbError(
          "İstek zaman aşımına uğradı. Bağlantıyı kontrol edin veya kur alanını manuel girin."
        );
      } else {
        setTcmbError(e instanceof Error ? e.message : "Kur alınamadı");
      }
      setTcmbInfo(null);
    } finally {
      clearTimeout(timeoutId);
      setTcmbLoading(false);
    }
  }

  const purchaseFromUsd = useMemo(
    () => Math.max(0, usdExcl * fx * (1 + purchaseVat / 100)),
    [usdExcl, fx, purchaseVat]
  );

  const inputsResolved = useMemo(
    (): ProfitInputs => ({
      ...inputs,
      purchasePrice: costMode === "usd" ? purchaseFromUsd : inputs.purchasePrice,
    }),
    [inputs, costMode, purchaseFromUsd]
  );

  const result = useMemo(() => calculateProfit(inputsResolved), [inputsResolved]);

  const hasCost = useMemo(() => {
    const pp = costMode === "usd" ? purchaseFromUsd : inputs.purchasePrice;
    return pp > 0;
  }, [costMode, purchaseFromUsd, inputs.purchasePrice]);

  const hasCalculation = useMemo(() => {
    return inputs.salePrice > 0 && hasCost;
  }, [hasCost, inputs.salePrice]);

  const breakdownEnriched = useMemo(
    () => enrichBreakdown(result, fieldSources),
    [result, fieldSources]
  );

  const emphasizeTargetPrice = useMemo(() => {
    const insight = getProfitStatus({
      netProfit: result.netProfit,
      profitMarginPercent: result.profitMarginPercent,
    });
    return shouldEmphasizeTargetPrice(insight.status);
  }, [result.netProfit, result.profitMarginPercent]);

  const effectiveSalePreview = useMemo(
    () =>
      computeEffectiveCustomerPrice({
        salePrice: inputs.salePrice,
        discountRate: inputs.discountRate,
        fourForThree: inputs.fourForThree,
      }),
    [inputs.salePrice, inputs.discountRate, inputs.fourForThree]
  );

  const recommendedMode = useMemo(() => {
    return getRecommendedMode({
      listPrice: inputs.salePrice,
      salePrice: effectiveSalePreview,
      discountRate: inputs.discountRate,
    });
  }, [inputs.salePrice, effectiveSalePreview, inputs.discountRate]);

  const setInput = <K extends keyof ProfitInputs>(
    key: K,
    value: ProfitInputs[K],
    opts?: { fromUser?: boolean; source?: FieldSourceTag }
  ) => {
    setInputs((p) => updateField(p, key, value));
    const ks = key as string;
    if (!TRACKED_INPUT_KEYS.has(ks)) return;
    if (opts?.fromUser) {
      setFieldSources((s) => ({ ...s, [ks]: "manual" }));
    } else if (opts?.source) {
      setFieldSources((s) => ({ ...s, [ks]: opts.source }));
    }
  };

  const sheet = inputs.calculationMode === "sheet";

  function scrollToCalculator() {
    document.getElementById("hesaplama-basla")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function applyDemoSample() {
    const demoCatId = "hb-33";
    const entry = findCommissionCategory("hepsiburada", demoCatId);
    const commission = entry?.commissionRate ?? 12;
    setCostMode("try");
    setUsdExcl(0);
    setPaymentFeeAuto(true);
    setKargoAuto(true);
    setCargoDesi(2);
    setCargoCarrier("average");
    setInputs((prev) =>
      applyPlatformDefaultsToInputs("hepsiburada", {
        ...prev,
        platform: "hepsiburada",
        commissionCategoryId: demoCatId,
        purchasePrice: 800,
        salePrice: 2500,
        commissionRate: commission,
        calculationMode: "sheet",
        discountRate: 0,
        fourForThree: false,
        returnRate: 0,
      })
    );
    setFieldSources({
      hizmetBedeli: "platform_default",
      paketleme: "platform_default",
      stopajRate: "platform_default",
      paymentFeeRate: "auto",
      advertisingRate: "platform_default",
      commissionRate: "category",
      kargo: "cargo_auto",
      listingFee: "platform_default",
      warehouseShippingFee: "platform_default",
      otherFixed: "platform_default",
    });
  }

  function openEarlyAccessModal() {
    setIsEarlyAccessOpen(true);
    setEarlyAccessFeedback(null);
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "open_early_access");
    }
  }

  useEffect(() => {
    if (!isEarlyAccessOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsEarlyAccessOpen(false);
        setEarlyAccessFeedback(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEarlyAccessOpen]);

  function submitEarlyAccess() {
    const email = earlyAccessEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEarlyAccessFeedback("Geçerli bir e-posta gir.");
      return;
    }
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "submit_early_access", { method: "mailto" });
    }
    const subject = encodeURIComponent("Pazarkar erken erişim — Amazon / Etsy");
    const body = encodeURIComponent(
      `Merhaba,\n\nAmazon ve Etsy hesaplama araçları için erken erişim listesine eklenmek istiyorum.\nE-posta: ${email}\n`
    );
    window.location.href = `mailto:info@pazarkar.com?subject=${subject}&body=${body}`;
    setIsEarlyAccessOpen(false);
    setEarlyAccessEmail("");
    setEarlyAccessFeedback(null);
  }

  return (
    <div className="min-h-screen bg-[#f3f5f9]">
      <LandingHero onPrimaryCta={scrollToCalculator} />

      <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-10">
          <section
            id="hesaplama-basla"
            className="scroll-mt-24 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-premium sm:p-8 lg:p-10"
          >
            <FormStep
              step={1}
              title="Pazaryeri"
              hint="Hesaplamanın hangi pazaryeri kurallarına göre yapılacağını seçin."
            >
              <PlatformLogoCards
                value={inputs.platform}
                onChange={(v: MarketplacePlatform) => setInput("platform", v, { fromUser: true })}
              />
            </FormStep>

            <FormStep
              step={2}
              title={inputs.platform === "shopier" ? "Ciro dilimi" : "Kategori"}
              hint={
                inputs.platform === "shopier"
                  ? "Önceki ay toplam satışınıza göre Shopier işlem ücreti dilimini seçin; oranı aşağıdan manuel değiştirebilirsiniz."
                  : "Pazaryerine göre güncel komisyon listesinden arayın; komisyonu aşağıdan manuel değiştirebilirsiniz."
              }
            >
              <CategorySearchCombobox
                platform={inputs.platform}
                value={inputs.commissionCategoryId}
                onValueChange={(id) => setInputs((p) => ({ ...p, commissionCategoryId: id }))}
              />
              {inputs.platform === "shopier" ? (
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  Shopier kategori komisyonu almaz; dilim oranı KDV dahildir. Her satışa ek{" "}
                  <span className="font-medium">0,49 TL + KDV</span> sabit işlem bedeli hizmet bedeli
                  alanına yansıtılır.
                </p>
              ) : null}
            </FormStep>

            <FormStep
              step={3}
              title="Hesaplama türü"
              hint="Komisyon ve gelirin hangi fiyat üzerinden işlendiğini belirler."
            >
              <div
                role="status"
                className={`mb-4 rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                  recommendedMode === "list"
                    ? "border-slate-200/90 bg-slate-50/90 text-slate-700"
                    : "border-emerald-200/80 bg-emerald-50/80 text-emerald-950"
                }`}
              >
                {recommendedMode === "list" ? (
                  <span>
                    Standart satış: liste fiyatı üzerinden hesaplama uygundur.
                  </span>
                ) : (
                  <span>
                    İndirimli satış tespit edildi — &quot;İndirimli Satış Hesabı&quot; önerilir.
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4" role="radiogroup">
                {(
                  [
                    {
                      mode: "sheet" as const,
                      title: "Liste fiyatı",
                      description: "Standart satış; kesintiler liste tutarı üzerinden.",
                    },
                    {
                      mode: "cashflow" as const,
                      title: "İndirimli satış",
                      description: "Kampanya sonrası müşterinin ödediği tutara göre.",
                    },
                  ] as const
                ).map(({ mode, title, description }) => {
                  const active = inputs.calculationMode === mode;
                  const isRecommended =
                    (recommendedMode === "list" && mode === "sheet") ||
                    (recommendedMode === "discount" && mode === "cashflow");
                  return (
                    <label
                      key={mode}
                      className={`relative flex min-h-0 flex-1 cursor-pointer flex-col rounded-2xl border-2 px-4 pb-4 pt-4 text-left transition focus-within:ring-2 focus-within:ring-[#22C55E] focus-within:ring-offset-2 sm:min-w-0 sm:max-w-none ${
                        active
                          ? "border-[#0B1F3B] bg-[#0B1F3B] text-white shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="calculationMode"
                        value={mode}
                        checked={active}
                        onChange={() =>
                          setInputs((p) => ({
                            ...p,
                            calculationMode: mode as CalculationMode,
                          }))
                        }
                        className="sr-only"
                      />
                      {isRecommended ? (
                        <span
                          className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            active
                              ? "bg-emerald-400 text-emerald-950"
                              : "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/90"
                          }`}
                        >
                          Önerilen
                        </span>
                      ) : null}
                      <span
                        className={`text-sm font-bold leading-snug ${isRecommended ? "pr-14 sm:pr-16" : ""}`}
                      >
                        {title}
                      </span>
                      <span
                        className={`mt-2 text-xs leading-relaxed ${
                          active ? "text-white/85" : "text-slate-600"
                        }`}
                      >
                        {description}
                      </span>
                    </label>
                  );
                })}
              </div>
            </FormStep>

            <FormStep
              step={4}
              title="Maliyet ve satış fiyatı"
              hint="Alış maliyetini TL veya dolar seçerek girin. Satış tutarı KDV dahildir."
            >
              <div className="mb-4">
                <SegmentedControl
                  ariaLabel="Alış maliyeti para birimi"
                  value={costMode}
                  onChange={(mode) => {
                    setCostMode(mode);
                    if (mode === "try") setUsdExcl(0);
                  }}
                  options={[
                    {
                      value: "try",
                      label: "TL ile alış",
                      icon: <IconLira />,
                    },
                    {
                      value: "usd",
                      label: "Dolar + Kur",
                      icon: <IconDollar />,
                    },
                  ]}
                />
              </div>

              {costMode === "try" ? (
                <NumberField
                  id="purchasePrice"
                  label="Ürünün size maliyeti (KDV dahil)"
                  suffix="₺"
                  value={inputs.purchasePrice}
                  onChange={(v) => setInput("purchasePrice", v)}
                />
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <NumberField
                      id="usdExcl"
                      label="Alış (USD, KDV hariç)"
                      suffix="$"
                      value={usdExcl}
                      onChange={(v) => setUsdExcl(v)}
                    />
                    <NumberField
                      id="purchaseVat"
                      label="Alış KDV %"
                      suffix="%"
                      value={purchaseVat}
                      onChange={(v) => setPurchaseVat(v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <NumberField
                      id="fx"
                      label="Dolar kuru (1 USD kaç ₺)"
                      suffix="₺"
                      value={fx}
                      onChange={(v) => setFx(v)}
                      labelAccessory={
                        <>
                          {fxInitialLoading ? (
                            <span
                              className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#0f172a]"
                              aria-hidden
                              title="Kur yükleniyor"
                            />
                          ) : null}
                          <InfoTooltip
                            label="Kur hakkında bilgi"
                            text={
                              "Kur bilgisi piyasa ortalamasına göre otomatik çekilir.\nFarklı bir kur kullanıyorsanız değiştirebilirsiniz."
                            }
                          />
                        </>
                      }
                    />
                    {fxInitialLoading ? (
                      <p className="text-xs text-slate-500" aria-live="polite">
                        TCMB kuru alınıyor…
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void fetchTcmbRate()}
                      disabled={tcmbLoading || fxInitialLoading}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1F3B] transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {tcmbLoading ? "Yükleniyor…" : "Merkez Bankası kurunu getir"}
                    </button>
                    {tcmbInfo ? (
                      <p className="text-xs text-slate-600">
                        TCMB · {tcmbInfo.dateLabel ?? "—"} · Alış {tcmbInfo.forexBuying.toFixed(4)}{" "}
                        · Satış {tcmbInfo.forexSelling.toFixed(4)} ₺
                      </p>
                    ) : null}
                    {tcmbError ? (
                      <p className="text-xs text-red-600" role="alert">
                        {tcmbError}
                      </p>
                    ) : null}
                  </div>
                  <div className="rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2.5 text-sm">
                    <span className="text-amber-900">TL maliyet (KDV dahil): </span>
                    <span className="font-semibold tabular-nums text-amber-950">
                      {tryFmt.format(purchaseFromUsd)}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-2xl border-2 border-emerald-600 bg-gradient-to-br from-emerald-50 to-white p-4 pl-5 shadow-[0_4px_18px_rgba(5,150,105,0.12)] ring-1 ring-emerald-500/20 sm:p-5 sm:pl-6 [border-left-width:6px] [border-left-color:#0B1F3B]">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800">
                  Satış fiyatı
                </p>
                <div className="mt-2.5 [&_hint]:text-slate-600 [&_label]:text-base [&_label]:font-bold [&_label]:text-[#0B1F3B] sm:[&_label]:text-lg [&_input]:min-h-[60px] [&_input]:border-2 [&_input]:border-emerald-500/50 [&_input]:bg-white [&_input]:text-xl [&_input]:font-bold [&_input]:shadow-sm [&_input]:focus:border-emerald-600 [&_input]:focus:ring-4 [&_input]:focus:ring-emerald-500/25 [&_span]:text-base [&_span]:font-semibold [&_span]:text-emerald-800">
                  <NumberField
                    id="salePrice"
                    label="Ürünün satış fiyatı (KDV dahil)"
                    hint="Pazaryeri ürün sayfasındaki satış tutarı (KDV dahil)."
                    placeholder="Örn. 2.633"
                    showEmptyWhenZero
                    suffix="₺"
                    value={inputs.salePrice}
                    onChange={(v) => setInput("salePrice", v)}
                  />
                </div>
              </div>
            </FormStep>

          <FormStep
            step={5}
            title="Komisyon ve giderler"
            hint={FIELD_VARIANCE_HINT}
          >
            <div className="mb-4 rounded-2xl border-2 border-[#0B1F3B]/15 bg-slate-50/80 p-3.5 sm:p-4 [border-left-width:5px] [border-left-color:#0B1F3B]">
              <div className="[&_label]:font-semibold [&_label]:text-[#0B1F3B] [&_input]:min-h-[52px] [&_input]:border-[#0B1F3B]/20 [&_input]:bg-white [&_input]:text-base [&_input]:font-semibold">
                <NumberField
                  id="commissionRate"
                  label={inputs.platform === "shopier" ? "İşlem ücreti oranı" : "Komisyon"}
                  suffix="%"
                  value={inputs.commissionRate}
                  onChange={(v) => setInput("commissionRate", v, { fromUser: true })}
                />
              </div>
              {fieldSources.commissionRate === "category" ? (
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Seçilen kategori / dilime göre dolduruldu.
                </p>
              ) : inputs.commissionRate <= 0 ? (
                <p className="mt-1.5 text-[11px] text-amber-800">
                  {inputs.platform === "shopier"
                    ? "Ciro dilimi seçin veya oranı manuel girin."
                    : "Kategori seçin veya komisyon oranını manuel girin."}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <NumberField
                  id="paymentFeeRate"
                  label="Tahsilat yönetim"
                  suffix="%"
                  value={inputs.paymentFeeRate}
                  onChange={(v) => {
                    setPaymentFeeAuto(false);
                    setInput("paymentFeeRate", v, { fromUser: true });
                  }}
                />
                {inputs.platform !== "shopier" ? (
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                    <span>
                      {paymentFeeAuto
                        ? "Sipariş tutarına göre otomatik."
                        : "Elle düzenlendi."}
                    </span>
                    {!paymentFeeAuto ? (
                      <button
                        type="button"
                        className="font-semibold text-[#0B1F3B] underline decoration-slate-300 underline-offset-2 hover:decoration-[#0B1F3B]"
                        onClick={() => setPaymentFeeAuto(true)}
                      >
                        Otomatiğe dön
                      </button>
                    ) : null}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500">Shopier’de genelde 0.</p>
                )}
              </div>
              <NumberField
                id="stopajRate"
                label="Stopaj"
                suffix="%"
                value={inputs.stopajRate}
                onChange={(v) => setInput("stopajRate", v, { fromUser: true })}
              />
              <NumberField
                id="advertisingRate"
                label="Reklam (varsa)"
                suffix="%"
                value={inputs.advertisingRate}
                onChange={(v) => setInput("advertisingRate", v, { fromUser: true })}
              />
              <NumberField
                id="vatRate"
                label="KDV oranı (özet için)"
                suffix="%"
                value={inputs.vatRate}
                onChange={(v) => setInput("vatRate", v)}
                hint="0 ise sonuçta KDV özeti çıkmaz."
              />
            </div>

            <div className="mt-4">
              <NumberField
                id="hizmetBedeli"
                label="Hizmet bedeli"
                suffix="₺"
                value={inputs.hizmetBedeli}
                onChange={(v) => setInput("hizmetBedeli", v, { fromUser: true })}
              />
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {inputs.platform === "hepsiburada"
                  ? "Hepsiburada’da genelde sabit hizmet bedeli; hesabınıza göre değişebilir."
                  : inputs.platform === "trendyol"
                    ? "Trendyol sipariş başına platform hizmet bedeli; varsayılan yaklaşık tutar kullanılır."
                    : "Shopier işlem başına 0,49 TL (+KDV); varsayılan 0,59 TL KDV dahildir."}
              </p>
            </div>

            {!sheet ? (
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="mb-2 text-xs font-medium text-slate-700">% kesintiler hangi fiyat üzerinden?</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setInput("feePercentBase", "discountedPrice")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      inputs.feePercentBase === "discountedPrice"
                        ? "bg-[#0B1F3B] text-white"
                        : "bg-white ring-1 ring-slate-200"
                    }`}
                  >
                    İndirimli satış
                  </button>
                  <button
                    type="button"
                    onClick={() => setInput("feePercentBase", "listPrice")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      inputs.feePercentBase === "listPrice"
                        ? "bg-[#0B1F3B] text-white"
                        : "bg-white ring-1 ring-slate-200"
                    }`}
                  >
                    Liste fiyatı
                  </button>
                </div>
              </div>
            ) : null}

            <details className="group mt-5 rounded-2xl border border-slate-200 bg-white open:border-slate-300 open:bg-slate-50/60">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-slate-800 marker:content-none [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="text-slate-500">İsteğe bağlı · </span>
                  Ek sabit kalemler
                </span>
                <span className="text-xs font-medium text-slate-500 group-open:hidden">Aç</span>
                <span className="hidden text-xs font-medium text-slate-500 group-open:inline">Kapat</span>
              </summary>
              <div className="grid gap-4 border-t border-slate-100 px-4 pb-4 pt-3 sm:grid-cols-2">
                <p className="sm:col-span-2 text-[11px] text-slate-500">
                  Listeleme, depo ve diğer sabit ₺ giderler — çoğu senaryoda boş bırakılabilir.
                </p>
                <NumberField
                  id="listingFee"
                  label="Listeleme / vitrin"
                  suffix="₺"
                  value={inputs.listingFee}
                  onChange={(v) => setInput("listingFee", v, { fromUser: true })}
                />
                <NumberField
                  id="warehouseShippingFee"
                  label="Depoya gönderim"
                  suffix="₺"
                  value={inputs.warehouseShippingFee}
                  onChange={(v) => setInput("warehouseShippingFee", v, { fromUser: true })}
                />
                <div className="sm:col-span-2">
                  <NumberField
                    id="otherFixed"
                    label="Diğer sabit gider"
                    suffix="₺"
                    value={inputs.otherFixed}
                    onChange={(v) => setInput("otherFixed", v, { fromUser: true })}
                  />
                </div>
              </div>
            </details>
          </FormStep>

          <FormStep
            step={6}
            title="Kargo ve paket"
            hint="Paket boyutunu ve firmayı seçin; kargo ücreti otomatik dolar, istersen elle değiştir."
          >
            <DesiHelper
              onApplyDesi={applyDesiFromHelper}
              appliedDesi={cargoDesi}
              maxDesi={maxDesiForPlatform(inputs.platform)}
            />
            <PlatformCargoPicker
              platform={inputs.platform}
              desi={cargoDesi}
              carrierKey={cargoCarrier}
              onDesiChange={(d) => {
                setCargoDesi(d);
                setKargoAuto(true);
              }}
              onCarrierChange={(c) => {
                setCargoCarrier(c);
                setKargoAuto(true);
              }}
            />
            <p className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>
                {kargoAuto
                  ? "Kargo alanı tablo tahminine bağlı."
                  : "Kargo elle düzenlendi."}
              </span>
              {!kargoAuto ? (
                <button
                  type="button"
                  className="font-semibold text-[#0B1F3B] underline decoration-slate-300 underline-offset-2 hover:decoration-[#0B1F3B]"
                  onClick={() => setKargoAuto(true)}
                >
                  Otomatik kargoya dön
                </button>
              ) : null}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <NumberField
                  id="kargo"
                  label="Kargo (size maliyet)"
                  suffix="₺"
                  value={inputs.kargo}
                  onChange={(v) => {
                    setKargoAuto(false);
                    setInput("kargo", v, { fromUser: true });
                  }}
                />
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={inputs.customerPaysShipping}
                    onChange={(e) => setInput("customerPaysShipping", e.target.checked)}
                  />
                  Kargoyu müşteri ödüyor
                </label>
              </div>
              <NumberField
                id="paketleme"
                label="Paketleme"
                suffix="₺"
                value={inputs.paketleme}
                onChange={(v) => setInput("paketleme", v, { fromUser: true })}
              />
            </div>
          </FormStep>

          <FormStep
            step={7}
            title="Kampanya ve iade"
            hint={
              sheet
                ? "İade/risk girebilirsiniz. Kampanya için indirimli satış moduna geçin."
                : "İndirim oranını girin; iade payı net kârı düşürür."
            }
          >
            {sheet ? (
              <div className="mb-4 flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-slate-600">
                  Kampanya alanları liste fiyatı modunda kapalı.
                </p>
                <button
                  type="button"
                  className="shrink-0 rounded-lg bg-[#0B1F3B] px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  onClick={() =>
                    setInputs((p) => ({
                      ...p,
                      calculationMode: "cashflow",
                      feePercentBase: "discountedPrice",
                    }))
                  }
                >
                  İndirimli satışa geç
                </button>
              </div>
            ) : (
              <div className="mb-4 space-y-3">
                <NumberField
                  id="discountRate"
                  label="İndirim / kampanya %"
                  suffix="%"
                  value={inputs.discountRate}
                  onChange={(v) => setInput("discountRate", v)}
                  hint="Ürün fiyatındaki indirim oranı (ör. %10 kampanya)."
                />
                <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 rounded"
                    checked={inputs.fourForThree}
                    onChange={(e) => setInput("fourForThree", e.target.checked)}
                  />
                  <span>
                    <span className="font-medium text-slate-800">Örnek: 4 al 3 öde</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">
                      Örnek kampanya — efektif satış ≈ %25 düşer. İstersen sadece üstteki %
                      indirimi kullan.
                    </span>
                  </span>
                </label>
                {inputs.discountRate > 0 || inputs.fourForThree ? (
                  <p className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    Efektif müşteri fiyatı:{" "}
                    <span className="font-semibold tabular-nums text-[#0B1F3B]">
                      {tryFmt.format(effectiveSalePreview)}
                    </span>
                  </p>
                ) : null}
              </div>
            )}

            <NumberField
              id="returnRate"
              label={
                sheet
                  ? "İade veya risk (liste üzerinden %)"
                  : "İade oranı (net kâra etki)"
              }
              suffix="%"
              value={inputs.returnRate}
              onChange={(v) => setInput("returnRate", v)}
              hint="Beklenen iade / risk payı; net kârı düşürür."
            />
          </FormStep>
        </section>

        <aside className="flex flex-col gap-5 sm:gap-6 lg:sticky lg:top-8">
          {!hasCalculation ? (
            <button
              type="button"
              onClick={applyDemoSample}
              className="w-full rounded-2xl border-2 border-emerald-500/40 bg-emerald-50 px-4 py-4 text-left shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50/80"
            >
              <span className="block text-sm font-bold text-[#0B1F3B]">Örnek veri ile dene</span>
              <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                Tek tıkla örnek maliyet, satış ve komisyon doldurulur — sonucu hemen gör.
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={applyDemoSample}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-[#0B1F3B]"
            >
              Örnek veriyi yeniden yükle
            </button>
          )}
          <ResultCard
            platform={inputs.platform}
            result={result}
            inputs={inputsResolved}
            hasCalculation={hasCalculation}
            breakdownEnriched={breakdownEnriched}
          />
          <TargetPriceCard
            inputs={inputsResolved}
            emphasize={emphasizeTargetPrice && hasCalculation}
            hasCost={hasCost}
          />
          <PsychologyCard />
        </aside>
      </div>

      <HomeGuideLinks />

      {!earlyAccessBadgeHidden ? (
        <div className="floating-badge-enter fixed bottom-28 right-3 z-40 flex max-w-[10.5rem] items-start gap-1 sm:bottom-6 sm:right-4 sm:max-w-[12.5rem]">
          <button
            type="button"
            onClick={openEarlyAccessModal}
            className="rounded-xl border border-slate-800/15 bg-slate-900/90 px-2.5 py-2 text-left text-[10px] font-medium leading-snug text-white/95 shadow-md backdrop-blur-md transition hover:bg-slate-900 sm:px-3 sm:text-[11px]"
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle" />
            <span className="align-middle">
              Amazon &amp; Etsy — erken erişim
            </span>
          </button>
          <button
            type="button"
            aria-label="Erken erişim bildirimini kapat"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-900/70 text-xs text-white/80 hover:bg-slate-900 hover:text-white"
            onClick={() => {
              setEarlyAccessBadgeHidden(true);
              try {
                window.localStorage.setItem("pazarkar.earlyAccessBadge.hidden", "1");
              } catch {
                /* ignore */
              }
            }}
          >
            ×
          </button>
        </div>
      ) : null}

      {isEarlyAccessOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          onClick={() => setIsEarlyAccessOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/20 bg-slate-900/90 p-5 text-white shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="early-access-title"
          >
            <h3 id="early-access-title" className="text-lg font-semibold sm:text-xl">
              Amazon &amp; Etsy için erken erişim
            </h3>
            <p className="mt-2 text-sm text-slate-200">
              Trendyol, Hepsiburada ve Shopier şu an hazır. Amazon ve Etsy hesaplama araçları
              sırada — haber almak için e-posta bırak, mail uygulaman açılacak.
            </p>

            <label htmlFor="early-access-email" className="mt-4 block text-xs text-slate-300">
              E-posta
            </label>
            <input
              id="early-access-email"
              type="email"
              value={earlyAccessEmail}
              onChange={(e) => {
                setEarlyAccessEmail(e.target.value);
                setEarlyAccessFeedback(null);
              }}
              placeholder="ornek@mail.com"
              className="mt-1 w-full rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-300/80 outline-none ring-0 transition focus:border-emerald-400"
            />
            {earlyAccessFeedback ? (
              <p className="mt-2 text-xs font-medium text-amber-300" role="status">
                {earlyAccessFeedback}
              </p>
            ) : null}

            <button
              type="button"
              onClick={submitEarlyAccess}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
            >
              Mail ile kaydol
            </button>
            <p className="mt-2 text-center text-xs text-slate-300">
              Spam yok. Sadece lansman haberi — info@pazarkar.com
            </p>
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}
