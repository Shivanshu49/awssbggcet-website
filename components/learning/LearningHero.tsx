import { ArrowRight, Compass, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <section
      aria-labelledby="learning-hero-heading"
      className="relative overflow-hidden rounded-3xl bg-aws-navy text-surface"
    >
      {/* Architectural grid, masked so it fades away from the copy */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_80%_at_75%_25%,black,transparent)]"
      />
      {/* Soft orange glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 size-[26rem] rounded-full bg-aws-orange/10 blur-3xl"
      />

      <div className="relative z-10 grid gap-12 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-14 lg:py-20">
        {/* Left: copy and actions */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-surface/20 bg-surface/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-surface uppercase">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-aws-orange"
            />
            GCET Cloud Learning Hub
          </p>

          <h1
            id="learning-hero-heading"
            className="mt-6 font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]"
          >
            Learn AWS the builder way.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-surface/85 sm:text-lg">
            A structured cloud curriculum for GCET students — start with the
            fundamentals, progress through six guided stages, practice with real
            labs, and prepare for certification. Every stage links straight to
            official AWS documentation, workshops, and training.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="w-full justify-center sm:w-auto"
            >
              <a href="#explore-paths">
                Browse learning paths
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full justify-center border-surface/25 bg-surface/10 text-surface hover:border-surface/40 hover:bg-surface/20 hover:text-surface focus-visible:ring-surface/70 sm:w-auto"
            >
              <a
                href="https://builder.aws.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Explore AWS Builder Center (opens in a new tab)"
              >
                <Compass className="size-4" aria-hidden="true" />
                Explore AWS Builder Center
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>

        {/* Right: curriculum preview. Decorative — the full roadmap renders below. */}
        <div
          aria-hidden="true"
          className="hidden rounded-2xl border border-surface/15 bg-surface/[0.06] p-6 shadow-xl shadow-aws-squid/50 backdrop-blur-sm lg:block"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wider text-surface/70 uppercase">
              Curriculum preview
            </p>
            <span className="rounded-full border border-aws-orange/40 bg-aws-orange/15 px-2.5 py-0.5 text-[11px] font-semibold text-aws-orange">
              {ROADMAP_STAGES.length} stages
            </span>
          </div>

          <ol className="mt-5">
            {ROADMAP_STAGES.map((stage, index) => (
              <li key={stage.stage} className="relative flex gap-4 pb-5 last:pb-0">
                {index < ROADMAP_STAGES.length - 1 && (
                  <span className="absolute top-6 left-[11px] h-full w-px bg-surface/20" />
                )}
                <span className="relative z-10 mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-surface/20 bg-aws-navy text-[11px] font-semibold text-surface/85">
                  {stage.stage}
                </span>
                <span className="text-sm leading-snug text-surface/85">
                  {stage.title}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Stats strip — real counts from the actual content arrays */}
      <dl className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-surface/10 px-6 py-6 sm:grid-cols-4 sm:px-10 lg:px-14">
        {HERO_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse">
            <dt className="mt-0.5 text-xs text-surface/65 sm:text-sm">
              {stat.label}
            </dt>
            <dd className="text-2xl font-semibold text-surface">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
