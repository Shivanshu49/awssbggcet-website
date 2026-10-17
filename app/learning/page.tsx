import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import {
  LearningHero,
  LearningCategories,
  OfficialResources,
  LearningRoadmap,
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
    <main id="main-content" className="bg-surface-alt py-10 sm:py-14 md:py-16">
      <Container className="space-y-16 sm:space-y-20 md:space-y-24">
        {/* A. Hero Section */}
        <LearningHero />

        {/* B. Learning Categories */}
        <LearningCategories />

        {/* C. Official AWS Learning Resources */}
        <OfficialResources />

        {/* D. Recommended Learning Roadmap */}
        <LearningRoadmap />

        {/* E. Hands-on Project Ideas */}
        <ProjectIdeas />

        {/* F. Learning Call to Action */}
        <LearningCta />
      </Container>
    </main>
  );
}
