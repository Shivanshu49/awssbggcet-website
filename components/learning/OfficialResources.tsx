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
import { SectionHeading } from "@/components/shared/SectionHeading";
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
      <SectionHeading
        id="official-resources-heading"
        eyebrow="Verified AWS Platforms"
        title="Official AWS Learning Resources"
        description="Direct access to official Amazon Web Services training, architecture guidelines, hands-on workshops, and community builder centers."
      />

      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#4C2A66]/50 bg-[#100B18] px-3.5 py-1.5 font-mono text-[11px] text-[#A89DB5]">
          <ExternalLink
            className="size-3.5 text-amber-300"
            aria-hidden="true"
          />
          <span>All resources link to external official AWS domains</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {OFFICIAL_RESOURCES.map((resource: OfficialResource) => {
          const IconComponent = RESOURCE_ICONS[resource.iconName];
          const isBuilderCenter = resource.id === "builder-center";

          return (
            <div
              key={resource.id}
              className={`group flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                isBuilderCenter
                  ? "border-amber-300/40 bg-gradient-to-br from-[#1b1226] to-[#100B18] shadow-[0_0_24px_rgba(251,191,36,0.08)] hover:border-amber-300/60"
                  : "border-[#4C2A66]/50 bg-[#100B18] hover:border-amber-300/50 hover:bg-[#171020]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`inline-flex size-11 items-center justify-center rounded-xl border ${
                      isBuilderCenter
                        ? "border-amber-300/40 bg-amber-300/10 text-amber-300"
                        : "border-purple-400/30 bg-[#171020] text-purple-300"
                    }`}
                  >
                    <IconComponent className="size-5" aria-hidden="true" />
                  </div>
                  {isBuilderCenter && (
                    <span className="rounded-full border border-amber-300/40 bg-amber-950/40 px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-amber-300 uppercase">
                      Featured Hub
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-xl font-bold text-white transition-colors group-hover:text-amber-200">
                  {resource.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A89DB5]">
                  {resource.purpose}
                </p>
              </div>

              <div className="mt-4">
                <span className="font-mono text-xs text-[#9C90AA]">
                  {resource.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </span>
              </div>

              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit official website for ${resource.name} (opens in a new tab)`}
                className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold tracking-wide transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
                  isBuilderCenter
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:from-amber-300 hover:to-amber-400"
                    : "border border-[#4C2A66]/50 bg-[#171020] text-[#F8FAFC] hover:border-amber-300/50 hover:text-amber-200"
                }`}
              >
                <span>Visit Official Website</span>
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
