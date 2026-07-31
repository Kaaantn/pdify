import { StandardFonts } from "pdf-lib";
import type { FontFamilyHint } from "../types";

// Best-effort fallback: standard PDF fonts are embedded in nearly every
// reader, so this keeps output portable without shipping/subsetting the
// original font program. See /hakkinda for the documented limitation.
export function pickStandardFont(
  hint: FontFamilyHint,
  bold: boolean,
  italic: boolean
): StandardFonts {
  if (hint === "monospace") {
    if (bold && italic) return StandardFonts.CourierBoldOblique;
    if (bold) return StandardFonts.CourierBold;
    if (italic) return StandardFonts.CourierOblique;
    return StandardFonts.Courier;
  }
  if (hint === "serif") {
    if (bold && italic) return StandardFonts.TimesRomanBoldItalic;
    if (bold) return StandardFonts.TimesRomanBold;
    if (italic) return StandardFonts.TimesRomanItalic;
    return StandardFonts.TimesRoman;
  }
  if (bold && italic) return StandardFonts.HelveticaBoldOblique;
  if (bold) return StandardFonts.HelveticaBold;
  if (italic) return StandardFonts.HelveticaOblique;
  return StandardFonts.Helvetica;
}
