import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { LegalConsentGate } from "@/components/LegalConsentGate";
import { LegalFooter } from "@/components/LegalFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pazaryeri Kâr Hesaplama | Trendyol Komisyon Hesaplama",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Pazaryeri kâr hesaplama ve Trendyol komisyon hesaplama aracı. Komisyon, kargo, kampanya ve iade dahil net kâr ile minimum satış fiyatı. Trendyol, Hepsiburada ve Shopier.",
  keywords: [
    "pazaryeri kar hesaplama",
    "pazaryeri kâr hesaplama",
    "trendyol komisyon hesaplama",
    "trendyol kâr hesaplama",
    "hepsiburada komisyon",
    "shopier komisyon",
    "net kâr",
    "minimum satış fiyatı",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Pazaryeri Kâr Hesaplama | Trendyol Komisyon Hesaplama",
    description:
      "Trendyol komisyon hesaplama ve pazaryeri kâr hesaplama. Komisyon, kargo ve kampanya dahil net kârı saniyeler içinde görün.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pazaryeri Kâr Hesaplama | Trendyol Komisyon Hesaplama",
    description:
      "Trendyol komisyon hesaplama ve pazaryeri kâr hesaplama aracı. Ücretsiz, kayıtsız.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "tr-TR",
  description:
    "Pazaryeri kâr hesaplama ve Trendyol komisyon hesaplama aracı.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `${SITE_NAME} — Pazaryeri Kâr Hesaplama`,
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "tr-TR",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "TRY",
  },
  description:
    "Trendyol komisyon hesaplama, Hepsiburada ve Shopier için net kâr ve minimum satış fiyatı hesaplayıcı.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen font-sans antialiased">
        <JsonLd data={[websiteJsonLd, appJsonLd]} />
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
