import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus-visible:border-lime-400 focus-visible:ring-2 focus-visible:ring-lime-400/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-16 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus-visible:border-lime-400 focus-visible:ring-2 focus-visible:ring-lime-400/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400", className)}
      {...props}
    />
  );
}
