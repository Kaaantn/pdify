import * as pdfjsLib from "pdfjs-dist";
import type { ImageBlock, RGB } from "../types";

type Matrix = number[]; // [a,b,c,d,e,f]

const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0];

function imageObjToDataUrl(obj: unknown): string | null {
  const anyObj = obj as {
    bitmap?: ImageBitmap;
    data?: Uint8ClampedArray | Uint8Array;
    width?: number;
    height?: number;
    kind?: number;
  };

  const width = anyObj.width ?? 0;
  const height = anyObj.height ?? 0;
  if (!width || !height) return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  if (anyObj.bitmap) {
    ctx.drawImage(anyObj.bitmap, 0, 0);
    return canvas.toDataURL("image/png");
  }

  if (anyObj.data) {
    const src = anyObj.data;
    const out = ctx.createImageData(width, height);
    const kind = anyObj.kind ?? 2;
    const srcLen = width * height;
    if (kind === 3 && src.length >= srcLen * 4) {
      out.data.set(src.subarray ? src.subarray(0, srcLen * 4) : src.slice(0, srcLen * 4));
    } else if (kind === 2 && src.length >= srcLen * 3) {
      for (let i = 0, j = 0; i < srcLen; i++, j += 3) {
        out.data[i * 4] = src[j];
        out.data[i * 4 + 1] = src[j + 1];
        out.data[i * 4 + 2] = src[j + 2];
        out.data[i * 4 + 3] = 255;
      }
    } else if (kind === 1 && src.length >= srcLen) {
      for (let i = 0; i < srcLen; i++) {
        const v = src[i];
        out.data[i * 4] = v;
        out.data[i * 4 + 1] = v;
        out.data[i * 4 + 2] = v;
        out.data[i * 4 + 3] = 255;
      }
    } else {
      return null;
    }
    ctx.putImageData(out, 0, 0);
    return canvas.toDataURL("image/png");
  }

  return null;
}

function matMul(m1: Matrix, m2: Matrix): Matrix {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
}

export async function extractImageBlocks(
  page: pdfjsLib.PDFPageProxy,
  pageIndex: number,
  idPrefix: string,
  viewport: pdfjsLib.PageViewport,
  ctx: CanvasRenderingContext2D | null,
  canvasWidth: number,
  canvasHeight: number
): Promise<ImageBlock[]> {
  const blocks: ImageBlock[] = [];
  let opList;
  try {
    opList = await page.getOperatorList();
  } catch {
    return blocks;
  }

  const OPS = pdfjsLib.OPS;
  const stack: Matrix[] = [];
  let ctm: Matrix = IDENTITY;
  let counter = 0;

  for (let i = 0; i < opList.fnArray.length; i++) {
    const fn = opList.fnArray[i];
    const args = opList.argsArray[i];

    if (fn === OPS.save) {
      stack.push(ctm);
    } else if (fn === OPS.restore) {
      ctm = stack.pop() ?? IDENTITY;
    } else if (fn === OPS.transform) {
      ctm = matMul(ctm, args as Matrix);
    } else if (
      fn === OPS.paintImageXObject ||
      fn === OPS.paintImageMaskXObject
    ) {
      const name = Array.isArray(args) ? args[0] : undefined;
      if (!name) continue;
      let obj;
      try {
        obj = page.objs.get(name);
      } catch {
        continue;
      }
      const dataUrl = imageObjToDataUrl(obj);
      if (!dataUrl) continue;

      // Unit square [0,1]x[0,1] mapped through ctm -> page space rectangle.
      // Only axis-aligned placement is supported (the common case); skewed
      // or rotated image placements fall back to the bounding box.
      const x0 = ctm[4];
      const y0 = ctm[5];
      const x1 = ctm[0] + ctm[2] + ctm[4];
      const y1 = ctm[1] + ctm[3] + ctm[5];
      const x = Math.min(x0, x1);
      const y = Math.min(y0, y1);
      const width = Math.abs(x1 - x0);
      const height = Math.abs(y1 - y0);
      if (width < 1 || height < 1) continue;

      let bgColor: RGB = { r: 1, g: 1, b: 1 };
      if (ctx) {
        const sample: [number, number] = [x + width / 2, y + height + 3];
        pdfjsLib.Util.applyTransform(sample, viewport.transform);
        const sx = Math.round(sample[0]);
        const sy = Math.round(sample[1]);
        if (sx >= 0 && sx < canvasWidth && sy >= 0 && sy < canvasHeight) {
          try {
            const px = ctx.getImageData(sx, sy, 1, 1).data;
            bgColor = { r: px[0] / 255, g: px[1] / 255, b: px[2] / 255 };
          } catch {
            // keep default
          }
        }
      }

      blocks.push({
        id: `${idPrefix}-i-${counter++}`,
        pageIndex,
        x,
        y,
        width,
        height,
        src: dataUrl,
        originalSrc: dataUrl,
        bgColor,
        modified: false,
        deleted: false,
        isNew: false,
      });
    }
  }

  return blocks;
}
