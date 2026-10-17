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
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export function LearningCategories() {
  return (
    <section
      id="learning-categories"
      aria-labelledby="categories-heading"
      className="scroll-mt-24 space-y-8"
    >
      <div className="max-w-2xl">
        <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-ink-muted uppercase">
          <span
            aria-hidden="true"
            className="h-1 w-6 rounded-full bg-aws-orange"
          />
          Core Domains
        </p>
        <h2
          id="categories-heading"
          className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Learning Categories
        </h2>
        <p className="mt-3 text-base text-ink-muted sm:text-lg">
          Explore key cloud domains and core AWS capabilities with targeted
          documentation, architectural best practices, and learning modules.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LEARNING_CATEGORIES.map((category: LearningCategory) => {
          const IconComponent = CATEGORY_ICONS[category.iconName];
          return (
            <Card
              key={category.id}
              className="flex flex-col justify-between border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-aws-navy hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-3 inline-flex size-11 items-center justify-center rounded-lg bg-surface-alt text-aws-navy ring-1 ring-border">
                  <IconComponent className="size-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-lg font-semibold text-ink">
                  {category.title}
                </CardTitle>
                <CardDescription className="mt-2 text-xs leading-relaxed text-ink-muted sm:text-sm">
                  {category.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full justify-between border-border text-xs font-semibold text-ink hover:border-aws-orange hover:bg-surface-alt"
                >
                  <a
                    href={category.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Explore ${category.title} resources on official AWS site (opens in a new tab)`}
                  >
                    <span>Explore Resources</span>
                    <ExternalLink
                      className="size-3.5 text-ink-muted"
                      aria-hidden="true"
                    />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
