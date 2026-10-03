import React from "react";
import { Container } from "@/components/ui/container";
import { ResourcesView } from "@/components/resources/resources-view";
import { getResourcesData } from "@/lib/content";

export const metadata = {
  title: "Resources & Roadmaps — AWS Guides & Code Starters",
  description:
    "Curated AWS roadmaps, step-by-step Free Tier guides, workshop code starters, and system design sheets built by GCET student engineers.",
};

export default function ResourcesPage() {
  const resourcesData = getResourcesData();

  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF9900]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#FF9900]">
              STUDENT BUILDER TOOLKIT
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Developer Roadmaps & Guides
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Everything you need to progress from creating an AWS account safely to building full-stack serverless apps and preparing for cloud engineering interviews.
          </p>
        </div>

        {/* Resources View with Roadmaps and Filterable Guides */}
        <ResourcesView
          learningPaths={resourcesData.learningPaths}
          resources={resourcesData.items}
        />
      </Container>
    </div>
  );
}
