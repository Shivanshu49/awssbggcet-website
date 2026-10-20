import React from "react";
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
<<<<<<< HEAD
    <div className="min-h-screen bg-[#08060D] px-4 py-20 text-[#F8FAFC] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-amber-300/40 bg-[#171020] px-3.5 py-1.5 shadow-[0_0_12px_rgba(253,230,138,0.15)]">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="font-mono text-xs text-amber-200">
=======
    <div className="bg-[#08060D] py-12 sm:py-16">
      <Container>
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF9900]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#FF9900]">
>>>>>>> origin/main
              STUDENT BUILDER TOOLKIT
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Developer Roadmaps & Guides
          </h1>
          <p className="text-xs leading-relaxed text-[#A89DB5] sm:text-sm">
            Everything you need to progress from creating an AWS account safely
            to building full-stack serverless apps and preparing for cloud
            engineering interviews.
          </p>
        </div>

        {/* Resources View with Roadmaps and Filterable Guides */}
        <ResourcesView
          learningPaths={resourcesData.learningPaths}
          resources={resourcesData.items}
        />
      </div>
    </div>
  );
}
