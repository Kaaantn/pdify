// Re-encodes any loaded image (jpg/webp/gif/png) to a PNG data URL so the
// rest of the app can rely on ImageBlock.src always being a PNG — this is
// what lib/export/buildPdf.ts assumes when it calls pdfDoc.embedPng.
export function toPngDataUrl(img: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}
