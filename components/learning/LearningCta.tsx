import { Compass, ExternalLink, GraduationCap } from "lucide-react";

export function LearningCta() {
  return (
    <section
      aria-labelledby="learning-cta-heading"
      className="relative overflow-hidden rounded-3xl border border-[#4C2A66]/60 bg-gradient-to-br from-[#1b1226] via-[#130d1d] to-[#0b0811] px-6 py-14 text-[#F8FAFC] sm:px-12 sm:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-purple-600/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-amber-400/10 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center space-x-2 rounded-full border border-amber-300/40 bg-[#171020] px-3.5 py-1.5 shadow-[0_0_12px_rgba(253,230,138,0.15)]">
          <span className="h-2 w-2 rounded-full bg-amber-300" />
          <span className="font-mono text-xs text-amber-200">
            TAKE THE NEXT STEP
          </span>
        </div>

        <h2
          id="learning-cta-heading"
          className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl"
        >
          Start Building Your Cloud Future Today
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-[#A89DB5] sm:text-base">
          Whether it&apos;s your first IAM user or a production-grade serverless
          system, learn with official AWS architecture patterns, prepare for
          certifications, and ship real cloud applications alongside the GCET
          community.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href="https://builder.aws.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Explore AWS Builder Center (opens in a new tab)"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-bold tracking-wide text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.25)] transition-all hover:from-amber-300 hover:to-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            <Compass className="size-4" aria-hidden="true" />
            Explore AWS Builder Center
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>

          <a
            href="https://skillbuilder.aws/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Learn with AWS Skill Builder (opens in a new tab)"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#4C2A66]/60 bg-[#171020] px-6 py-3 text-sm font-semibold text-[#F8FAFC] transition-all hover:border-amber-300/50 hover:bg-[#1d1428] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            <GraduationCap
              className="size-4 text-purple-300"
              aria-hidden="true"
            />
            Learn with AWS Skill Builder
            <ExternalLink
              className="size-3.5 text-[#A89DB5]"
              aria-hidden="true"
            />
          </a>
        </div>

        <p className="mt-6 font-mono text-[11px] text-[#9C90AA]">
          Official resources provided by Amazon Web Services. Accounts and
          access subject to AWS Free Tier terms.
        </p>
      </div>
    </section>
  );
}
