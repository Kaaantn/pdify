import type { FontFamilyHint } from "../types";

// Real, Unicode-capable TTFs (Liberation family, SIL OFL licensed) embedded
// via fontkit instead of pdf-lib's built-in StandardFonts. The standard 14
// fonts use WinAnsi encoding, which cannot represent Turkish letters like
// ı/İ/ş/ğ and throws at draw time — Liberation covers full Latin Extended-A,
// and is metrically compatible with Arial/Times/Courier so layout stays close.
export function pickFontFile(hint: FontFamilyHint, bold: boolean, italic: boolean): string {
  const family = hint === "monospace" ? "LiberationMono" : hint === "serif" ? "LiberationSerif" : "LiberationSans";
  let style = "Regular";
  if (bold && italic) style = "BoldItalic";
  else if (bold) style = "Bold";
  else if (italic) style = "Italic";
  return `/fonts/${family}-${style}.ttf`;
}
