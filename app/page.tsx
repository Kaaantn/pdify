import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TOOLS } from "@/lib/tools";
import { ByKaanTan } from "@/components/site/ByKaanTan";

export default function HubHome() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="kt-gradient pointer-events-none absolute inset-x-0 top-0 h-96" />
      <main className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-6 py-20 text-center">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          KT Apps
        </h1>
        <ByKaanTan className="mt-3" />
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Ücretsiz, reklamsız küçük araçlar. Hesap yok, kayıt yok, ödeme yok.
        </p>

        <div className="mt-14 grid w-full grid-cols-1 gap-5 text-left sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.href}
              className="group flex flex-col rounded-xl border border-divider bg-background p-6 transition-colors hover:border-accent-readable"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-lg font-extrabold text-foreground">
                  {tool.name}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent-readable" />
              </div>
              <span className="mt-1 text-sm font-medium text-accent-readable">{tool.tagline}</span>
              <p className="mt-3 text-sm text-muted-foreground">{tool.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
