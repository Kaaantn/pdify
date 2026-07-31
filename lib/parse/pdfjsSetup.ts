import * as pdfjsLib from "pdfjs-dist";

let configured = false;

export function ensurePdfWorker() {
  if (configured) return;
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  configured = true;
}

export async function loadPdfDocument(bytes: Uint8Array) {
  ensurePdfWorker();
  const loadingTask = pdfjsLib.getDocument({
    data: bytes,
    standardFontDataUrl: "/standard_fonts/",
    cMapUrl: "/cmaps/",
    cMapPacked: true,
  });
  return loadingTask.promise;
}

export type PdfJsDocument = Awaited<ReturnType<typeof loadPdfDocument>>;
