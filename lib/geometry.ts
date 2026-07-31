// Shared PDF-space (points, bottom-left origin, y-up) <-> CSS-space
// (pixels, top-left origin, y-down) conversions used by the editor overlay.

export const PT_TO_PX = 1.3333333333; // 96dpi / 72pt

export interface CssBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function textBoxToCss(
  pageHeightPt: number,
  scale: number,
  x: number,
  y: number,
  width: number,
  height: number
): CssBox {
  const descent = height * 0.25;
  const ascent = height * 0.85;
  const topPt = pageHeightPt - (y + ascent);
  return {
    left: x * scale,
    top: topPt * scale,
    width: width * scale,
    height: (ascent + descent) * scale,
  };
}

export function imageBoxToCss(
  pageHeightPt: number,
  scale: number,
  x: number,
  y: number,
  width: number,
  height: number
): CssBox {
  const topPt = pageHeightPt - (y + height);
  return {
    left: x * scale,
    top: topPt * scale,
    width: width * scale,
    height: height * scale,
  };
}

export function cssToTextOrigin(
  pageHeightPt: number,
  scale: number,
  cssLeft: number,
  cssTop: number,
  cssWidth: number,
  cssHeight: number
): { x: number; y: number; width: number; height: number } {
  const width = cssWidth / scale;
  const height = cssHeight / scale;
  const x = cssLeft / scale;
  const topPt = cssTop / scale;
  const ascent = height * 0.85;
  const y = pageHeightPt - topPt - ascent;
  return { x, y, width, height };
}

export function cssToImageOrigin(
  pageHeightPt: number,
  scale: number,
  cssLeft: number,
  cssTop: number,
  cssWidth: number,
  cssHeight: number
): { x: number; y: number; width: number; height: number } {
  const width = cssWidth / scale;
  const height = cssHeight / scale;
  const x = cssLeft / scale;
  const topPt = cssTop / scale;
  const y = pageHeightPt - topPt - height;
  return { x, y, width, height };
}
