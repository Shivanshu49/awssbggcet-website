import { Clock, ExternalLink, Hammer } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { levelBadgeClass } from "@/lib/learning";
import { HANDS_ON_WORKSHOPS } from "./learning-data";

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
        <div className="rounded-3xl border border-dashed border-[#4C2A66]/60 bg-[#100B18] p-10 text-center">
          <p className="font-bold text-white">Workshops are being curated.</p>
          <p className="mt-1 text-sm text-[#A89DB5]">
            Check the official AWS Workshops catalog in the meantime.
          </p>
          <a
            href="https://workshops.aws/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
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
                  className="group flex h-full items-start gap-4 rounded-2xl border border-[#4C2A66]/50 bg-[#100B18] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/50 hover:bg-[#171020] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 sm:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/30 bg-[#171020] text-purple-300"
                  >
                    <Hammer className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-purple-500/30 bg-purple-950/40 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-purple-300">
                        {workshop.topic}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                          levelBadgeClass(workshop.level),
                        )}
                      >
                        {workshop.level}
                      </span>
                      {workshop.duration && (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#9C90AA]">
                          <Clock className="size-3" aria-hidden="true" />
                          {workshop.duration}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-base font-bold text-white transition-colors group-hover:text-amber-200">
                      {workshop.title}
                      <ExternalLink
                        className="ml-1.5 inline size-3.5 -translate-y-0.5 text-[#A89DB5] transition-colors group-hover:text-amber-300"
                        aria-hidden="true"
                      />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#A89DB5]">
                      {workshop.description}
                    </p>
                    <p className="mt-3 font-mono text-[11px] font-semibold tracking-wider text-[#9C90AA] uppercase">
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
