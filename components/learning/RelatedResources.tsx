import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getResourcesLinkedToPaths } from "@/lib/learning";

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
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="font-semibold text-ink">
            Path-linked resources are being curated.
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Browse the complete resource library in the meantime.
          </p>
          <Link
            href="/resources"
            className="mt-4 inline-block text-sm font-semibold text-aws-navy underline underline-offset-4 hover:text-aws-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
          >
            Browse all resources
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {linkedResources.map(({ resource, paths }, index) => (
            <li key={resource.id} className="h-full">
              <Reveal delay={Math.min(index * 0.05, 0.2)} className="h-full">
                <article className="relative flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-aws-navy hover:shadow-md sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="muted">{resource.category}</Badge>
                    <Badge variant="outline" className="font-semibold">
                      {resource.difficulty}
                    </Badge>
                  </div>

                  <h3 className="mt-3 font-heading text-base font-semibold text-balance text-ink">
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy after:absolute after:inset-0 after:content-['']"
                    >
                      {resource.title}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </h3>
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                    {resource.description}
                  </p>

                  <div className="mt-auto space-y-3 pt-4">
                    <ul className="flex flex-wrap items-center gap-2 text-xs">
                      {paths.map((path) => (
                        <li key={path.id}>
                          <Link
                            href={`/learning/${path.id}`}
                            className="relative z-10 inline-flex items-center gap-1 rounded-full border border-aws-orange/40 bg-aws-orange/10 px-2.5 py-1 font-semibold text-[#8a5200] transition-colors hover:bg-aws-orange/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
                          >
                            Supports: {path.topicLabel}
                            <ArrowRight className="size-3" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="flex items-center justify-between gap-2 text-xs text-ink-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="size-3.5" aria-hidden="true" />
                        {resource.type} · Updated {resource.updatedAt}
                      </span>
                      <ExternalLink
                        className="size-3.5"
                        aria-hidden="true"
                      />
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/resources">
            Browse the full resource library
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
