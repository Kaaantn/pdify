export interface ToolDef {
  slug: string;
  name: string;
  href: string;
  tagline: string;
  description: string;
}

// Single source of truth for the tool list — Header, the home hub's card
// grid, and the "Pdify · Tranfy" byline all read from this array, so adding
// a new tool later only means adding one entry here plus its route.
export const TOOLS: ToolDef[] = [
  {
    slug: "pdify",
    name: "Pdify",
    href: "/pdify",
    tagline: "Ücretsiz PDF Düzenleyici",
    description: "PDF'inizi Word gibi düzenleyin — metin, görsel ve metadata'yı doğrudan değiştirin.",
  },
  {
    slug: "tranfy",
    name: "Tranfy",
    href: "/tranfy",
    tagline: "Ücretsiz YouTube Transcript Aracı",
    description: "YouTube videosunun altyazısını saniyeli veya düz metin olarak çıkarın.",
  },
];
