import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { levelBadgeClass, getResourcesLinkedToPaths } from "@/lib/learning";

export function RelatedResources() {
  const linkedResources = getResourcesLinkedToPaths();

  return (
    <section
      id="related-resources"
      aria-labelledby="related-resources-heading"
      className="scroll-mt-24 space-y-8"
    >
      <SectionHeading
        id="related-resources-heading"
        eyebrow="Resource library"
        title="Supporting materials for every path"
        description="Curated guides from the GCET resource library that map directly onto the learning paths above. The full library lives on the Resources page."
      />

      {linkedResources.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#4C2A66]/60 bg-[#100B18] p-10 text-center">
          <p className="font-bold text-white">
            Path-linked resources are being curated.
          </p>
          <p className="mt-1 text-sm text-[#A89DB5]">
            Browse the complete resource library in the meantime.
          </p>
          <Link
            href="/resources"
            className="mt-4 inline-block text-sm font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            Browse all resources
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {linkedResources.map(({ resource, paths }, index) => (
            <li key={resource.id} className="h-full">
              <Reveal delay={Math.min(index * 0.05, 0.2)} className="h-full">
                <article className="group relative flex h-full flex-col rounded-2xl border border-[#4C2A66]/50 bg-[#100B18] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/50 hover:bg-[#171020] sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-purple-500/30 bg-purple-950/40 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-purple-300">
                      {resource.category}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                        levelBadgeClass(resource.difficulty),
                      )}
                    >
                      {resource.difficulty}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-balance text-white">
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                    >
                      {resource.title}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </h3>
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-[#A89DB5]">
                    {resource.description}
                  </p>

                  <div className="mt-auto space-y-3 border-t border-[#4C2A66]/40 pt-4">
                    <ul className="flex flex-wrap items-center gap-2 text-xs">
                      {paths.map((path) => (
                        <li key={path.id}>
                          <Link
                            href={`/learning/${path.id}`}
                            className="relative z-10 inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-950/30 px-2.5 py-1 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-900/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                          >
                            Supports: {path.topicLabel}
                            <ArrowRight className="size-3" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#9C90AA]">
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="size-3.5" aria-hidden="true" />
                        {resource.type} · Updated {resource.updatedAt}
                      </span>
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-center">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 rounded-xl border border-[#4C2A66]/60 bg-[#171020] px-5 py-2.5 text-sm font-semibold text-[#F8FAFC] transition-all hover:border-amber-300/50 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        >
          Browse the full resource library
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
