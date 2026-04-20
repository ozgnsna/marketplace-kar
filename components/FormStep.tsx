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
    <div className="border-b border-slate-100/90 pb-10 last:border-0 last:pb-0 sm:pb-11">
      <div className="mb-5 flex items-start gap-4">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#22C55E] text-sm font-bold text-white shadow-sm"
          aria-hidden
        >
          {step}
        </span>
        <div>
          <h2 className="text-lg font-bold text-[#0B1F3B]">{title}</h2>
          {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
        </div>
      </div>
      <div className="pl-0 sm:pl-11">{children}</div>
    </div>
  );
}
