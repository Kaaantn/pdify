import type { RGB } from "../types";

// Samples the dominant non-background color inside a pixel-space box.
// Used to recover approximate text fill color, since pdf.js text content
// items do not expose paint color directly.
export function sampleDominantColor(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  bgColor: RGB,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number
): RGB {
  const x0 = Math.max(0, Math.floor(boxX));
  const y0 = Math.max(0, Math.floor(boxY));
  const x1 = Math.min(canvasWidth, Math.ceil(boxX + boxW));
  const y1 = Math.min(canvasHeight, Math.ceil(boxY + boxH));
  const w = x1 - x0;
  const h = y1 - y0;
  if (w <= 0 || h <= 0) return { r: 0, g: 0, b: 0 };

  let imageData: ImageData;
  try {
    imageData = ctx.getImageData(x0, y0, w, h);
  } catch {
    return { r: 0, g: 0, b: 0 };
  }
  const data = imageData.data;
  const bg = { r: bgColor.r * 255, g: bgColor.g * 255, b: bgColor.b * 255 };

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let count = 0;
  const threshold = 40; // euclidean-ish distance in 0-255 space

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const dr = r - bg.r;
    const dg = g - bg.g;
    const db = b - bg.b;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist > threshold) {
      rSum += r;
      gSum += g;
      bSum += b;
      count++;
    }
  }

  if (count === 0) return { r: 0, g: 0, b: 0 };
  return {
    r: rSum / count / 255,
    g: gSum / count / 255,
    b: bSum / count / 255,
  };
}

export function sampleBackgroundColor(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): RGB {
  try {
    const px = ctx.getImageData(
      Math.min(2, canvasWidth - 1),
      Math.min(2, canvasHeight - 1),
      1,
      1
    ).data;
    return { r: px[0] / 255, g: px[1] / 255, b: px[2] / 255 };
  } catch {
    return { r: 1, g: 1, b: 1 };
  }
}
