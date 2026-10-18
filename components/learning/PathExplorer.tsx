"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Clock, Layers, Search, SearchX } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  PATH_TOPICS,
  getLearningPaths,
  getTopicCounts,
  levelBadgeClass,
  type LearningPathEntry,
  type PathTopicId,
} from "@/lib/learning";

type TopicFilter = "all" | PathTopicId;

/** Levels are derived from the real path data, never hand-maintained. */
function getLevelOptions(paths: LearningPathEntry[]): string[] {
  const seen: string[] = [];
  for (const path of paths) {
    if (!seen.includes(path.level)) seen.push(path.level);
  }
  return seen;
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy",
        active
          ? "border-aws-navy bg-aws-navy text-surface"
          : "border-border bg-surface text-ink hover:border-aws-orange"
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          "rounded-full px-1.5 text-xs font-semibold tabular-nums",
          active ? "bg-surface/15 text-surface/90" : "bg-surface-alt text-ink-muted"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function PathCard({ path, index }: { path: LearningPathEntry; index: number }) {
  return (
    <li className="h-full">
      <Reveal delay={Math.min(index * 0.05, 0.2)} className="h-full">
        <article className="group/card relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-aws-navy hover:shadow-md sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="muted">{path.topicLabel}</Badge>
            <Badge className={cn(levelBadgeClass(path.level), "font-semibold")}>
              {path.level}
            </Badge>
          </div>

          <h3 className="mt-4 font-heading text-xl font-semibold text-balance text-ink">
            <Link
              href={`/learning/${path.id}`}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy after:absolute after:inset-0 after:content-['']"
            >
              {path.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {path.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {path.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers className="size-3.5" aria-hidden="true" />
              {path.modules.length} modules
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            <p className="text-xs text-ink-muted">
              Recommended for{" "}
              <span className="font-semibold text-ink">{path.recommendedFor}</span>
            </p>
            <span className="relative z-10 inline-flex items-center gap-1 text-sm font-semibold text-aws-navy transition-colors group-hover/card:text-aws-orange">
              View path
              <ArrowRight
                className="size-4 transition-transform group-hover/card:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </article>
      </Reveal>
    </li>
  );
}

export function PathExplorer() {
  const paths = useMemo(() => getLearningPaths(), []);
  const topicCounts = useMemo(() => getTopicCounts(paths), [paths]);
  const levelOptions = useMemo(() => getLevelOptions(paths), [paths]);

  const [activeTopic, setActiveTopic] = useState<TopicFilter>("all");
  const [activeLevel, setActiveLevel] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filteredPaths = useMemo(() => {
    const q = query.trim().toLowerCase();
    return paths.filter((path) => {
      if (activeTopic !== "all" && path.topic !== activeTopic) return false;
      if (activeLevel !== "all" && path.level !== activeLevel) return false;
      if (q) {
        const haystack = [
          path.title,
          path.description,
          path.recommendedFor,
          path.topicLabel,
          ...path.modules,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [paths, activeTopic, activeLevel, query]);

  const hasActiveFilters =
    activeTopic !== "all" || activeLevel !== "all" || query.trim() !== "";

  const activeTopicLabel =
    activeTopic === "all"
      ? "all topics"
      : PATH_TOPICS.find((topic) => topic.id === activeTopic)?.label ?? "this topic";

  function resetFilters() {
    setActiveTopic("all");
    setActiveLevel("all");
    setQuery("");
  }

  return (
    <section
      id="explore-paths"
      aria-labelledby="explore-paths-heading"
      className="scroll-mt-24 space-y-8"
    >
      <SectionHeading
        id="explore-paths-heading"
        eyebrow="Browse by topic"
        title="Explore learning paths"
        description="Filter the GCET-curated curriculum by topic, skill level, or keyword. Every path is built on official AWS documentation, workshops, and labs."
      />

      {/* Search + level filter */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="relative w-full lg:max-w-md">
          <label htmlFor="path-search" className="sr-only">
            Search learning paths
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            id="path-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search paths, e.g. serverless, Terraform, Bedrock…"
            className="w-full rounded-full border border-border bg-surface py-2.5 pr-4 pl-11 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="level-filter" className="mr-1 text-sm text-ink-muted">
            Skill level
          </label>
          <select
            id="level-filter"
            value={activeLevel}
            onChange={(event) => setActiveLevel(event.target.value)}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
          >
            <option value="all">All levels</option>
            {levelOptions.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Topic chips — counts come from the real path data */}
      <div
        role="group"
        aria-label="Filter learning paths by topic"
        className="flex flex-wrap items-center gap-2"
      >
        <FilterChip
          label="All Topics"
          count={paths.length}
          active={activeTopic === "all"}
          onClick={() => setActiveTopic("all")}
        />
        {PATH_TOPICS.map((topic) => (
          <FilterChip
            key={topic.id}
            label={topic.label}
            count={topicCounts.get(topic.id) ?? 0}
            active={activeTopic === topic.id}
            onClick={() => setActiveTopic(topic.id)}
          />
        ))}
      </div>

      {/* Result count — announced to screen readers when filters change */}
      <p role="status" aria-live="polite" className="-mt-4 text-sm text-ink-muted">
        Showing {filteredPaths.length} of {paths.length} learning paths
        {activeTopic !== "all" ? ` for ${activeTopicLabel}` : ""}
        {activeLevel !== "all" ? ` at ${activeLevel} level` : ""}.
      </p>

      {filteredPaths.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <SearchX
            className="mx-auto size-8 text-ink-muted"
            aria-hidden="true"
          />
          <p className="mt-3 font-semibold text-ink">
            No learning paths match your filters
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Try a different keyword, topic, or skill level.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 text-sm font-semibold text-aws-navy underline underline-offset-4 hover:text-aws-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredPaths.map((path, index) => (
              <PathCard key={path.id} path={path} index={index} />
            ))}
          </ul>

          {hasActiveFilters && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-semibold text-aws-navy underline underline-offset-4 hover:text-aws-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aws-navy"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
