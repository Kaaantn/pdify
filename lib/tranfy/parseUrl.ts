export type UrlKind = "youtube" | "tiktok" | "instagram" | "unknown";

const YT_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtube\.com\/live\/|youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
];

export function detectUrlKind(input: string): UrlKind {
  const s = input.toLowerCase();
  if (/youtube\.com|youtu\.be/.test(s)) return "youtube";
  if (/tiktok\.com/.test(s)) return "tiktok";
  if (/instagram\.com/.test(s)) return "instagram";
  return "unknown";
}

export function extractYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  for (const pattern of YT_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  // Bare 11-character video id.
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}
