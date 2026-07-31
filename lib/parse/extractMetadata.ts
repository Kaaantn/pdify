import type { PdfJsDocument } from "./pdfjsSetup";
import type { DocMetadata } from "../types";

export async function extractMetadata(pdf: PdfJsDocument): Promise<DocMetadata> {
  try {
    const meta = await pdf.getMetadata();
    const info = (meta.info ?? {}) as Record<string, unknown>;
    return {
      title: typeof info.Title === "string" ? info.Title : "",
      author: typeof info.Author === "string" ? info.Author : "",
      subject: typeof info.Subject === "string" ? info.Subject : "",
      keywords: typeof info.Keywords === "string" ? info.Keywords : "",
      creator: typeof info.Creator === "string" ? info.Creator : "",
    };
  } catch {
    return { title: "", author: "", subject: "", keywords: "", creator: "" };
  }
}
