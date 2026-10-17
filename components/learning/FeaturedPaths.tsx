import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { getLearningPaths, type LearningPathEntry } from "@/lib/learning";

/**
 * Editorial spotlight picks, chosen from the real learning paths in
 * content/resources.json: the beginner entry point and the generative-AI
 * track. Missing IDs are dropped gracefully rather than inventing content.
 */
const FEATURED_PATH_IDS = ["path-fundamentals", "path-genai"] as const;

const FEATURED_NOTES: Record<string, string> = {
  "path-fundamentals": "New to the cloud? Start here.",
  "path-genai": "Build production AI systems on Bedrock.",
};

/** Level badge colors for the dark navy spotlight cards. */
function darkLevelClass(level: string): string {
  switch (level) {
    case "Beginner":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "Intermediate":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    case "Intermediate to Advanced":
      return "border-orange-400/30 bg-orange-400/10 text-orange-300";
    case "Advanced":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
    default:
      return "border-surface/25 bg-surface/10 text-surface/85";
  }
}

function FeaturedCard({ path }: { path: LearningPathEntry }) {
  const previewModules = path.modules.slice(0, 3);
  const remainingModules = path.modules.length - previewModules.length;

  return (
    <article className="relative h-full overflow-hidden rounded-2xl bg-aws-navy text-surface">
      {/* Subtle grid motif + glow, matching the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(ellipse_60%_60%_at_90%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-aws-orange/10 blur-3xl"
      />

      <div className="relative flex h-full flex-col p-7 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-aws-orange uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Featured track
          </p>
          <span className="rounded-full border border-surface/20 bg-surface/10 px-2.5 py-0.5 text-xs font-semibold text-surface/90">
            {path.topicLabel}
          </span>
        </div>

        <h3 className="mt-4 font-heading text-2xl font-bold text-balance">
          {path.title}
        </h3>
        {FEATURED_NOTES[path.id] && (
          <p className="mt-1 text-sm font-semibold text-aws-orange">
            {FEATURED_NOTES[path.id]}
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed text-surface/85">
          {path.description}
        </p>

        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-surface/60">Duration</dt>
            <dd className="mt-0.5 font-semibold">{path.duration}</dd>
          </div>
          <div>
            <dt className="text-xs text-surface/60">Level</dt>
            <dd className="mt-0.5">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  darkLevelClass(path.level)
                )}
              >
                {path.level}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-surface/60">Modules</dt>
            <dd className="mt-0.5 font-semibold">{path.modules.length}</dd>
          </div>
          <div>
            <dt className="text-xs text-surface/60">Recommended for</dt>
            <dd className="mt-0.5 font-semibold">{path.recommendedFor}</dd>
          </div>
        </dl>

        <ul className="mt-6 space-y-2.5 border-t border-surface/10 pt-5">
          {previewModules.map((module) => (
            <li key={module} className="flex items-start gap-2.5 text-sm text-surface/85">
              <span className="mt-0.5 inline-flex size-4.5 shrink-0 items-center justify-center rounded-full bg-aws-orange/20">
                <Check className="size-3 text-aws-orange" aria-hidden="true" />
              </span>
              {module}
            </li>
          ))}
          {remainingModules > 0 && (
            <li className="pl-7 text-xs text-surface/60">
              + {remainingModules} more module
              {remainingModules === 1 ? "" : "s"} in the full path
            </li>
          )}
        </ul>

        <div className="mt-auto pt-6">
          <Link
            href={`/learning/${path.id}`}
            className="group inline-flex items-center gap-2 rounded-full bg-aws-orange px-5 py-2.5 text-sm font-semibold text-aws-squid transition-colors hover:bg-[#e88d00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface"
          >
            View learning path
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function FeaturedPaths() {
  const allPaths = getLearningPaths();
  const featuredPaths = FEATURED_PATH_IDS.map((id) =>
    allPaths.find((path) => path.id === id)
  ).filter((path): path is LearningPathEntry => Boolean(path));

  return (
    <section
      aria-labelledby="featured-paths-heading"
      className="scroll-mt-24 space-y-8"
    >
      <SectionHeading
        id="featured-paths-heading"
        eyebrow="Featured"
        title="Spotlight tracks"
        description="Two curated starting points from the GCET curriculum — one for first-time cloud learners, one for teams building with generative AI."
      />

      {featuredPaths.length === 0 ? (
        /* Graceful fallback: never invent official courses that don't exist */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="font-semibold text-ink">Spotlight tracks are being curated.</p>
          <p className="mt-1 text-sm text-ink-muted">
            Browse every learning path below in the meantime.
          </p>
          <a
            href="#explore-paths"
            className="mt-4 inline-block text-sm font-semibold text-aws-navy underline underline-offset-4 hover:text-aws-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
          >
            Explore learning paths
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {featuredPaths.map((path, index) => (
            <Reveal key={path.id} delay={index * 0.08} className="h-full">
              <FeaturedCard path={path} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
