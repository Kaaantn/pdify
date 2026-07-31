// Editable page model shared between parsing, rendering, and export.

export interface RGB {
  r: number; // 0-1
  g: number; // 0-1
  b: number; // 0-1
}

export type FontFamilyHint = "sans" | "serif" | "monospace";

export interface TextBlock {
  id: string;
  pageIndex: number;
  // PDF user space (points, origin bottom-left of the page, y-up).
  x: number;
  y: number; // baseline
  width: number;
  height: number; // approx font box height
  fontSize: number;
  fontHint: FontFamilyHint;
  bold: boolean;
  italic: boolean;
  color: RGB;
  bgColor: RGB; // sampled local background, used to cover the original text on export
  text: string;
  originalText: string;
  modified: boolean;
  deleted: boolean;
  isNew: boolean;
}

export interface ImageBlock {
  id: string;
  pageIndex: number;
  x: number;
  y: number; // bottom-left, PDF space
  width: number;
  height: number;
  // PNG data URL, always re-encoded to PNG for simplicity of embedding.
  src: string;
  originalSrc: string | null;
  bgColor: RGB; // sampled local background, used to cover the original image on export
  modified: boolean;
  deleted: boolean;
  isNew: boolean;
}

export interface DocMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
}

export interface PageModel {
  index: number; // index into the original PDF (stable, used for embedPage)
  originalWidth: number;
  originalHeight: number;
  rotation: number; // additional rotation applied by the user, degrees (0/90/180/270)
  deleted: boolean;
  // Rendered reference raster of the *original, unedited* page, used as the
  // canvas background so untouched content stays pixel-perfect.
  previewDataUrl: string;
  textBlocks: TextBlock[];
  imageBlocks: ImageBlock[];
  unsupportedLayout: boolean;
}

export interface DocModel {
  fileName: string;
  originalBytes: Uint8Array;
  pages: PageModel[];
  pageOrder: number[]; // order of page.index values, for reordering
  metadata: DocMetadata;
}
