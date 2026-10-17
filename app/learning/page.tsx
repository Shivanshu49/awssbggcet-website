import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
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
    <div className="bg-surface-alt py-10 sm:py-14 md:py-16">
      <Container className="space-y-16 sm:space-y-20 md:space-y-24">
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
      </Container>
    </div>
  );
}
