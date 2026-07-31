import Link from "next/link";
import { cn } from "@/lib/utils";

export function ByKaanTan({ className }: { className?: string }) {
  return (
    <Link
      href="https://kaantan.com.tr"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-sm text-muted-foreground underline decoration-divider underline-offset-2 hover:text-foreground",
        className
      )}
    >
      by Kaan Tan
    </Link>
  );
}
