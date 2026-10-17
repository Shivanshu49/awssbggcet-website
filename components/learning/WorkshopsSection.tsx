import { Clock, ExternalLink, Hammer } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HANDS_ON_WORKSHOPS } from "./learning-data";

function levelClass(level: string): string {
  switch (level) {
    case "Beginner":
      return "border-emerald-600/40 bg-emerald-50 text-emerald-700";
    case "Intermediate":
      return "border-amber-600/40 bg-amber-50 text-amber-700";
    case "Intermediate to Advanced":
      return "border-orange-600/40 bg-orange-50 text-orange-700";
    case "Advanced":
      return "border-rose-600/40 bg-rose-50 text-rose-700";
    default:
      return "border-border bg-surface-alt text-ink-muted";
  }
}

export function WorkshopsSection() {
  return (
    <section
      id="hands-on-workshops"
      aria-labelledby="workshops-heading"
      className="scroll-mt-24 space-y-8"
    >
      <SectionHeading
        id="workshops-heading"
        eyebrow="Hands-on practice"
        title="Workshops & guided tutorials"
        description="Official AWS workshops and step-by-step tutorials you can run end-to-end. Every link goes straight to the source on AWS infrastructure."
      />

      {HANDS_ON_WORKSHOPS.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="font-semibold text-ink">Workshops are being curated.</p>
          <p className="mt-1 text-sm text-ink-muted">
            Check the official AWS Workshops catalog in the meantime.
          </p>
          <a
            href="https://workshops.aws/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-aws-navy underline underline-offset-4 hover:text-aws-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
          >
            Open AWS Workshops
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {HANDS_ON_WORKSHOPS.map((workshop, index) => (
            <li key={workshop.id} className="h-full">
              <Reveal delay={Math.min(index * 0.05, 0.2)} className="h-full">
                <a
                  href={workshop.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-aws-navy hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy sm:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-alt text-aws-navy ring-1 ring-border"
                  >
                    <Hammer className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="muted">{workshop.topic}</Badge>
                      <Badge
                        variant="outline"
                        className={cn(levelClass(workshop.level), "font-semibold")}
                      >
                        {workshop.level}
                      </Badge>
                      {workshop.duration && (
                        <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                          <Clock className="size-3" aria-hidden="true" />
                          {workshop.duration}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-heading text-base font-semibold text-ink">
                      {workshop.title}
                      <ExternalLink
                        className="ml-1.5 inline size-3.5 -translate-y-0.5 text-ink-muted transition-colors group-hover:text-aws-orange"
                        aria-hidden="true"
                      />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                      {workshop.description}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-ink-muted uppercase">
                      Source: {workshop.source}
                    </p>
                  </div>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
