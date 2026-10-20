import {
  Award,
  Boxes,
  Cloud,
  Cpu,
  Database,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { LEARNING_CATEGORIES, LearningCategory } from "./learning-data";

const CATEGORY_ICONS = {
  Cloud,
  Cpu,
  Database,
  ShieldCheck,
  Sparkles,
  Workflow,
  Award,
  Boxes,
};

const ICON_ACCENTS = [
  "border-amber-300/40 text-amber-300",
  "border-purple-400/40 text-purple-300",
] as const;

export function LearningCategories() {
  return (
    <section
      id="learning-categories"
      aria-labelledby="categories-heading"
      className="scroll-mt-24 space-y-8"
    >
      <SectionHeading
        id="categories-heading"
        eyebrow="Core Domains"
        title="Learning Categories"
        description="Explore key cloud domains and core AWS capabilities with targeted documentation, architectural best practices, and learning modules."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LEARNING_CATEGORIES.map((category: LearningCategory, index) => {
          const IconComponent = CATEGORY_ICONS[category.iconName];
          return (
            <div
              key={category.id}
              className="group flex flex-col justify-between rounded-2xl border border-[#4C2A66]/50 bg-[#100B18] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/50 hover:bg-[#171020]"
            >
              <div>
                <div
                  className={`mb-4 inline-flex size-11 items-center justify-center rounded-xl border bg-[#171020] ${
                    ICON_ACCENTS[index % ICON_ACCENTS.length]
                  }`}
                >
                  <IconComponent className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {category.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#A89DB5] sm:text-sm">
                  {category.description}
                </p>
              </div>

              <a
                href={category.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Explore ${category.title} resources on official AWS site (opens in a new tab)`}
                className="mt-5 inline-flex w-full items-center justify-between rounded-xl border border-[#4C2A66]/50 bg-[#171020] px-3 py-2 font-mono text-xs font-semibold text-[#F8FAFC] transition-colors hover:border-amber-300/50 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                <span>Explore Resources</span>
                <ExternalLink
                  className="size-3.5 text-[#A89DB5]"
                  aria-hidden="true"
                />
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
