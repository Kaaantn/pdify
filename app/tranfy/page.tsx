"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ByKaanTan } from "@/components/site/ByKaanTan";
import { cn } from "@/lib/utils";
import { formatTimestamp, toPlainText, toTimedText, type TranscriptSegment } from "@/lib/tranfy/format";
import { Check, Clipboard, Download, Loader2 } from "lucide-react";

type ViewMode = "timed" | "plain";

export default function TranfyPage() {
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [segments, setSegments] = React.useState<TranscriptSegment[] | null>(null);
  const [videoId, setVideoId] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<ViewMode>("timed");
  const [copied, setCopied] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true);
    setError(null);
    setSegments(null);
    try {
      const res = await fetch("/api/tranfy/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Bir hata oluştu.");
        return;
      }
      setSegments(data.segments);
      setVideoId(data.videoId);
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  const text = segments ? (mode === "timed" ? toTimedText(segments) : toPlainText(segments)) : "";

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${videoId ?? "transcript"}-${mode}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="kt-gradient pointer-events-none absolute inset-x-0 top-0 h-96" />
      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-6 py-20 text-center">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Ücretsiz YouTube Transcript Aracı
        </h1>
        <ByKaanTan className="mt-3" />

        <form onSubmit={handleSubmit} className="mt-10 flex w-full flex-col gap-3 sm:flex-row">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="YouTube linkini yapıştır..."
            className="h-11 flex-1"
          />
          <Button type="submit" variant="accent" size="default" className="h-11" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Transcript Çıkar
          </Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">Desteklenen: YouTube (Shorts dahil)</p>

        {error && (
          <div className="mt-6 w-full rounded-lg border border-divider bg-background px-4 py-3 text-sm text-foreground">
            {error}
          </div>
        )}

        {segments && (
          <div className="mt-10 w-full text-left">
            <div className="flex items-center justify-between gap-2">
              <div className="flex rounded-md border border-divider p-0.5">
                <button
                  type="button"
                  onClick={() => setMode("timed")}
                  className={cn(
                    "rounded px-3 py-1.5 text-sm",
                    mode === "timed" ? "bg-accent text-foreground" : "text-muted-foreground"
                  )}
                >
                  Saniyeli
                </button>
                <button
                  type="button"
                  onClick={() => setMode("plain")}
                  className={cn(
                    "rounded px-3 py-1.5 text-sm",
                    mode === "plain" ? "bg-accent text-foreground" : "text-muted-foreground"
                  )}
                >
                  Saniyesiz
                </button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
                  Kopyala
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-3.5 w-3.5" />
                  İndir (.txt)
                </Button>
              </div>
            </div>

            <div className="mt-4 max-h-[28rem] overflow-y-auto rounded-lg border border-divider bg-background p-4">
              {mode === "timed" ? (
                <ul className="space-y-2">
                  {segments.map((s, i) => (
                    <li key={i} className="text-sm text-foreground">
                      <span className="mr-2 font-medium text-accent-readable">
                        {formatTimestamp(s.start)}
                      </span>
                      {s.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{text}</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
