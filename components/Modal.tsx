"use client";

import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  /** İçerik */
  children: ReactNode;
  /** Dışarı tıklanınca (opsiyonel) */
  onBackdropClick?: () => void;
  /** Ek sınıf — panel için */
  className?: string;
  /** z-index katmanı */
  zIndexClass?: string;
  /** Arka plan: blur + karartma */
  backdropClassName?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

/**
 * Genel amaçlı modal — sabit overlay, ortalanmış panel.
 * Yasal onay gibi zorunlu akışlarda onBackdropClick vermeyin.
 */
export function Modal({
  open,
  children,
  onBackdropClick,
  className = "",
  zIndexClass = "z-[200]",
  backdropClassName = "bg-slate-900/40 backdrop-blur-sm",
  ...aria
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 ${zIndexClass}`}
      role="presentation"
    >
      {onBackdropClick ? (
        <button
          type="button"
          className={`absolute inset-0 ${backdropClassName}`}
          aria-hidden
          tabIndex={-1}
          onClick={onBackdropClick}
        />
      ) : (
        <div className={`absolute inset-0 ${backdropClassName}`} aria-hidden />
      )}
      <div
        role="dialog"
        aria-modal="true"
        className={`pointer-events-auto relative z-10 w-full max-w-lg max-h-[min(90vh,720px)] overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10 ${className}`}
        {...aria}
      >
        {children}
      </div>
    </div>
  );
}
