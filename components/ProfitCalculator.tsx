"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { getCargoPrice } from "@/lib/cargoPrice";
import { LandingHero } from "@/components/landing/LandingHero";
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

const FIELD_VARIANCE_HINT = "Bu değerler pazaryerine ve ürüne göre değişebilir.";
const FIELD_VARIANCE_TOOLTIP = (
  <InfoTooltip label="Bu alan hakkında bilgi" text={FIELD_VARIANCE_HINT} />
);

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
  const [paymentFeeAuto, setPaymentFeeAuto] = useState(true);
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);
  const [earlyAccessEmail, setEarlyAccessEmail] = useState("");
  const prevPlatformRef = useRef<MarketplacePlatform | null>(null);

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
    setPaymentFeeAuto(true);
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
      paymentFeeRate: "auto",
      advertisingRate: "platform_default",
      listingFee: "platform_default",
      warehouseShippingFee: "platform_default",
      otherFixed: "platform_default",
    }));
    setCargoCarrier("average");
    setCargoDesi(2);
    setKargoAuto(true);
  }, [inputs.platform]);

  useEffect(() => {
    if (!paymentFeeAuto) return;
    const rate = getPaymentFeeRateByOrderAmount(inputs.salePrice);
    setInputs((p) => (p.paymentFeeRate === rate ? p : { ...p, paymentFeeRate: rate }));
    setFieldSources((s) => ({ ...s, paymentFeeRate: "auto" }));
  }, [inputs.salePrice, paymentFeeAuto]);

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

  const hasCalculation = useMemo(() => {
    const pp = costMode === "usd" ? purchaseFromUsd : inputs.purchasePrice;
    return inputs.salePrice > 0 && pp > 0;
  }, [costMode, purchaseFromUsd, inputs.purchasePrice, inputs.salePrice]);

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

  const recommendedMode = useMemo(() => {
    const effective = computeEffectiveCustomerPrice({
      salePrice: inputs.salePrice,
      discountRate: inputs.discountRate,
      fourForThree: inputs.fourForThree,
    });
    return getRecommendedMode({
      listPrice: inputs.salePrice,
      salePrice: effective,
      discountRate: inputs.discountRate,
    });
  }, [inputs.salePrice, inputs.discountRate, inputs.fourForThree]);

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
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "open_early_access");
    }
  }

  function submitEarlyAccess() {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "submit_early_access");
    }
    setIsEarlyAccessOpen(false);
    setEarlyAccessEmail("");
  }

  return (
    <div className="min-h-screen bg-[#f3f5f9]">
      <LandingHero onPrimaryCta={scrollToCalculator} />

      <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-12 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-12">
          <section
            id="hesaplama-basla"
            className="scroll-mt-24 rounded-3xl border border-slate-200/70 bg-white p-7 shadow-premium sm:p-9 lg:p-11"
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
              title="Kategori"
              hint="Pazaryerine göre güncel komisyon listesinden arayın; komisyonu aşağıdan manuel değiştirebilirsiniz."
            >
              <CategorySearchCombobox
                platform={inputs.platform}
                value={inputs.commissionCategoryId}
                onValueChange={(id) => setInputs((p) => ({ ...p, commissionCategoryId: id }))}
              />
            </FormStep>

            <FormStep
              step={3}
              title="Hesaplama türü"
              hint="Hesaplama türü, komisyon ve gelirin hangi fiyat üzerinden işlendiğini belirler."
            >
              <fieldset className="border-0 p-0">
                  <legend className="mb-3 text-sm font-medium text-slate-600">Hesaplama türü</legend>
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
                        Standart satış yapıyorsunuz. Liste fiyatı üzerinden hesaplama uygundur.
                      </span>
                    ) : (
                      <span>
                        İndirimli satış tespit edildi. Daha doğru sonuç için &quot;İndirimli Satış
                        Hesabı&quot; önerilir.
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4" role="radiogroup">
                    {(
                      [
                        {
                          mode: "sheet" as const,
                          title: "Liste Fiyatı Üzerinden Hesapla",
                          description:
                            "Ürünü liste fiyatına göre satıyorsanız (standart satış)",
                          example:
                            "Örnek: Listede 5.999 ₺ görünüyorsa komisyon ve kesintiler bu tutar üzerinden düşülür.",
                        },
                        {
                          mode: "cashflow" as const,
                          title: "İndirimli Satış Hesabı",
                          description:
                            "Kampanya veya indirim sonrası satış fiyatına göre hesaplama",
                          example:
                            "Örnek: %10 kampanya sonrası müşterinin ödediği tutar geliriniz olur; kesinti matrahını aşağıda seçersiniz.",
                        },
                      ] as const
                    ).map(({ mode, title, description, example }) => {
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
                          <span
                            className={`mt-3 border-t pt-3 text-[11px] leading-snug ${
                              active
                                ? "border-white/20 text-white/75"
                                : "border-slate-100 text-slate-500"
                            }`}
                          >
                            {example}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
            </FormStep>

            <FormStep
              step={4}
              title="Maliyet ve satış fiyatı"
            hint="Maliyeti TL veya dolar olarak girin. Tutarlar KDV dahildir."
          >
            <div className="mb-5">
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

            <div className="isolate grid min-h-0">
              <div
                className={`col-start-1 row-start-1 transition-all duration-300 ease-out will-change-transform ${
                  costMode === "try"
                    ? "relative z-10 translate-y-0 opacity-100"
                    : "pointer-events-none relative z-0 -translate-y-1 opacity-0"
                }`}
                inert={costMode !== "try" ? true : undefined}
              >
                <div className="space-y-4">
                  <NumberField
                    id="purchasePrice"
                    label="Ürünün size maliyeti (KDV dahil)"
                    suffix="₺"
                    value={inputs.purchasePrice}
                    onChange={(v) => setInput("purchasePrice", v)}
                  />
                  {usdExcl === 0 ? (
                    <div className="space-y-2 pt-0.5">
                      <p className="text-xs leading-relaxed text-slate-500">
                        Dilersen maliyeti dolar üzerinden de girebilirsin
                      </p>
                      <NumberField
                        id="usdExclBridge"
                        label="Alış (USD, KDV hariç)"
                        suffix="$"
                        value={usdExcl}
                        onChange={(v) => {
                          setUsdExcl(v);
                          if (v > 0) setCostMode("usd");
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <div
                className={`col-start-1 row-start-1 transition-all duration-300 ease-out will-change-transform ${
                  costMode === "usd"
                    ? "relative z-10 translate-y-0 opacity-100"
                    : "pointer-events-none relative z-0 translate-y-1 opacity-0"
                }`}
                inert={costMode !== "usd" ? true : undefined}
              >
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
                      className="rounded-xl bg-[#22C55E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#16a34a] disabled:opacity-50"
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
                  <div className="rounded-xl bg-amber-50 px-3 py-2 text-sm">
                    <span className="text-amber-900">TL maliyet (KDV dahil): </span>
                    <span className="font-semibold tabular-nums text-amber-950">
                      {tryFmt.format(purchaseFromUsd)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <NumberField
                id="salePrice"
                label="Listede gördüğünüz satış fiyatı (KDV dahil)"
                suffix="₺"
                value={inputs.salePrice}
                onChange={(v) => setInput("salePrice", v)}
              />
            </div>
          </FormStep>

          <FormStep
            step={5}
            title="Komisyon ve giderler"
            hint="Oranlar satış matrahına göre hesaplanır. Otomatik gelen değerleri istediğiniz gibi değiştirebilirsiniz."
          >
            <p className="mb-3 rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2 text-xs text-slate-600">
              {/* TODO: gerçek HB sabit gider profili data/platformDefaults.ts üzerinden güncellenecek */}
              Sabit ₺ ve bazı oranlar platform varsayılanlarıyla başlar; aşağıdan özelleştirebilirsiniz.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <NumberField
                  id="commissionRate"
                  label="Komisyon"
                  suffix="%"
                  value={inputs.commissionRate}
                  onChange={(v) => setInput("commissionRate", v, { fromUser: true })}
                  labelAccessory={FIELD_VARIANCE_TOOLTIP}
                />
                {fieldSources.commissionRate === "category" ? (
                  <p className="mt-1 text-[11px] text-slate-500">
                    Seçilen kategoriye göre otomatik dolduruldu.
                  </p>
                ) : null}
              </div>
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
                  labelAccessory={FIELD_VARIANCE_TOOLTIP}
                />
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  Tahsilat yönetim bedeli sipariş tutarına göre değişir. Bu ortalama bir değerdir.
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span>
                    {paymentFeeAuto
                      ? "Oran sipariş tutarına göre otomatik güncellenir."
                      : "Oran elle düzenlendi."}
                  </span>
                  {!paymentFeeAuto ? (
                    <button
                      type="button"
                      className="font-semibold text-[#0B1F3B] underline decoration-slate-300 underline-offset-2 hover:decoration-[#0B1F3B]"
                      onClick={() => setPaymentFeeAuto(true)}
                    >
                      Otomatik kademeye dön
                    </button>
                  ) : null}
                </p>
              </div>
              <NumberField
                id="stopajRate"
                label="Stopaj"
                suffix="%"
                value={inputs.stopajRate}
                onChange={(v) => setInput("stopajRate", v, { fromUser: true })}
                labelAccessory={FIELD_VARIANCE_TOOLTIP}
              />
              <NumberField
                id="advertisingRate"
                label="Reklam (varsa)"
                suffix="%"
                value={inputs.advertisingRate}
                onChange={(v) => setInput("advertisingRate", v, { fromUser: true })}
                labelAccessory={FIELD_VARIANCE_TOOLTIP}
              />
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

            <p className="mt-4 text-[11px] text-slate-500">
              Stopaj, tahsilat ve sabit ₺ kalemler platform varsayılanlarına göre dolduruldu; değiştirebilirsiniz.
            </p>

            <details className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                Ek sabit kalemler: listeleme, depo, KDV (isteğe bağlı)
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="listingFee"
                  label="Listeleme / vitrin"
                  suffix="₺"
                  value={inputs.listingFee}
                  onChange={(v) => setInput("listingFee", v, { fromUser: true })}
                  labelAccessory={FIELD_VARIANCE_TOOLTIP}
                />
                <NumberField
                  id="warehouseShippingFee"
                  label="Depoya gönderim"
                  suffix="₺"
                  value={inputs.warehouseShippingFee}
                  onChange={(v) => setInput("warehouseShippingFee", v, { fromUser: true })}
                  labelAccessory={FIELD_VARIANCE_TOOLTIP}
                />
                <div className="sm:col-span-2">
                  <NumberField
                    id="otherFixed"
                    label="Diğer sabit gider"
                    suffix="₺"
                    value={inputs.otherFixed}
                    onChange={(v) => setInput("otherFixed", v, { fromUser: true })}
                    labelAccessory={FIELD_VARIANCE_TOOLTIP}
                  />
                </div>
                <div className="sm:col-span-2">
                  <NumberField
                    id="vatRate"
                    label="KDV oranı (sadece alttaki KDV satırları için)"
                    suffix="%"
                    value={inputs.vatRate}
                    onChange={(v) => setInput("vatRate", v)}
                    hint="0 yaparsanız KDV özeti çıkmaz."
                  />
                </div>
              </div>
            </details>
          </FormStep>

          <FormStep
            step={6}
            title="Kargo ve paket"
            hint="Desi ve firmaya göre kargo tahmini otomatik dolar; kargo alanını istediğiniz gibi değiştirebilirsiniz."
          >
            <DesiHelper
              onApplyDesi={(d) => {
                setCargoDesi(d);
                setKargoAuto(true);
              }}
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
                  ? "Kargo, seçilen desi ve firmaya göre otomatik güncellenir."
                  : "Kargo elle düzenlendi; otomatik güncellemeyi tekrar açabilirsiniz."}
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
              <NumberField
                id="kargo"
                label="Kargo (size maliyet)"
                suffix="₺"
                value={inputs.kargo}
                onChange={(v) => {
                  setKargoAuto(false);
                  setInput("kargo", v, { fromUser: true });
                }}
                labelAccessory={FIELD_VARIANCE_TOOLTIP}
              />
              <NumberField
                id="paketleme"
                label="Paketleme"
                suffix="₺"
                value={inputs.paketleme}
                onChange={(v) => setInput("paketleme", v, { fromUser: true })}
                labelAccessory={FIELD_VARIANCE_TOOLTIP}
              />
              <div>
                <NumberField
                  id="hizmetBedeli"
                  label="Hizmet bedeli"
                  suffix="₺"
                  value={inputs.hizmetBedeli}
                  onChange={(v) => setInput("hizmetBedeli", v, { fromUser: true })}
                  labelAccessory={FIELD_VARIANCE_TOOLTIP}
                />
                {inputs.platform === "hepsiburada" ? (
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                    Hepsiburada&apos;da genellikle sabit hizmet bedelidir. Hesabınıza göre değişebilir.
                  </p>
                ) : inputs.platform === "trendyol" ? (
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                    Trendyol&apos;da sipariş başına platform hizmet bedeli hesabınıza göre değişebilir;
                    varsayılan yaklaşık tutar kullanılır.
                  </p>
                ) : null}
              </div>
              <div className="flex items-end">
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
            </div>
          </FormStep>

          <FormStep
            step={7}
            title="Kampanya ve iade"
            hint="İndirimli satış modunda kampanya oranı ve iade/risk satırını buradan ayarlayın."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                id="discountRate"
                label="İndirim / kampanya %"
                suffix="%"
                value={inputs.discountRate}
                onChange={(v) => setInput("discountRate", v)}
              />
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    checked={inputs.fourForThree}
                    onChange={(e) => setInput("fourForThree", e.target.checked)}
                  />
                  4 al 3 öde
                </label>
              </div>
              <div className="sm:col-span-2">
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
                />
              </div>
            </div>
          </FormStep>
        </section>

        <aside className="flex flex-col gap-7 sm:gap-8 lg:sticky lg:top-10">
          <button
            type="button"
            onClick={applyDemoSample}
            className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-3.5 text-sm font-semibold text-[#0B1F3B] shadow-sm transition hover:border-[#22C55E] hover:bg-emerald-50/50"
          >
            Örnek veri ile dene
          </button>
          <ResultCard
            platform={inputs.platform}
            result={result}
            inputs={inputsResolved}
            hasCalculation={hasCalculation}
            breakdownEnriched={breakdownEnriched}
          />
          <TargetPriceCard inputs={inputsResolved} emphasize={emphasizeTargetPrice} />
          <PsychologyCard onCta={scrollToCalculator} />
        </aside>
      </div>

      <footer className="mt-5 border-t border-slate-200/80 pt-4 text-center text-xs text-slate-500 sm:text-left">
        <p>
          Sonuç tahminidir. Kesin rakam için pazaryeri hakediş ve mali müşavirinizi kullanın.
        </p>
      </footer>
      <button
        type="button"
        onClick={openEarlyAccessModal}
        className="floating-badge-enter fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-[220px] rounded-xl border border-white/30 bg-white/10 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 px-3 py-2 text-left text-xs font-medium text-white shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl sm:px-4 sm:py-3 sm:text-sm"
      >
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400 align-middle animate-pulse" />
        Yeni pazaryerleri ekleniyor… çok yakında 🚀
      </button>

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
              Yeni pazaryerleri için erken erişim
            </h3>
            <p className="mt-2 text-sm text-slate-200">
              Amazon, Etsy ve diğer pazaryerleri için hesaplama araçları çok yakında geliyor.
              İlk sen kullan.
            </p>

            <label htmlFor="early-access-email" className="mt-4 block text-xs text-slate-300">
              E-posta
            </label>
            <input
              id="early-access-email"
              type="email"
              value={earlyAccessEmail}
              onChange={(e) => setEarlyAccessEmail(e.target.value)}
              placeholder="ornek@mail.com"
              className="mt-1 w-full rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-300/80 outline-none ring-0 transition focus:border-emerald-400"
            />

            <button
              type="button"
              onClick={submitEarlyAccess}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
            >
              Erken erişim al
            </button>
            <p className="mt-2 text-center text-xs text-slate-300">
              Spam yok. Sadece lansman haberi.
            </p>
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}
