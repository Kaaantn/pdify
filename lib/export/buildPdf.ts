import { PDFDocument, PDFFont, PDFImage, degrees, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { pickFontFile } from "./fontMatching";
import type { DocModel } from "../types";

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function embedImageAuto(outDoc: PDFDocument, bytes: Uint8Array): Promise<PDFImage> {
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const isJpg = bytes[0] === 0xff && bytes[1] === 0xd8;
  if (isJpg) return outDoc.embedJpg(bytes);
  if (!isPng) {
    // Unexpected format slipped through; treating as PNG gives the clearest error.
    console.warn("Beklenmeyen görsel formatı, PNG olarak deneniyor");
  }
  return outDoc.embedPng(bytes);
}

export async function buildEditedPdf(doc: DocModel): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(doc.originalBytes);
  const outDoc = await PDFDocument.create();
  outDoc.registerFontkit(fontkit);

  outDoc.setTitle(doc.metadata.title || "");
  outDoc.setAuthor(doc.metadata.author || "");
  outDoc.setSubject(doc.metadata.subject || "");
  outDoc.setKeywords(
    doc.metadata.keywords
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
  outDoc.setCreator(doc.metadata.creator || "Pdify");
  outDoc.setProducer("Pdify");
  outDoc.setModificationDate(new Date());

  const fontCache = new Map<string, PDFFont>();
  async function getFont(hint: "sans" | "serif" | "monospace", bold: boolean, italic: boolean) {
    const path = pickFontFile(hint, bold, italic);
    let font = fontCache.get(path);
    if (!font) {
      const res = await fetch(path);
      const fontBytes = new Uint8Array(await res.arrayBuffer());
      font = await outDoc.embedFont(fontBytes, { subset: true });
      fontCache.set(path, font);
    }
    return font;
  }

  const imageCache = new Map<string, PDFImage>();
  async function getImage(src: string) {
    let img = imageCache.get(src);
    if (!img) {
      const bytes = dataUrlToBytes(src);
      img = await embedImageAuto(outDoc, bytes);
      imageCache.set(src, img);
    }
    return img;
  }

  const pageByIndex = new Map(doc.pages.map((p) => [p.index, p]));

  for (const idx of doc.pageOrder) {
    const pageModel = pageByIndex.get(idx);
    if (!pageModel || pageModel.deleted) continue;

    const srcPage = srcDoc.getPage(pageModel.index);
    const { width, height } = srcPage.getSize();
    const embedded = await outDoc.embedPage(srcPage);

    const newPage = outDoc.addPage([width, height]);
    newPage.drawPage(embedded, { x: 0, y: 0, width, height });

    const totalRotation = (srcPage.getRotation().angle + pageModel.rotation) % 360;
    newPage.setRotation(degrees(totalRotation));

    for (const img of pageModel.imageBlocks) {
      const touched = (img.modified && !img.isNew) || img.isNew;
      if (!touched) continue;
      if (img.deleted && !img.isNew) {
        newPage.drawRectangle({
          x: img.x,
          y: img.y,
          width: img.width,
          height: img.height,
          color: rgb(img.bgColor.r, img.bgColor.g, img.bgColor.b),
        });
        continue;
      }
      if (img.deleted && img.isNew) continue;

      try {
        if (img.modified && !img.isNew) {
          newPage.drawRectangle({
            x: img.x,
            y: img.y,
            width: img.width,
            height: img.height,
            color: rgb(img.bgColor.r, img.bgColor.g, img.bgColor.b),
          });
        }
        const embeddedImg = await getImage(img.src);
        newPage.drawImage(embeddedImg, {
          x: img.x,
          y: img.y,
          width: img.width,
          height: img.height,
        });
      } catch (err) {
        console.error("Görsel gömülemedi, atlanıyor:", err);
      }
    }

    for (const t of pageModel.textBlocks) {
      const touched = (t.modified && !t.isNew) || t.isNew;
      if (!touched) continue;
      if (t.deleted && t.isNew) continue;

      const coverPadX = 1;
      const coverBottom = t.height * 0.3;
      const coverTop = t.height * 0.2;
      try {
        if (!t.isNew) {
          newPage.drawRectangle({
            x: t.x - coverPadX,
            y: t.y - coverBottom,
            width: t.width + coverPadX * 2,
            height: t.height + coverBottom + coverTop,
            color: rgb(t.bgColor.r, t.bgColor.g, t.bgColor.b),
          });
        }
        if (!t.deleted && t.text.trim()) {
          const font = await getFont(t.fontHint, t.bold, t.italic);
          newPage.drawText(t.text, {
            x: t.x,
            y: t.y,
            size: t.fontSize,
            font,
            color: rgb(t.color.r, t.color.g, t.color.b),
          });
        }
      } catch (err) {
        console.error("Metin çizilemedi, atlanıyor:", err);
      }
    }
  }

  return outDoc.save();
}
