import * as pdfjsLib from "pdfjs-dist";
import type { FontFamilyHint, RGB, TextBlock } from "../types";
import { sampleBackgroundColor, sampleDominantColor } from "./colorSample";

function fontHint(fontFamily: string): FontFamilyHint {
  const f = fontFamily.toLowerCase();
  if (f.includes("monospace") || f.includes("courier") || f.includes("mono")) {
    return "monospace";
  }
  if (f.includes("serif") && !f.includes("sans-serif") && !f.includes("sans serif")) {
    return "serif";
  }
  return "sans";
}

interface ExtractTextArgs {
  pageIndex: number;
  textContent: Awaited<ReturnType<pdfjsLib.PDFPageProxy["getTextContent"]>>;
  viewport: pdfjsLib.PageViewport;
  ctx: CanvasRenderingContext2D | null;
  canvasWidth: number;
  canvasHeight: number;
  idPrefix: string;
}

export function extractTextBlocks({
  pageIndex,
  textContent,
  viewport,
  ctx,
  canvasWidth,
  canvasHeight,
  idPrefix,
}: ExtractTextArgs): TextBlock[] {
  const blocks: TextBlock[] = [];
  const bg: RGB = ctx ? sampleBackgroundColor(ctx, canvasWidth, canvasHeight) : { r: 1, g: 1, b: 1 };
  const styles = (textContent as unknown as { styles: Record<string, { fontFamily?: string }> }).styles ?? {};

  let counter = 0;
  for (const rawItem of textContent.items) {
    const item = rawItem as {
      str?: string;
      transform?: number[];
      width?: number;
      fontName?: string;
      hasEOL?: boolean;
    };
    if (!item.str || !item.str.trim()) continue;
    const t = item.transform;
    if (!t || t.length < 6) continue;

    const fontHeight = Math.hypot(t[2], t[3]) || Math.hypot(t[0], t[1]) || 10;
    const width = item.width ?? fontHeight * item.str.length * 0.5;
    const x = t[4];
    const y = t[5];
    const descent = fontHeight * 0.25;
    const ascent = fontHeight * 0.85;

    const style = item.fontName ? styles[item.fontName] : undefined;
    const family = style?.fontFamily ?? "sans-serif";
    const hint = fontHint(family);
    const nameBlob = `${family} ${item.fontName ?? ""}`.toLowerCase();
    const bold = /bold|black|heavy/.test(nameBlob);
    const italic = /italic|oblique/.test(nameBlob);

    let color: RGB = { r: 0, g: 0, b: 0 };
    let localBg: RGB = bg;
    if (ctx) {
      const p1: [number, number] = [x, y - descent];
      const p2: [number, number] = [x + width, y + ascent];
      pdfjsLib.Util.applyTransform(p1, viewport.transform);
      pdfjsLib.Util.applyTransform(p2, viewport.transform);
      const boxX = Math.min(p1[0], p2[0]);
      const boxY = Math.min(p1[1], p2[1]);
      const boxW = Math.abs(p2[0] - p1[0]);
      const boxH = Math.abs(p2[1] - p1[1]);
      color = sampleDominantColor(ctx, canvasWidth, canvasHeight, bg, boxX, boxY, boxW, boxH);

      const edgeSample: [number, number] = [x - 3, y + fontHeight * 0.3];
      pdfjsLib.Util.applyTransform(edgeSample, viewport.transform);
      const ex = Math.round(edgeSample[0]);
      const ey = Math.round(edgeSample[1]);
      if (ex >= 0 && ex < canvasWidth && ey >= 0 && ey < canvasHeight) {
        try {
          const px = ctx.getImageData(ex, ey, 1, 1).data;
          localBg = { r: px[0] / 255, g: px[1] / 255, b: px[2] / 255 };
        } catch {
          localBg = bg;
        }
      }
    }

    blocks.push({
      id: `${idPrefix}-t-${counter++}`,
      pageIndex,
      x,
      y,
      width: Math.max(width, 4),
      height: fontHeight,
      fontSize: fontHeight,
      fontHint: hint,
      bold,
      italic,
      color,
      bgColor: localBg,
      text: item.str,
      originalText: item.str,
      modified: false,
      deleted: false,
      isNew: false,
    });
  }
  return blocks;
}
