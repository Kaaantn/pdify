import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://pdify.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pdify — PDF'inizi Word Gibi Düzenleyin",
    template: "%s",
  },
  description:
    "Herhangi bir PDF'i yükleyin; içindeki her metni, her görseli ve metadata'yı doğrudan düzenleyin. Tamamen ücretsiz, kayıt gerektirmez, dosyalarınız cihazınızdan hiç çıkmaz.",
  keywords: ["pdf düzenle", "pdf editör", "ücretsiz pdf düzenleyici", "pdf metin düzenle", "pdf online"],
  openGraph: {
    title: "Pdify — PDF'inizi Word Gibi Düzenleyin",
    description: "Metni, görseli ve metadata'yı doğrudan düzenleyin. Dosyanız hiç sunucuya yüklenmez.",
    url: siteUrl,
    siteName: "Pdify",
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
    "@type": "SoftwareApplication",
    name: "Pdify",
    applicationCategory: "Utility",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "PDF içindeki metni, görselleri ve metadata'yı tarayıcıda düzenleyen ücretsiz araç. Dosyalar sunucuya yüklenmez.",
  };

  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-zinc-900 dark:bg-black dark:text-zinc-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Pdify
          </Link>
          <nav className="flex items-center gap-5 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/hakkinda" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Hakkında
            </Link>
            <Link href="/gizlilik" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Gizlilik
            </Link>
          </nav>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
