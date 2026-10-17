import { Compass, ExternalLink, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LearningCta() {
  return (
    <section
      aria-labelledby="learning-cta-heading"
      className="relative overflow-hidden rounded-2xl border border-border bg-aws-navy px-6 py-12 text-surface sm:px-12 sm:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-aws-squid/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-surface/20 bg-surface/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-surface uppercase">
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-aws-orange"
          />
          Take the Next Step
        </p>

        <h2
          id="learning-cta-heading"
          className="mt-4 font-heading text-3xl font-bold tracking-tight text-surface sm:text-4xl"
        >
          Start Building Your Cloud Future Today
        </h2>

        <p className="mt-4 text-base leading-relaxed text-surface/85 sm:text-lg">
          Join thousands of student builders and cloud engineers mastering AWS.
          Explore official architectural patterns, earn certifications, and ship
          real-world cloud applications.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
          <Button
            asChild
            variant="brand"
            size="lg"
            className="w-full justify-center sm:w-auto"
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

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full justify-center border-surface/30 bg-surface/10 text-surface hover:bg-surface/20 hover:text-surface sm:w-auto"
          >
            <a
              href="https://skillbuilder.aws/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Learn with AWS Skill Builder (opens in a new tab)"
            >
              <GraduationCap className="size-4" aria-hidden="true" />
              Learn with AWS Skill Builder
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </Button>
        </div>

        <p className="mt-6 text-xs text-surface/65">
          Official resources provided by Amazon Web Services. Accounts and
          access subject to AWS Free Tier terms.
        </p>
      </div>
    </section>
  );
}
