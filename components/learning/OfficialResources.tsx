import {
  Award,
  BookOpen,
  Compass,
  ExternalLink,
  GraduationCap,
  Hammer,
  Layers,
  Lightbulb,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OFFICIAL_RESOURCES, OfficialResource } from "./learning-data";

const RESOURCE_ICONS = {
  Compass,
  GraduationCap,
  BookOpen,
  Hammer,
  Layers,
  Award,
  Lightbulb,
};

export function OfficialResources() {
  return (
    <section
      id="official-resources"
      aria-labelledby="official-resources-heading"
      className="scroll-mt-24 space-y-8"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-ink-muted uppercase">
            <span
              aria-hidden="true"
              className="h-1 w-6 rounded-full bg-aws-orange"
            />
            Verified AWS Platforms
          </p>
          <h2
            id="official-resources-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Official AWS Learning Resources
          </h2>
          <p className="mt-3 text-base text-ink-muted sm:text-lg">
            Direct access to official Amazon Web Services training, architecture
            guidelines, hands-on workshops, and community builder centers.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start rounded-md border border-border bg-surface-alt px-3 py-1.5 text-xs font-medium text-ink-muted md:self-end">
          <ExternalLink className="size-3.5" aria-hidden="true" />
          <span>All resources link to external official AWS domains</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {OFFICIAL_RESOURCES.map((resource: OfficialResource) => {
          const IconComponent = RESOURCE_ICONS[resource.iconName];
          const isBuilderCenter = resource.id === "builder-center";

          return (
            <Card
              key={resource.id}
              className={`flex flex-col justify-between border transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                isBuilderCenter
                  ? "border-aws-navy bg-surface ring-2 ring-aws-navy/15 lg:col-span-1"
                  : "border-border bg-surface hover:border-aws-navy"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div
                    className={`inline-flex size-11 items-center justify-center rounded-lg ring-1 ${
                      isBuilderCenter
                        ? "bg-aws-navy text-surface ring-aws-navy"
                        : "bg-surface-alt text-aws-navy ring-border"
                    }`}
                  >
                    <IconComponent className="size-5" aria-hidden="true" />
                  </div>
                  {isBuilderCenter && (
                    <span className="rounded-full bg-aws-navy px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-surface uppercase">
                      Featured Hub
                    </span>
                  )}
                </div>

                <CardTitle className="mt-4 text-xl font-semibold text-ink">
                  {resource.name}
                </CardTitle>
                <CardDescription className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {resource.purpose}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <span className="font-mono text-xs text-ink-muted">
                  {resource.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </span>
              </CardContent>

              <CardFooter className="pt-2">
                <Button
                  asChild
                  variant={isBuilderCenter ? "brand" : "default"}
                  size="default"
                  className="w-full justify-center font-semibold"
                >
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit official website for ${resource.name} (opens in a new tab)`}
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="size-3.5" aria-hidden="true" />
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
