import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { RevealObserver } from "@/components/RevealObserver";
import { site } from "@/config/site";
import { organizationSchema, pageMetadata, websiteSchema } from "@/lib/seo";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-geist-mono", display: "swap" });

const base = pageMetadata({ description: site.seo.defaultDescription, path: "/" });

export const metadata: Metadata = {
  ...base,
  metadataBase: new URL(site.url),
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  ...(site.google.searchConsoleVerification ? { verification: { google: site.google.searchConsoleVerification } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#FF5A1F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.language} className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header dashboardUrl={site.dashboardUrl} />
        <main id="main">{children}</main>
        <Footer />
        <RevealObserver />
        <Analytics gaId={site.google.ga4Id} />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
