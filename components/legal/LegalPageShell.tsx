import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageShellProps = {
  title: string;
  children: ReactNode;
};

/** Yasal metin sayfaları — alt bilgi `layout` içindeki LegalFooter ile gelir. */
export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-[#f3f5f9]">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold text-[#0B1F3B] hover:underline"
          >
            ← Ana sayfa
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">{title}</h1>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-600 [&_p]:leading-relaxed">
          {children}
        </div>
      </main>
    </div>
  );
}
