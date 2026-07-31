import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-divider">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-muted-foreground">
        KT Apps —{" "}
        <Link
          href="https://kaantan.com.tr"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-divider underline-offset-2 hover:text-foreground"
        >
          Kaan Tan
        </Link>{" "}
        tarafından yapıldı.
      </div>
    </footer>
  );
}
