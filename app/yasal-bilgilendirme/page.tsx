import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Yasal Bilgilendirme",
  description: "Marka bağımsızlığı ve tarife uyarısı.",
};

export default function YasalBilgilendirmePage() {
  return (
    <LegalPageShell title="Yasal Bilgilendirme">
      <p>
        Pazarkar, Trendyol, Hepsiburada veya diğer pazaryeri markalarının resmi temsilcisi, iştiraki veya
        iş ortağı değildir. Bu platform üzerinde geçen ticari markalar ilgili hak sahiplerine aittir;
        yalnızca kullanıcıyı bilgilendirme amacıyla anılmaktadır.
      </p>
      <p>
        Pazaryerlerinde uygulanan komisyon oranları, hizmet bedelleri, kargo ücretleri ve kampanya
        koşulları zaman içinde değişebilir. Hesaplamalarda kullanılan örnek veya varsayılan değerler
        güncel panel ve sözleşmelerinizle her zaman aynı olmayabilir.
      </p>
      <p>
        Yasal ve mali yükümlülükleriniz için her zaman ilgili pazaryeri sözleşmeleri ve güncel duyurular
        esas alınmalıdır.
      </p>
    </LegalPageShell>
  );
}
