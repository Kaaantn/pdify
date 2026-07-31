import { NextRequest, NextResponse } from "next/server";
import {
  YoutubeTranscript,
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptNotAvailableLanguageError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError,
} from "youtube-transcript";
import { detectUrlKind, extractYoutubeVideoId } from "@/lib/tranfy/parseUrl";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url.trim() : "";

  if (!url) {
    return NextResponse.json({ error: "Bir video linki girin." }, { status: 400 });
  }

  const kind = detectUrlKind(url);
  if (kind === "tiktok" || kind === "instagram") {
    return NextResponse.json(
      { error: "Bu link desteklenmiyor, şu an sadece YouTube linkleri kabul ediliyor." },
      { status: 422 }
    );
  }

  const videoId = extractYoutubeVideoId(url);
  if (!videoId) {
    return NextResponse.json(
      { error: "Bu link desteklenmiyor, şu an sadece YouTube linkleri kabul ediliyor." },
      { status: 422 }
    );
  }

  try {
    const raw = await YoutubeTranscript.fetchTranscript(videoId);
    if (!raw.length) {
      return NextResponse.json(
        { error: "Bu videoda transkript verisi bulunamadı (altyazı kapalı olabilir)." },
        { status: 404 }
      );
    }

    // The library's offset/duration can come back in seconds or milliseconds
    // depending on which YouTube endpoint answered; normalize to seconds.
    const maxOffset = Math.max(...raw.map((r) => r.offset + r.duration));
    const isMs = maxOffset > 36000; // implausible as seconds for >10h of video
    const divisor = isMs ? 1000 : 1;

    const segments = raw.map((r) => ({
      start: r.offset / divisor,
      duration: r.duration / divisor,
      text: r.text,
    }));

    return NextResponse.json({ videoId, segments });
  } catch (err) {
    if (err instanceof YoutubeTranscriptDisabledError || err instanceof YoutubeTranscriptNotAvailableError) {
      return NextResponse.json(
        { error: "Bu videoda transkript verisi bulunamadı (altyazı kapalı olabilir)." },
        { status: 404 }
      );
    }
    if (err instanceof YoutubeTranscriptVideoUnavailableError) {
      return NextResponse.json({ error: "Video bulunamadı veya erişime kapalı." }, { status: 404 });
    }
    if (err instanceof YoutubeTranscriptTooManyRequestError) {
      return NextResponse.json(
        { error: "YouTube şu an çok fazla istek nedeniyle engelliyor, birazdan tekrar deneyin." },
        { status: 429 }
      );
    }
    if (err instanceof YoutubeTranscriptNotAvailableLanguageError) {
      return NextResponse.json(
        { error: "Bu videoda desteklenen dilde transkript bulunamadı." },
        { status: 404 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Transkript alınırken beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
