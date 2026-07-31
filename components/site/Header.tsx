"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { TOOLS } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-divider bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-[13px] font-heading font-extrabold text-foreground">
            KT
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-[15px] font-extrabold tracking-tight text-foreground">
              KT Apps
            </span>
            <span className="text-xs text-muted-foreground">
              {TOOLS.map((t) => t.name).join(" · ")}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2" ref={ref}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-foreground hover:bg-divider/60"
            >
              Tools
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-divider bg-background shadow-lg">
                {TOOLS.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={tool.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 hover:bg-divider/50"
                  >
                    <span className="block text-sm font-medium text-foreground">{tool.name}</span>
                    <span className="block text-xs text-muted-foreground">{tool.tagline}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
