"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Event cover image with a branded fallback. The referenced asset may not
 * exist in /public yet — if loading fails, the navy gradient panel stays
 * visible instead of a broken-image icon. Uses next/image so assets are
 * optimized automatically once they are added.
 */
export function EventImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-48 w-full overflow-hidden bg-gradient-to-br from-aws-navy via-aws-squid to-aws-navy",
        className
      )}
    >
      {/* Decorative grid so the fallback surface looks intentional */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]"
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-opacity group-hover:opacity-90"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}
