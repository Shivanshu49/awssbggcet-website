import Link from "next/link";

import site from "@/content/site.json";
import { cn } from "@/lib/utils";

// ponytail: text lockup until a real logo lands in public/logo.
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 rounded-md", className)}
    >
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-lg border-b-4 border-aws-orange bg-aws-navy font-heading text-sm font-bold text-surface"
      >
        BC
      </span>
      <span className="font-heading leading-tight font-semibold">
        {site.clubName}
      </span>
    </Link>
  );
}
