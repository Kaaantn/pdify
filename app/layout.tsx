import type { Metadata } from "next";
import "./globals.css";
import { manrope, liberationSans } from "./fonts";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const siteUrl = "https://pdify.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KT Apps — Ücretsiz Mini Araçlar",
    template: "%s | KT Apps",
  },
  description:
    "Kaan Tan tarafından yapılan, ücretsiz, reklamsız, hesap gerektirmeyen küçük web araçları.",
  keywords: ["kt apps", "pdify", "tranfy", "ücretsiz araçlar", "kaan tan"],
  openGraph: {
    title: "KT Apps — Ücretsiz Mini Araçlar",
    description: "Kaan Tan tarafından yapılan, ücretsiz, reklamsız küçük web araçları.",
    url: siteUrl,
    siteName: "KT Apps",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KT Apps",
    url: siteUrl,
    description: "Kaan Tan tarafından yapılan, ücretsiz, reklamsız küçük web araçları.",
  };

  return (
    <html lang="tr" className={`${manrope.variable} ${liberationSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
