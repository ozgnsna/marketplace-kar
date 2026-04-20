"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { LegalConsentModal } from "@/components/LegalConsentModal";
import { LEGAL_ACCEPTED_KEY, readLegalAccepted } from "@/lib/legalStorage";

type LegalConsentGateProps = {
  children: React.ReactNode;
};

type ConsentStatus = "loading" | "need" | "done";

/**
 * Onay yoksa içerik etkileşime kapalı.
 * `loading`: depo henüz okunmadı — modal mount edilmez (önce açılıp kaybolma yok).
 * `need`: onay gerekli — tek seferlik modal.
 * `done`: depoda onay var veya kullanıcı "Devam Et" dedi.
 */
export function LegalConsentGate({ children }: LegalConsentGateProps) {
  const [status, setStatus] = useState<ConsentStatus>("loading");

  useLayoutEffect(() => {
    try {
      if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
        const reset = new URLSearchParams(window.location.search).get("resetConsent");
        if (reset === "1") {
          window.localStorage.removeItem(LEGAL_ACCEPTED_KEY);
        }
      }
      setStatus(readLegalAccepted() ? "done" : "need");
    } catch {
      setStatus("need");
    }
  }, []);

  const showModal = status === "need";
  /** Sadece modal açıkken arkayı kilitle. `loading` iken modal yok — pointer-events kapalı bırakılırsa hiçbir şeye tıklanamaz. */
  const blockInteraction = status === "need";

  useEffect(() => {
    if (!showModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showModal]);

  const handleAccept = useCallback(() => {
    setStatus("done");
  }, []);

  return (
    <>
      <div
        className={blockInteraction ? "pointer-events-none min-h-screen select-none" : undefined}
        aria-hidden={blockInteraction ? true : undefined}
      >
        {children}
      </div>
      {showModal ? <LegalConsentModal onAccept={handleAccept} /> : null}
    </>
  );
}
