import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import {
  getLearningPaths,
  levelBadgeClass,
  type LearningPathEntry,
} from "@/lib/learning";

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

function FeaturedCard({ path }: { path: LearningPathEntry }) {
  const previewModules = path.modules.slice(0, 3);
  const remainingModules = path.modules.length - previewModules.length;

  return (
    <article className="group relative h-full overflow-hidden rounded-3xl border border-[#4C2A66]/60 bg-gradient-to-br from-[#1b1226] to-[#100B18] text-[#F8FAFC] transition-all duration-300 hover:border-amber-300/50">
      {/* Subtle glow, matching the page header */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-amber-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-purple-600/10 blur-3xl"
      />

      <div className="relative flex h-full flex-col p-7 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-amber-300 uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Featured track
          </p>
          <span className="rounded-full border border-purple-500/30 bg-purple-950/40 px-2.5 py-0.5 font-mono text-xs font-semibold text-purple-300">
            {path.topicLabel}
          </span>
        </div>

        <h3 className="mt-4 text-2xl font-bold text-balance text-white">
          {path.title}
        </h3>
        {FEATURED_NOTES[path.id] && (
          <p className="mt-1 text-sm font-semibold text-amber-200">
            {FEATURED_NOTES[path.id]}
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed text-[#A89DB5]">
          {path.description}
        </p>

        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-[#9C90AA]">Duration</dt>
            <dd className="mt-0.5 font-semibold text-[#F8FAFC]">
              {path.duration}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[#9C90AA]">Level</dt>
            <dd className="mt-0.5">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  levelBadgeClass(path.level),
                )}
              >
                {path.level}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[#9C90AA]">Modules</dt>
            <dd className="mt-0.5 font-semibold text-[#F8FAFC]">
              {path.modules.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[#9C90AA]">Recommended for</dt>
            <dd className="mt-0.5 font-semibold text-[#F8FAFC]">
              {path.recommendedFor}
            </dd>
          </div>
        </dl>

        <ul className="mt-6 space-y-2.5 border-t border-[#4C2A66]/40 pt-5">
          {previewModules.map((module) => (
            <li
              key={module}
              className="flex items-start gap-2.5 text-sm text-[#A89DB5]"
            >
              <span className="mt-0.5 inline-flex size-4.5 shrink-0 items-center justify-center rounded-full bg-amber-400/15">
                <Check className="size-3 text-amber-300" aria-hidden="true" />
              </span>
              {module}
            </li>
          ))}
          {remainingModules > 0 && (
            <li className="pl-7 text-xs text-[#9C90AA]">
              + {remainingModules} more module
              {remainingModules === 1 ? "" : "s"} in the full path
            </li>
          )}
        </ul>

        <div className="mt-auto pt-6">
          <Link
            href={`/learning/${path.id}`}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2.5 text-sm font-bold tracking-wide text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all hover:from-amber-300 hover:to-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
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
    allPaths.find((path) => path.id === id),
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
        <div className="rounded-3xl border border-dashed border-[#4C2A66]/60 bg-[#100B18] p-10 text-center">
          <p className="font-bold text-white">
            Spotlight tracks are being curated.
          </p>
          <p className="mt-1 text-sm text-[#A89DB5]">
            Browse every learning path below in the meantime.
          </p>
          <a
            href="#explore-paths"
            className="mt-4 inline-block text-sm font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
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
