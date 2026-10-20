import { ArrowRight, Compass, ExternalLink } from "lucide-react";
import {
  LEARNING_CATEGORIES,
  OFFICIAL_RESOURCES,
  PROJECT_IDEAS,
  ROADMAP_STAGES,
} from "./learning-data";

/* Counts are derived from the real content arrays so the strip can never drift. */
const HERO_STATS = [
  { value: LEARNING_CATEGORIES.length, label: "Core cloud domains" },
  { value: ROADMAP_STAGES.length, label: "Roadmap stages" },
  { value: OFFICIAL_RESOURCES.length, label: "Official AWS platforms" },
  { value: PROJECT_IDEAS.length, label: "Hands-on project labs" },
] as const;

export function LearningHero() {
  return (
    <section aria-labelledby="learning-hero-heading" className="space-y-8">
      {/* Centered page header, matching About and Events */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-amber-300/40 bg-[#171020] px-3.5 py-1.5 shadow-[0_0_12px_rgba(253,230,138,0.15)]">
          <span className="h-2 w-2 rounded-full bg-amber-300" />
          <span className="font-mono text-xs text-amber-200">
            GCET CLOUD LEARNING HUB
          </span>
        </div>

        <h1
          id="learning-hero-heading"
          className="text-3xl font-black tracking-tight text-balance text-white sm:text-4xl md:text-5xl"
        >
          Learn AWS the builder way.
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-[#A89DB5] sm:text-sm">
          A structured cloud curriculum for GCET students — start with the
          fundamentals, progress through six guided stages, practice with real
          labs, and prepare for certification. Every stage links straight to
          official AWS documentation, workshops, and training.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="#explore-paths"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-bold tracking-wide text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.25)] transition-all hover:from-amber-300 hover:to-amber-400"
          >
            Browse learning paths
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>

          <a
            href="https://builder.aws.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Explore AWS Builder Center (opens in a new tab)"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#4C2A66]/60 bg-[#171020] px-6 py-3 text-sm font-semibold text-[#F8FAFC] transition-all hover:border-amber-300/50 hover:bg-[#1d1428]"
          >
            <Compass className="h-4 w-4 text-purple-300" />
            Explore AWS Builder Center
            <ExternalLink className="h-3.5 w-3.5 text-[#A89DB5]" />
          </a>
        </div>
      </div>

      {/* Stats strip — real counts from the actual content arrays */}
      <dl className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
        {HERO_STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col-reverse rounded-2xl border border-[#4C2A66]/50 bg-[#100B18] p-5 text-center"
          >
            <dt className="mt-1 text-[11px] leading-relaxed text-[#A89DB5] sm:text-xs">
              {stat.label}
            </dt>
            <dd className="text-2xl font-black text-amber-300">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
