import type { Metadata } from "next";
import {
  LearningHero,
  FeaturedPaths,
  PathExplorer,
  LearningCategories,
  OfficialResources,
  LearningRoadmap,
  WorkshopsSection,
  RelatedResources,
  ProjectIdeas,
  LearningCta,
} from "@/components/learning";

export const metadata: Metadata = {
  title: "AWS Learning Hub — Developer Paths, Roadmaps & Official Resources",
  description:
    "Discover official AWS learning platforms, certification pathways, cloud roadmaps, and hands-on projects designed for students and developers.",
  openGraph: {
    title: "AWS Learning Hub — Developer Paths, Roadmaps & Official Resources",
    description:
      "A dedicated learning hub connecting students and developers to official AWS resources, guided cloud roadmaps, and hands-on project labs.",
    type: "website",
  },
};

export default function LearningPage() {
  return (
    <div className="min-h-screen bg-[#08060D] px-4 py-20 text-[#F8FAFC] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-16 sm:space-y-20 md:space-y-24">
        {/* Hero */}
        <LearningHero />

        {/* Featured spotlight tracks */}
        <FeaturedPaths />

        {/* Topic navigation + learning-path catalog */}
        <PathExplorer />

        {/* Learning domains */}
        <LearningCategories />

        {/* Official AWS learning platforms */}
        <OfficialResources />

        {/* Recommended learning roadmap */}
        <LearningRoadmap />

        {/* Hands-on workshops & guided tutorials */}
        <WorkshopsSection />

        {/* Supporting materials from the resource library */}
        <RelatedResources />

        {/* Hands-on project ideas */}
        <ProjectIdeas />

        {/* Call to action */}
        <LearningCta />
      </div>
    </div>
  );
}
