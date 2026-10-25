import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ROADMAP_STAGES, RoadmapStage } from "./learning-data";

export function LearningRoadmap() {
  return (
    <section
      id="learning-roadmap"
      aria-labelledby="roadmap-heading"
      className="scroll-mt-24 space-y-8"
    >
      <SectionHeading
        id="roadmap-heading"
        eyebrow="Structured Progression"
        title="Recommended Learning Roadmap"
        description="A phased, realistic pathway guiding developers from first cloud concepts to scalable production systems, with hands-on practice at every step."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ROADMAP_STAGES.map((stage: RoadmapStage) => (
          <div
            key={stage.stage}
            className="group relative flex flex-col justify-between rounded-2xl border border-[#4C2A66]/50 bg-[#100B18] p-6 transition-all duration-300 hover:border-amber-300/50 hover:bg-[#171020]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center rounded-full border border-amber-300/40 bg-amber-950/40 px-2.5 py-1 font-mono text-xs font-semibold text-amber-300">
                  Stage {stage.stage}
                </span>
                <span className="font-mono text-xs text-[#9C90AA]">
                  Milestone {stage.stage} of {ROADMAP_STAGES.length}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-white transition-colors group-hover:text-amber-200">
                {stage.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#A89DB5]">
                {stage.description}
              </p>

              <div className="mt-5 border-t border-[#4C2A66]/40 pt-4">
                <p className="font-mono text-[11px] font-semibold tracking-wider text-purple-300/80 uppercase">
                  Key Topics & Practice
                </p>
                <ul
                  className="mt-3 space-y-2 text-sm text-[#F8FAFC]"
                  role="list"
                >
                  {stage.keyTopics.map((topic: string) => (
                    <li key={topic} className="flex items-start gap-2">
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-amber-300"
                        aria-hidden="true"
                      />
                      <span className="text-xs leading-normal text-[#A89DB5] sm:text-sm">
                        {topic}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-[#4C2A66]/40 bg-[#171020] px-3 py-2 text-[11px] leading-relaxed font-medium text-[#A89DB5]">
              Focus: Conceptual understanding & hands-on console/CLI
              verification
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
