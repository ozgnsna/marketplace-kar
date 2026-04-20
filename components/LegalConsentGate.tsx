"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { LegalConsentModal } from "@/components/LegalConsentModal";
import { readLegalAccepted } from "@/lib/legalStorage";

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
      setStatus(readLegalAccepted() ? "done" : "need");
    } catch {
      setStatus("need");
    }
  }, []);

  const blockInteraction = status !== "done";
  const showModal = status === "need";

  useEffect(() => {
    if (!blockInteraction) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [blockInteraction]);

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
