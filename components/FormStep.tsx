"use client";

import type { ReactNode } from "react";

interface FormStepProps {
  step: number;
  title: string;
  hint?: string;
  children: ReactNode;
}

export function FormStep({ step, title, hint, children }: FormStepProps) {
  return (
    <div className="border-b border-slate-100/90 pb-7 last:border-0 last:pb-0 sm:pb-10">
      <div className="mb-4 flex items-start gap-3 sm:mb-5 sm:gap-4">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#22C55E] text-sm font-bold text-white shadow-sm sm:h-10 sm:w-10"
          aria-hidden
        >
          {step}
        </span>
        <div>
          <h2 className="text-base font-bold text-[#0B1F3B] sm:text-lg">{title}</h2>
          {hint ? <p className="mt-1 text-xs text-slate-500 sm:text-sm">{hint}</p> : null}
        </div>
      </div>
      <div className="pl-0 sm:pl-11">{children}</div>
    </div>
  );
}
