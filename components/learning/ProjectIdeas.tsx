import { BookOpen, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PROJECT_IDEAS, ProjectIdea } from "./learning-data";

function getDifficultyBadgeClass(difficulty: ProjectIdea["difficulty"]) {
  switch (difficulty) {
    case "Beginner":
      return "bg-surface-alt text-ink border-border";
    case "Beginner to Intermediate":
    case "Intermediate":
      return "bg-surface-alt text-aws-navy border-aws-navy/30";
    case "Intermediate to Advanced":
    case "Advanced":
      return "bg-aws-navy text-surface border-aws-navy";
    default:
      return "bg-surface-alt text-ink border-border";
  }
}

export function ProjectIdeas() {
  return (
    <section
      id="hands-on-projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-24 space-y-8"
    >
      <div className="max-w-2xl">
        <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-ink-muted uppercase">
          <span
            aria-hidden="true"
            className="h-1 w-6 rounded-full bg-aws-orange"
          />
          Practical Application
        </p>
        <h2
          id="projects-heading"
          className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Hands-on Project Ideas
        </h2>
        <p className="mt-3 text-base text-ink-muted sm:text-lg">
          Reinforce theoretical knowledge by engineering production-pattern
          projects. Follow step-by-step AWS documentation and workshop guides.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PROJECT_IDEAS.map((project: ProjectIdea) => (
          <Card
            key={project.id}
            className="flex flex-col justify-between border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-aws-navy hover:shadow-md"
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getDifficultyBadgeClass(
                    project.difficulty,
                  )}`}
                >
                  {project.difficulty}
                </span>
                <span className="text-xs text-ink-muted">Lab Guide</span>
              </div>

              <CardTitle className="mt-3 text-lg font-semibold text-ink">
                {project.title}
              </CardTitle>

              <CardDescription className="mt-2 text-sm leading-relaxed text-ink-muted">
                {project.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-xs font-semibold tracking-wider text-ink-muted uppercase">
                Skills Practiced
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.skillsLearned.map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-md bg-surface-alt px-2 py-0.5 text-xs font-medium text-ink-muted ring-1 ring-border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full justify-between border-border text-xs font-semibold text-ink hover:border-aws-navy hover:bg-surface-alt"
              >
                <a
                  href={project.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View official guide for ${project.title} (opens in a new tab)`}
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="size-3.5" aria-hidden="true" />
                    Official Guide & Lab
                  </span>
                  <ExternalLink
                    className="size-3.5 text-ink-muted"
                    aria-hidden="true"
                  />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
