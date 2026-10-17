import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import site from "@/content/site.json";

export const metadata: Metadata = {
  title: site.clubName,
  description: site.tagline,
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <h1 className="text-4xl font-bold tracking-tight text-ink">About AWS Builder Center GCET</h1>

      <p className="text-2xl text-ink-muted/80 mb-8">
        A student-driven developer community at GCET exploring AWS, cloud computing,
        DevOps, AI, and modern software engineering through hands-on learning, technical
        events, and collaborative projects.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div>
          <h2 className="text-xl font-semibold text-ink mb-4">Mission</h2>
          <p className="text-lg text-ink-muted/70">
            To empower GCET students to learn, build, and ship on AWS together through
            hands-on workshops, collaborative projects, and community-driven events.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink mb-4">Vision</h2>
          <p className="text-lg text-ink-muted/70">
            To become the premier student cloud community at GCET, shaping the next
            generation of cloud architects and AI innovators.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink mb-4">Values</h2>
          <ul className="list-disc pl-5 text-sm text-ink-muted/70 space-y-2">
            <li>Hands-on Learning</li>
            <li>Community First</li>
            <li>Continuous Growth</li>
            <li>Ethical Innovation</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border pt-12">
        <h2 className="text-xl font-semibold text-ink mb-4">Get Involved</h2>
        <p className="text-lg text-ink-muted/70 mb-6">
          Whether you are new to cloud computing or an experienced developer, there is a
          place for you in our community. Join our events, explore our learning paths,
          or submit your own project to be featured.
        </p>
        <div className="flex gap-3">
          <Button
            asChild
            variant="brand"
            size="lg"
            className="px-6 py-3 text-lg"
          >
            <a href={site.joinFormUrl} target="_blank" rel="noopener noreferrer">
              Join Club
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-6 py-3 text-lg"
          >
            <a href="/learning" target="_blank" rel="noopener noreferrer">
              Explore Learning
            </a>
          </Button>
        </div>
      </div>
    </Container>
  );
}
