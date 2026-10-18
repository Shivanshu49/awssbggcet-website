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
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";
import {
  getLearningPaths,
  getPrerequisitesForPath,
  getRelatedResourcesForPath,
  getRoadmapStageNumbersForPath,
  getSuggestedProjectsForPath,
  levelBadgeClass,
} from "@/lib/learning";
import { PROJECT_IDEAS, ROADMAP_STAGES } from "@/components/learning/learning-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getLearningPaths().map((path) => ({ slug: path.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

  const relatedPaths = getLearningPaths().filter((entry) => entry.id !== path.id);
  const relatedResources = getRelatedResourcesForPath(path);
  const suggestedProjects = getSuggestedProjectsForPath(path.id, PROJECT_IDEAS);
  const prerequisites = getPrerequisitesForPath(path.id);
  const roadmapStageNumbers = getRoadmapStageNumbersForPath(path.id);
  const roadmapStages = ROADMAP_STAGES.filter((stage) =>
    roadmapStageNumbers.includes(stage.stage)
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
    <div className="bg-surface-alt py-10 sm:py-14 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm">
          <ol className="flex flex-wrap items-center gap-1.5 text-ink-muted">
            <li>
              <Link
                href="/learning"
                className="inline-flex items-center gap-1.5 font-medium text-ink-muted hover:text-aws-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Learning
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <span aria-current="page" className="font-semibold text-ink">
                {path.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero card */}
        <header className="relative mt-6 overflow-hidden rounded-3xl bg-aws-navy text-surface">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_70%_80%_at_80%_20%,black,transparent)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-aws-orange/10 blur-3xl"
          />

          <div className="relative px-7 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-surface/20 bg-surface/10 px-3 py-1 text-xs font-semibold text-surface/90">
                {path.topicLabel}
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  darkLevelClass(path.level)
                )}
              >
                {path.level}
              </span>
            </div>

            <h1 className="mt-5 max-w-3xl font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {path.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-surface/85 sm:text-lg">
              {path.description}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-surface/10 pt-6 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-surface/60">Estimated duration</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-lg font-semibold">
                  <Clock className="size-4 text-aws-orange" aria-hidden="true" />
                  {path.duration}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-surface/60">Skill level</dt>
                <dd className="mt-1 text-lg font-semibold">{path.level}</dd>
              </div>
              <div>
                <dt className="text-xs text-surface/60">Curriculum</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-lg font-semibold">
                  <Layers className="size-4 text-aws-orange" aria-hidden="true" />
                  {path.modules.length} modules
                </dd>
              </div>
              <div>
                <dt className="text-xs text-surface/60">Recommended for</dt>
                <dd className="mt-1 text-lg font-semibold">{path.recommendedFor}</dd>
              </div>
            </dl>
          </div>
        </header>

        {/* Main content */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="space-y-10">
            {/* Learning objectives (derived from the real curriculum) */}
            <section aria-labelledby="objectives-heading" className="rounded-2xl border border-border bg-surface p-7 sm:p-8">
              <h2
                id="objectives-heading"
                className="flex items-center gap-2 font-heading text-2xl font-semibold text-ink"
              >
                <Target className="size-5 text-aws-orange" aria-hidden="true" />
                Learning objectives
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                By the end of this path, you will be able to:
              </p>
              <ul className="mt-4 space-y-3">
                {path.modules.map((module) => (
                  <li key={module} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-aws-orange/15">
                      <Check className="size-3 text-[#b36b00]" aria-hidden="true" />
                    </span>
                    {module}
                  </li>
                ))}
              </ul>
            </section>

            {/* Ordered curriculum */}
            <section aria-labelledby="curriculum-heading" className="rounded-2xl border border-border bg-surface p-7 sm:p-8">
              <h2
                id="curriculum-heading"
                className="flex items-center gap-2 font-heading text-2xl font-semibold text-ink"
              >
                <ListChecks className="size-5 text-aws-orange" aria-hidden="true" />
                Curriculum
              </h2>
              <ol className="mt-6">
                {path.modules.map((module, index) => (
                  <li key={module} className="relative flex gap-4 pb-7 last:pb-0">
                    {index < path.modules.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute top-8 left-[15px] h-full w-px bg-border"
                      />
                    )}
                    <span className="relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-alt text-sm font-semibold text-aws-navy">
                      {index + 1}
                    </span>
                    <div className="pt-1">
                      <p className="font-medium leading-snug text-ink">{module}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Suggested practical projects */}
            <section aria-labelledby="exercises-heading" className="rounded-2xl border border-border bg-surface p-7 sm:p-8">
              <h2
                id="exercises-heading"
                className="flex items-center gap-2 font-heading text-2xl font-semibold text-ink"
              >
                <Boxes className="size-5 text-aws-orange" aria-hidden="true" />
                Practice with hands-on projects
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                Suggested projects from the GCET project lab that reinforce this
                path&apos;s skills.
              </p>

              {suggestedProjects.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-border bg-surface-alt p-6 text-center">
                  <p className="text-sm font-medium text-ink">
                    No dedicated projects curated for this path yet.
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    Explore the general project lab on the Learning page for
                    practice ideas.
                  </p>
                  <Link
                    href="/learning#hands-on-projects"
                    className="mt-3 inline-block text-sm font-semibold text-aws-navy underline underline-offset-4 hover:text-aws-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
                  >
                    Browse project ideas
                  </Link>
                </div>
              ) : (
                <ul className="mt-5 space-y-4">
                  {suggestedProjects.map((project) => (
                    <li
                      key={project.id}
                      className="rounded-xl border border-border bg-surface-alt p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-ink">{project.title}</h3>
                        <Badge
                          variant="outline"
                          className={cn(levelBadgeClass(project.difficulty), "font-semibold")}
                        >
                          {project.difficulty}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {project.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <ul className="flex flex-wrap gap-1.5" aria-label="Skills practiced">
                          {project.skillsLearned.map((skill) => (
                            <li
                              key={skill}
                              className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-ink-muted"
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                        <a
                          href={project.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-aws-navy hover:text-aws-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
                        >
                          Open guide
                          <ExternalLink className="size-3.5" aria-hidden="true" />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Related learning paths */}
            <section aria-labelledby="related-paths-heading">
              <h2
                id="related-paths-heading"
                className="font-heading text-2xl font-semibold text-ink"
              >
                Continue learning
              </h2>
              <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {relatedPaths.map((related) => (
                  <li key={related.id}>
                    <Link
                      href={`/learning/${related.id}`}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-aws-navy hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="muted">{related.topicLabel}</Badge>
                        <span className="text-xs text-ink-muted">{related.duration}</span>
                      </div>
                      <h3 className="mt-3 font-heading text-base font-semibold text-ink">
                        {related.title}
                      </h3>
                      <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-aws-navy transition-colors group-hover:text-aws-orange">
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
            <section aria-labelledby="prerequisites-heading" className="rounded-2xl border border-border bg-surface p-6">
              <h2
                id="prerequisites-heading"
                className="font-heading text-lg font-semibold text-ink"
              >
                Prerequisites
              </h2>
              {prerequisites.length === 0 ? (
                <p className="mt-3 text-sm text-ink-muted">
                  None listed — this path assumes no prior cloud experience.
                </p>
              ) : (
                <ul className="mt-3 space-y-2.5">
                  {prerequisites.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-muted"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-aws-orange"
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
              <section aria-labelledby="roadmap-align-heading" className="rounded-2xl border border-border bg-surface p-6">
                <h2
                  id="roadmap-align-heading"
                  className="font-heading text-lg font-semibold text-ink"
                >
                  Maps to roadmap stages
                </h2>
                <ol className="mt-3 space-y-2.5">
                  {roadmapStages.map((stage) => (
                    <li key={stage.stage} className="flex items-start gap-3 text-sm">
                      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-alt text-xs font-semibold text-aws-navy ring-1 ring-border">
                        {stage.stage}
                      </span>
                      <span className="pt-0.5 font-medium text-ink">{stage.title}</span>
                    </li>
                  ))}
                </ol>
                <Link
                  href="/learning#learning-roadmap"
                  className="mt-4 inline-block text-sm font-semibold text-aws-navy underline underline-offset-4 hover:text-aws-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
                >
                  See the full roadmap
                </Link>
              </section>
            )}

            {/* Supporting resources from the Resources dataset */}
            <section aria-labelledby="resources-heading" className="rounded-2xl border border-border bg-surface p-6">
              <h2
                id="resources-heading"
                className="flex items-center gap-2 font-heading text-lg font-semibold text-ink"
              >
                <BookOpen className="size-4 text-aws-orange" aria-hidden="true" />
                Supporting resources
              </h2>
              {relatedResources.length === 0 ? (
                <p className="mt-3 text-sm text-ink-muted">
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
                        className="group block rounded-xl border border-border bg-surface-alt p-4 transition-colors hover:border-aws-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold leading-snug text-ink group-hover:text-aws-navy">
                            {resource.title}
                          </h3>
                          <ExternalLink
                            className="mt-0.5 size-3.5 shrink-0 text-ink-muted"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-ink-muted">
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
                className="mt-4 inline-block text-sm font-semibold text-aws-navy underline underline-offset-4 hover:text-aws-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
              >
                Browse all resources
              </Link>
            </section>
          </aside>
        </div>
      </Container>
    </div>
  );
}

/* Level badge colors for the dark hero card (light variants fail on navy). */
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
