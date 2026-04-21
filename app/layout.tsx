import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { LegalConsentGate } from "@/components/LegalConsentGate";
import { LegalFooter } from "@/components/LegalFooter";

export const metadata: Metadata = {
  title: {
    default: "Pazaryeri kâr hesabı | Trendyol · Hepsiburada",
    template: "%s | Pazaryeri Kâr Hesabı",
  },
  description:
    "Trendyol ve Hepsiburada için komisyon, kargo, kampanya ve iade dahil net kâr. Liste veya indirimli satış modu; akıllı hesaplama türü önerisi. Hedef fiyat ve TCMB kur. PWA olarak kurulabilir.",
  keywords: [
    "Trendyol kâr hesabı",
    "Hepsiburada kâr",
    "pazaryeri komisyon",
    "net kâr",
    "minimum satış fiyatı",
  ],
  applicationName: "Pazaryeri Kâr Hesabı",
  appleWebApp: {
    capable: true,
    title: "Kâr Hesabı",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0B1F3B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen font-sans antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SH7PBB7LEP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SH7PBB7LEP');
          `}
        </Script>
        <LegalConsentGate>
          {children}
          <LegalFooter />
        </LegalConsentGate>
      </body>
    </html>
  );
}
