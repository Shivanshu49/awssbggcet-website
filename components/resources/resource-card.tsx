import React from "react";
import {
  ExternalLink,
  BookOpen,
  Code,
  FileText,
  HelpCircle,
} from "lucide-react";

export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  type: string;
  difficulty: string;
  description: string;
  link: string;
  tags: string[];
  updatedAt: string;
}

interface ResourceCardProps {
  resource: ResourceItem;
}

function difficultyPill(diff: string) {
  switch (diff.toLowerCase()) {
    case "beginner":
      return "border-emerald-500/30 bg-emerald-950/40 text-emerald-300";
    case "beginner to intermediate":
      return "border-lime-500/30 bg-lime-950/40 text-lime-300";
    case "intermediate":
      return "border-amber-400/40 bg-amber-950/40 text-amber-300";
    case "intermediate to advanced":
      return "border-orange-400/30 bg-orange-950/40 text-orange-300";
    case "advanced":
      return "border-rose-400/30 bg-rose-950/40 text-rose-300";
    default:
      return "border-[#4C2A66]/50 bg-[#171020] text-[#A89DB5]";
  }
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const getTypeIcon = (type: string) => {
    if (type.includes("Code") || type.includes("Repo"))
      return <Code className="h-4 w-4 text-emerald-300" />;
    if (type.includes("Guide") || type.includes("PDF"))
      return <FileText className="h-4 w-4 text-amber-300" />;
    if (type.includes("Problem"))
      return <HelpCircle className="h-4 w-4 text-purple-300" />;
    return <BookOpen className="h-4 w-4 text-purple-300" />;
  };

  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-[#4C2A66]/50 bg-[#100B18] p-5 transition-all duration-300 hover:border-amber-300/50 hover:bg-[#171020]">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-lg border border-[#4C2A66]/50 bg-[#171020] p-1.5">
              {getTypeIcon(resource.type)}
            </span>
            <span className="font-mono text-xs text-[#A89DB5]">
              {resource.type}
            </span>
          </div>
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${difficultyPill(
              resource.difficulty,
            )}`}
          >
            {resource.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base leading-snug font-bold tracking-tight text-[#F8FAFC] transition-colors group-hover:text-amber-200">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-xs leading-relaxed text-[#A89DB5] sm:text-sm">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {resource.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded border border-[#4C2A66]/40 bg-[#08060D] px-2 py-0.5 font-mono text-[11px] text-purple-200/80"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-5 flex items-center justify-between border-t border-[#4C2A66]/40 pt-4">
        <span className="font-mono text-[11px] text-[#A89DB5]">
          Updated {resource.updatedAt}
        </span>
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-amber-300 hover:text-amber-200 hover:underline"
        >
          <span>Open Guide</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
