import { CheckCircle2 } from "lucide-react";
import { ROADMAP_STAGES, RoadmapStage } from "./learning-data";

export function LearningRoadmap() {
  return (
    <section
      id="learning-roadmap"
      aria-labelledby="roadmap-heading"
      className="scroll-mt-24 space-y-8"
    >
      <div className="max-w-2xl">
        <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-ink-muted uppercase">
          <span
            aria-hidden="true"
            className="h-1 w-6 rounded-full bg-aws-orange"
          />
          Structured Progression
        </p>
        <h2
          id="roadmap-heading"
          className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Recommended Learning Roadmap
        </h2>
        <p className="mt-3 text-base text-ink-muted sm:text-lg">
          A phased, realistic pathway guiding developers from first cloud
          concepts to scalable production systems, with hands-on practice at
          every step.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ROADMAP_STAGES.map((stage: RoadmapStage) => (
          <div
            key={stage.stage}
            className="relative flex flex-col justify-between rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-200 hover:border-aws-navy hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center rounded-md bg-aws-navy px-2.5 py-1 text-xs font-semibold text-surface">
                  Stage {stage.stage}
                </span>
                <span className="text-xs font-medium text-ink-muted">
                  Milestone {stage.stage} of {ROADMAP_STAGES.length}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-semibold text-ink">
                {stage.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {stage.description}
              </p>

              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs font-semibold tracking-wider text-ink-muted uppercase">
                  Key Topics & Practice
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink" role="list">
                  {stage.keyTopics.map((topic: string) => (
                    <li key={topic} className="flex items-start gap-2">
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-aws-navy"
                        aria-hidden="true"
                      />
                      <span className="text-xs leading-normal sm:text-sm">
                        {topic}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-surface-alt px-3 py-2 text-xs font-medium text-ink-muted">
              Focus: Conceptual understanding & hands-on console/CLI
              verification
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
