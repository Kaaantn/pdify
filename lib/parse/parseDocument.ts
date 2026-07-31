import { loadPdfDocument } from "./pdfjsSetup";
import { extractTextBlocks } from "./extractText";
import { extractImageBlocks } from "./extractImages";
import { extractMetadata } from "./extractMetadata";
import type { DocModel, PageModel } from "../types";

const RENDER_SCALE = 2;

function yieldToMain() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function parsePdfFile(
  file: File,
  onProgress?: (done: number, total: number) => void
): Promise<DocModel> {
  const arrayBuffer = await file.arrayBuffer();
  const originalBytes = new Uint8Array(arrayBuffer);
  // pdfjs detaches/consumes the buffer it's given, so hand it a copy.
  const pdf = await loadPdfDocument(originalBytes.slice());

  const metadata = await extractMetadata(pdf);
  const pages: PageModel[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: RENDER_SCALE });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // intent: "print" skips pdf.js's requestAnimationFrame-based scheduling,
    // which otherwise stalls rendering while the tab is backgrounded/hidden.
    await page.render({ canvas, viewport, intent: "print" }).promise;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const textContent = await page.getTextContent();
    const idPrefix = `p${i - 1}`;

    const textBlocks = extractTextBlocks({
      pageIndex: i - 1,
      textContent,
      viewport,
      ctx,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      idPrefix,
    });

    const imageBlocks = await extractImageBlocks(
      page,
      i - 1,
      idPrefix,
      viewport,
      ctx,
      canvas.width,
      canvas.height
    );

    const unviewedViewport = page.getViewport({ scale: 1 });
    const unsupportedLayout = textBlocks.length === 0 && imageBlocks.length > 0;

    pages.push({
      index: i - 1,
      originalWidth: unviewedViewport.width,
      originalHeight: unviewedViewport.height,
      rotation: 0,
      deleted: false,
      previewDataUrl: canvas.toDataURL("image/png"),
      textBlocks,
      imageBlocks,
      unsupportedLayout,
    });

    onProgress?.(i, pdf.numPages);
    await yieldToMain();
  }

  return {
    fileName: file.name,
    originalBytes,
    pages,
    pageOrder: pages.map((p) => p.index),
    metadata,
  };
}
