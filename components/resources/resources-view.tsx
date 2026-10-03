"use client";

import React, { useState } from "react";
import { ResourceItem, ResourceCard } from "@/components/resources/resource-card";
import { LearningPaths } from "@/components/resources/learning-paths";
import { Reveal } from "@/components/ui/reveal";
import { Search, Filter, BookMarked, Compass } from "lucide-react";

interface ResourcesViewProps {
  learningPaths: any[];
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
    <div className="space-y-16">
      {/* Section 1: Structured Learning Roadmaps */}
      <section id="learning-paths" className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Compass className="h-5 w-5 text-[#FF9900]" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Structured Learning Roadmaps
          </h2>
        </div>
        <p className="text-sm text-slate-400 max-w-2xl">
          Follow our proven curriculum tracks to progress from foundational cloud basics to architecting production-grade serverless and generative AI systems.
        </p>
        <LearningPaths paths={learningPaths} />
      </section>

      {/* Section 2: Searchable Resource Library */}
      <section id="library" className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2 pb-2">
          <BookMarked className="h-5 w-5 text-[#FF9900]" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Developer Guides & Repository Starters
          </h2>
        </div>

        {/* Filter Controls & Search */}
        <div className="space-y-4 bg-[#0C1424] p-5 rounded-xl border border-slate-800">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by keyword, tag (e.g. Bedrock, IAM, Docker, Next.js)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-[#080D1A] pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-[#FF9900] focus:outline-none"
            />
          </div>

          {/* Category Pills & Difficulty selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Category horizontal scroll list */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#FF9900] text-[#080D1A] font-semibold"
                      : "bg-[#080D1A] text-slate-300 hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono text-slate-400">Level:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="rounded border border-slate-700 bg-[#080D1A] px-2.5 py-1 text-xs text-white focus:border-[#FF9900] focus:outline-none font-mono"
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

        {/* Resources Grid */}
        <div>
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((item, idx) => (
                <Reveal key={item.id} delay={idx}>
                  <ResourceCard resource={item} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-slate-800 rounded-xl bg-[#0C1424] space-y-2">
              <p className="text-base text-white font-medium">
                No resources matched your search query.
              </p>
              <p className="text-xs text-slate-400">
                Try clearing your search query or selecting "All" categories.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
