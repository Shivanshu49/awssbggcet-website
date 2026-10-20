"use client";

import React, { useState } from "react";
<<<<<<< HEAD
import {
  ResourceItem,
  ResourceCard,
} from "@/components/resources/resource-card";
import {
  LearningPath,
  LearningPaths,
} from "@/components/resources/learning-paths";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Search } from "lucide-react";
=======
import { ResourceItem, ResourceCard } from "@/components/resources/resource-card";
import { LearningPaths, type LearningPath } from "@/components/resources/learning-paths";
import { Reveal } from "@/components/ui/reveal";
import { Search, BookMarked, Compass } from "lucide-react";
>>>>>>> origin/main

interface ResourcesViewProps {
  learningPaths: LearningPath[];
  resources: ResourceItem[];
}

export function ResourcesView({
  learningPaths,
  resources,
}: ResourcesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  const categories = [
    "All",
    "AWS Fundamentals",
    "Projects",
    "DevOps",
    "AI/ML",
    "Interview Preparation",
    "Problem Solving",
  ];

  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredResources = resources.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "All" ||
      item.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase());
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesDifficulty && matchesQuery;
  });

  return (
    <div className="space-y-20">
      {/* Section 1: Structured Learning Roadmaps */}
      <section id="learning-paths" className="space-y-8">
        <SectionHeading
          eyebrow="The Builder Pathway"
          title="Structured Learning Roadmaps"
          description="Follow our proven curriculum tracks to progress from foundational cloud basics to architecting production-grade serverless and generative AI systems."
        />
        <LearningPaths paths={learningPaths} />
      </section>

      {/* Section 2: Searchable Resource Library */}
      <section
        id="library"
        className="space-y-8 border-t border-[#4C2A66]/40 pt-14"
      >
        <SectionHeading
          eyebrow="Resource Library"
          title="Developer Guides & Repository Starters"
          description="Search the curated library by keyword, topic, or skill level. Every entry links straight to official AWS documentation or a hands-on guide."
        />

        {/* Filter Controls & Search */}
        <div className="space-y-4 rounded-3xl border border-[#4C2A66]/50 bg-[#100B18] p-5 shadow-[0_0_24px_rgba(76,42,102,0.12)] sm:p-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute top-3 left-3.5 h-4 w-4 text-[#9C90AA]" />
            <input
              type="text"
              aria-label="Search resources by keyword or tag"
              placeholder="Search by keyword, tag (e.g. Bedrock, IAM, Docker, Next.js)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#4C2A66]/60 bg-[#08060D] py-2 pr-4 pl-10 text-sm text-white placeholder-[#9C90AA] focus:border-amber-300/60 focus:ring-1 focus:ring-amber-300/30 focus:outline-none"
            />
          </div>

          {/* Category Pills & Difficulty selector */}
          <div className="flex flex-col justify-between gap-3 pt-2 sm:flex-row sm:items-center">
            {/* Category horizontal scroll list */}
            <div
              role="group"
              aria-label="Filter resources by category"
              className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "border-amber-300/40 bg-gradient-to-r from-purple-900/60 to-purple-800/40 font-semibold text-amber-300 shadow-[0_0_12px_rgba(253,230,138,0.15)]"
                      : "border-[#4C2A66]/50 bg-[#08060D] text-[#A89DB5] hover:border-amber-300/40 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty Selector */}
            <div className="flex shrink-0 items-center gap-2">
              <span className="font-mono text-xs text-[#A89DB5]">Level:</span>
              <select
                aria-label="Filter resources by difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="rounded-lg border border-[#4C2A66]/60 bg-[#08060D] px-2.5 py-1.5 font-mono text-xs text-white focus:border-amber-300/60 focus:outline-none"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result count */}
        <p
          role="status"
          aria-live="polite"
          className="text-center font-mono text-xs text-[#A89DB5]"
        >
          Showing {filteredResources.length} of {resources.length} resources
        </p>

        {/* Resources Grid */}
        <div>
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((item, idx) => (
                <Reveal key={item.id} delay={idx * 0.06}>
                  <ResourceCard resource={item} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="space-y-2 rounded-3xl border border-[#4C2A66]/50 bg-[#100B18] p-12 text-center">
              <p className="text-base font-bold text-white">
                No resources matched your search query.
              </p>
              <p className="text-xs text-[#A89DB5]">
                Try clearing your search query or selecting &quot;All&quot;
                categories.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
