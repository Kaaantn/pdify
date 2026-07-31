export interface TranscriptSegment {
  start: number;
  duration: number;
  text: string;
}

export function formatTimestamp(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function toTimedText(segments: TranscriptSegment[]): string {
  return segments.map((s) => `${formatTimestamp(s.start)} — ${s.text}`).join("\n");
}

export function toPlainText(segments: TranscriptSegment[]): string {
  return segments.map((s) => s.text).join(" ");
}
