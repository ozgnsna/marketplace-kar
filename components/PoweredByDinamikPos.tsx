import Image from "next/image";

/**
 * Kurumsal “Powered by” bloğu. Logo siyah zeminli PNG olarak kullanılır;
 * koyu plaka ile bütünleşir.
 */
export function PoweredByDinamikPos() {
  return (
    <div className="mx-auto w-full max-w-[280px]">
      <div className="rounded-2xl bg-[#0a0a0a] px-5 py-4 ring-1 ring-white/[0.06] sm:px-6 sm:py-5">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45 sm:text-[11px] sm:tracking-[0.24em]">
          Powered by
        </p>
        <div className="mt-3 flex justify-center sm:mt-3.5">
          <Image
            src="/dinamikpos-logo.png"
            alt="DinamikPos"
            width={220}
            height={72}
            className="h-9 w-auto max-w-[min(200px,85vw)] object-contain object-center sm:h-10"
          />
        </div>
      </div>
    </div>
  );
}
