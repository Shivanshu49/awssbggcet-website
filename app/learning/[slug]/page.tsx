import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Boxes,
  Check,
  ChevronRight,
  Clock,
  ExternalLink,
  Layers,
  ListChecks,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getLearningPaths,
  getPrerequisitesForPath,
  getRelatedResourcesForPath,
  getRoadmapStageNumbersForPath,
  getSuggestedProjectsForPath,
  levelBadgeClass,
} from "@/lib/learning";
import {
  PROJECT_IDEAS,
  ROADMAP_STAGES,
} from "@/components/learning/learning-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getLearningPaths().map((path) => ({ slug: path.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = getLearningPaths().find((entry) => entry.id === slug);

  if (!path) {
    return { title: "Learning path not found" };
  }

  return {
    title: path.title,
    description: `${path.description} A ${path.duration}, ${path.level.toLowerCase()}-level learning path curated by AWS Builder Center GCET.`,
    openGraph: {
      title: path.title,
      description: path.description,
      type: "article",
    },
  };
}

export default async function LearningPathPage({ params }: PageProps) {
  const { slug } = await params;
  const path = getLearningPaths().find((entry) => entry.id === slug);

  if (!path) {
    notFound();
  }

  const relatedPaths = getLearningPaths().filter(
    (entry) => entry.id !== path.id,
  );
  const relatedResources = getRelatedResourcesForPath(path);
  const suggestedProjects = getSuggestedProjectsForPath(path.id, PROJECT_IDEAS);
  const prerequisites = getPrerequisitesForPath(path.id);
  const roadmapStageNumbers = getRoadmapStageNumbersForPath(path.id);
  const roadmapStages = ROADMAP_STAGES.filter((stage) =>
    roadmapStageNumbers.includes(stage.stage),
  );

  /* Course structured data built only from the real path fields. */
  const durationMatch = path.duration.match(/^(\d+)\s+Weeks?$/i);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: path.title,
    description: path.description,
    educationalLevel: path.level,
    ...(durationMatch ? { timeRequired: `P${durationMatch[1]}W` } : {}),
    provider: {
      "@type": "Organization",
      name: "AWS Builder Center GCET",
      sameAs: "https://builder.aws.com/",
    },
  };

  return (
    <div className="min-h-screen bg-[#08060D] px-4 py-20 text-[#F8FAFC] sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="font-mono text-xs">
          <ol className="flex flex-wrap items-center gap-1.5 text-[#A89DB5]">
            <li>
              <Link
                href="/learning"
                className="inline-flex items-center gap-1.5 font-medium text-[#A89DB5] transition-colors hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Learning
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <span aria-current="page" className="font-semibold text-white">
                {path.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero card */}
        <header className="relative mt-6 overflow-hidden rounded-3xl border border-[#4C2A66]/60 bg-gradient-to-br from-[#1b1226] via-[#130d1d] to-[#0b0811] text-[#F8FAFC]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-purple-600/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-24 -bottom-24 size-64 rounded-full bg-amber-400/10 blur-3xl"
          />

          <div className="relative px-7 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 font-mono text-xs font-semibold text-purple-300">
                {path.topicLabel}
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  levelBadgeClass(path.level),
                )}
              >
                {path.level}
              </span>
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
              {path.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#A89DB5] sm:text-base">
              {path.description}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#4C2A66]/40 pt-6 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-[#9C90AA]">Estimated duration</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-lg font-bold text-white">
                  <Clock className="size-4 text-amber-300" aria-hidden="true" />
                  {path.duration}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#9C90AA]">Skill level</dt>
                <dd className="mt-1 text-lg font-bold text-white">
                  {path.level}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#9C90AA]">Curriculum</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-lg font-bold text-white">
                  <Layers
                    className="size-4 text-amber-300"
                    aria-hidden="true"
                  />
                  {path.modules.length} modules
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#9C90AA]">Recommended for</dt>
                <dd className="mt-1 text-lg font-bold text-white">
                  {path.recommendedFor}
                </dd>
              </div>
            </dl>
          </div>
        </header>

        {/* Main content */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="space-y-6">
            {/* Learning objectives (derived from the real curriculum) */}
            <section
              aria-labelledby="objectives-heading"
              className="rounded-3xl border border-[#4C2A66]/50 bg-[#100B18] p-7 sm:p-8"
            >
              <h2
                id="objectives-heading"
                className="flex items-center gap-2 text-2xl font-bold text-white"
              >
                <Target className="size-5 text-amber-300" aria-hidden="true" />
                Learning objectives
              </h2>
              <p className="mt-2 text-sm text-[#A89DB5]">
                By the end of this path, you will be able to:
              </p>
              <ul className="mt-4 space-y-3">
                {path.modules.map((module) => (
                  <li
                    key={module}
                    className="flex items-start gap-3 text-sm leading-relaxed text-[#F8FAFC]"
                  >
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-400/15">
                      <Check
                        className="size-3 text-amber-300"
                        aria-hidden="true"
                      />
                    </span>
                    {module}
                  </li>
                ))}
              </ul>
            </section>

            {/* Ordered curriculum */}
            <section
              aria-labelledby="curriculum-heading"
              className="rounded-3xl border border-[#4C2A66]/50 bg-[#100B18] p-7 sm:p-8"
            >
              <h2
                id="curriculum-heading"
                className="flex items-center gap-2 text-2xl font-bold text-white"
              >
                <ListChecks
                  className="size-5 text-amber-300"
                  aria-hidden="true"
                />
                Curriculum
              </h2>
              <ol className="mt-6">
                {path.modules.map((module, index) => (
                  <li
                    key={module}
                    className="relative flex gap-4 pb-7 last:pb-0"
                  >
                    {index < path.modules.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute top-8 left-[15px] h-full w-px bg-[#4C2A66]/40"
                      />
                    )}
                    <span className="relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-amber-300/40 bg-[#171020] font-mono text-sm font-semibold text-amber-300">
                      {index + 1}
                    </span>
                    <div className="pt-1">
                      <p className="leading-snug font-medium text-[#F8FAFC]">
                        {module}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Suggested practical projects */}
            <section
              aria-labelledby="exercises-heading"
              className="rounded-3xl border border-[#4C2A66]/50 bg-[#100B18] p-7 sm:p-8"
            >
              <h2
                id="exercises-heading"
                className="flex items-center gap-2 text-2xl font-bold text-white"
              >
                <Boxes className="size-5 text-amber-300" aria-hidden="true" />
                Practice with hands-on projects
              </h2>
              <p className="mt-2 text-sm text-[#A89DB5]">
                Suggested projects from the GCET project lab that reinforce this
                path&apos;s skills.
              </p>

              {suggestedProjects.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-[#4C2A66]/60 bg-[#171020] p-6 text-center">
                  <p className="text-sm font-semibold text-white">
                    No dedicated projects curated for this path yet.
                  </p>
                  <p className="mt-1 text-sm text-[#A89DB5]">
                    Explore the general project lab on the Learning page for
                    practice ideas.
                  </p>
                  <Link
                    href="/learning#hands-on-projects"
                    className="mt-3 inline-block text-sm font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                  >
                    Browse project ideas
                  </Link>
                </div>
              ) : (
                <ul className="mt-5 space-y-4">
                  {suggestedProjects.map((project) => (
                    <li
                      key={project.id}
                      className="rounded-2xl border border-[#4C2A66]/50 bg-[#171020] p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-white">
                          {project.title}
                        </h3>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                            levelBadgeClass(project.difficulty),
                          )}
                        >
                          {project.difficulty}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[#A89DB5]">
                        {project.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <ul
                          className="flex flex-wrap gap-1.5"
                          aria-label="Skills practiced"
                        >
                          {project.skillsLearned.map((skill) => (
                            <li
                              key={skill}
                              className="rounded-full border border-[#4C2A66]/40 bg-[#100B18] px-2 py-0.5 font-mono text-[11px] text-[#A89DB5]"
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                        <a
                          href={project.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-300 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                        >
                          Open guide
                          <ExternalLink
                            className="size-3.5"
                            aria-hidden="true"
                          />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Related learning paths */}
            <section aria-labelledby="related-paths-heading" className="pt-2">
              <h2
                id="related-paths-heading"
                className="text-2xl font-bold text-white"
              >
                Continue learning
              </h2>
              <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {relatedPaths.map((related) => (
                  <li key={related.id}>
                    <Link
                      href={`/learning/${related.id}`}
                      className="group flex h-full flex-col rounded-2xl border border-[#4C2A66]/50 bg-[#100B18] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/50 hover:bg-[#171020] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-purple-500/30 bg-purple-950/40 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-purple-300">
                          {related.topicLabel}
                        </span>
                        <span className="font-mono text-xs text-[#9C90AA]">
                          {related.duration}
                        </span>
                      </div>
                      <h3 className="mt-3 text-base font-bold text-white transition-colors group-hover:text-amber-200">
                        {related.title}
                      </h3>
                      <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-amber-300 transition-colors group-hover:text-amber-200">
                        View path
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Prerequisites */}
            <section
              aria-labelledby="prerequisites-heading"
              className="rounded-3xl border border-[#4C2A66]/50 bg-[#100B18] p-6"
            >
              <h2
                id="prerequisites-heading"
                className="text-lg font-bold text-white"
              >
                Prerequisites
              </h2>
              {prerequisites.length === 0 ? (
                <p className="mt-3 text-sm text-[#A89DB5]">
                  None listed — this path assumes no prior cloud experience.
                </p>
              ) : (
                <ul className="mt-3 space-y-2.5">
                  {prerequisites.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-[#A89DB5]"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-amber-300"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Roadmap alignment */}
            {roadmapStages.length > 0 && (
              <section
                aria-labelledby="roadmap-align-heading"
                className="rounded-3xl border border-[#4C2A66]/50 bg-[#100B18] p-6"
              >
                <h2
                  id="roadmap-align-heading"
                  className="text-lg font-bold text-white"
                >
                  Maps to roadmap stages
                </h2>
                <ol className="mt-3 space-y-2.5">
                  {roadmapStages.map((stage) => (
                    <li
                      key={stage.stage}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-amber-300/40 bg-[#171020] font-mono text-xs font-semibold text-amber-300">
                        {stage.stage}
                      </span>
                      <span className="pt-0.5 font-medium text-[#F8FAFC]">
                        {stage.title}
                      </span>
                    </li>
                  ))}
                </ol>
                <Link
                  href="/learning#learning-roadmap"
                  className="mt-4 inline-block text-sm font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                >
                  See the full roadmap
                </Link>
              </section>
            )}

            {/* Supporting resources from the Resources dataset */}
            <section
              aria-labelledby="resources-heading"
              className="rounded-3xl border border-[#4C2A66]/50 bg-[#100B18] p-6"
            >
              <h2
                id="resources-heading"
                className="flex items-center gap-2 text-lg font-bold text-white"
              >
                <BookOpen
                  className="size-4 text-amber-300"
                  aria-hidden="true"
                />
                Supporting resources
              </h2>
              {relatedResources.length === 0 ? (
                <p className="mt-3 text-sm text-[#A89DB5]">
                  No linked resources yet — browse the full resource library.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {relatedResources.map((resource) => (
                    <li key={resource.id}>
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-xl border border-[#4C2A66]/50 bg-[#171020] p-4 transition-colors hover:border-amber-300/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm leading-snug font-semibold text-white transition-colors group-hover:text-amber-200">
                            {resource.title}
                          </h3>
                          <ExternalLink
                            className="mt-0.5 size-3.5 shrink-0 text-[#A89DB5]"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="mt-1.5 font-mono text-[11px] text-[#9C90AA]">
                          {resource.type} · Updated {resource.updatedAt}
                        </p>
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/resources"
                className="mt-4 inline-block text-sm font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                Browse all resources
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
