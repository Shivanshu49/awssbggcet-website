import { ArrowRight, Compass, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LearningHero() {
  return (
    <section
      aria-labelledby="learning-hero-heading"
      className="relative overflow-hidden rounded-2xl border border-border bg-aws-navy px-6 py-12 text-surface sm:px-10 sm:py-16 md:py-20"
    >
      {/* Subtle cloud architecture background motif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"
      />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-surface/20 bg-surface/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-surface uppercase">
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-aws-orange"
          />
          AWS Learning & Builder Hub
        </div>

        <h1
          id="learning-hero-heading"
          className="mt-6 font-heading text-3xl font-bold tracking-tight text-surface sm:text-4xl md:text-5xl"
        >
          Learn. Build. Innovate with AWS.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-surface/85 sm:text-lg">
          Master cloud computing and gain hands-on AWS experience. Discover
          official learning pathways, structured documentation, interactive
          workshops, and certification roadmaps designed for students and
          developers at every skill level.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            asChild
            variant="brand"
            size="lg"
            className="w-full justify-center sm:w-auto"
          >
            <a href="#learning-categories">
              Start Learning
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full justify-center border-surface/30 bg-surface/10 text-surface hover:bg-surface/20 hover:text-surface sm:w-auto"
          >
            <a
              href="https://builder.aws.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Explore AWS Builder Center (opens in a new tab)"
            >
              <Compass className="size-4" aria-hidden="true" />
              Explore AWS Builder Center
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-surface/15 pt-6 text-xs text-surface/75">
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-aws-orange"
            />
            Official AWS Platforms
          </span>
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-aws-orange"
            />
            6-Stage Step-by-Step Roadmap
          </span>
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-aws-orange"
            />
            Guided Hands-on Labs
          </span>
        </div>
      </div>
    </section>
  );
}
