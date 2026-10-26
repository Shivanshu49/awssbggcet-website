import { ArrowRight, ExternalLink, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { getPathsForProject, levelBadgeClass } from "@/lib/learning";
import { PROJECT_IDEAS } from "./learning-data";

/**
 * Suggested projects — curated practice builds from official AWS guides.
 * These are recommendations only; no student results or completion tracking
 * are implied.
 */
export function ProjectIdeas() {
  return (
    <section
      id="hands-on-projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-24 space-y-8"
    >
      <SectionHeading
        id="projects-heading"
        eyebrow="Project-based learning"
        title="Suggested projects"
        description="Practice builds curated from official AWS documentation. Each project names the skills you will exercise and links straight to its step-by-step guide."
      />

      {PROJECT_IDEAS.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#4C2A66]/60 bg-[#100B18] p-10 text-center">
          <p className="font-bold text-white">
            Project ideas are being curated.
          </p>
          <p className="mt-1 text-sm text-[#A89DB5]">
            The hands-on workshops above are a great way to practice in the
            meantime.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECT_IDEAS.map((project, index) => {
            const relatedPaths = getPathsForProject(project.id);

            return (
              <li key={project.id} className="h-full">
                <Reveal delay={Math.min(index * 0.05, 0.2)} className="h-full">
                  <article className="group/card relative flex h-full flex-col rounded-2xl border border-[#4C2A66]/50 bg-[#100B18] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/50 hover:bg-[#171020]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                          levelBadgeClass(project.difficulty),
                        )}
                      >
                        {project.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wider text-[#9C90AA] uppercase">
                        <Lightbulb
                          className="size-3.5 text-amber-300"
                          aria-hidden="true"
                        />
                        Suggested project
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-balance text-white transition-colors group-hover/card:text-amber-200">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#A89DB5]">
                      {project.description}
                    </p>

                    <div className="mt-4">
                      <p className="font-mono text-[11px] font-semibold tracking-wider text-purple-300/80 uppercase">
                        Skills practiced
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {project.skillsLearned.map((skill) => (
                          <li
                            key={skill}
                            className="rounded-md border border-[#4C2A66]/40 bg-[#171020] px-2 py-0.5 font-mono text-[11px] font-medium text-[#A89DB5]"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {relatedPaths.length > 0 && (
                      <ul
                        className="mt-4 flex flex-wrap gap-1.5"
                        aria-label="Learning paths this project supports"
                      >
                        {relatedPaths.map((path) => (
                          <li key={path.id}>
                            <Link
                              href={`/learning/${path.id}`}
                              className="relative z-10 inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-950/30 px-2.5 py-1 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-900/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                            >
                              Builds on: {path.topicLabel}
                              <ArrowRight
                                className="size-3"
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto border-t border-[#4C2A66]/40 pt-4">
                      <a
                        href={project.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-300 transition-colors hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                      >
                        Follow the official guide
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
