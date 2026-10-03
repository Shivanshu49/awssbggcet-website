import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Code, FileText, HelpCircle } from "lucide-react";

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

export function ResourceCard({ resource }: ResourceCardProps) {
  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "beginner":
        return <Badge variant="success">Beginner</Badge>;
      case "intermediate":
        return <Badge variant="orange">Intermediate</Badge>;
      case "advanced":
        return <Badge variant="default">Advanced</Badge>;
      default:
        return <Badge variant="muted">{diff}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes("Code") || type.includes("Repo")) return <Code className="h-4 w-4 text-emerald-400" />;
    if (type.includes("Guide") || type.includes("PDF")) return <FileText className="h-4 w-4 text-[#FF9900]" />;
    if (type.includes("Problem")) return <HelpCircle className="h-4 w-4 text-purple-400" />;
    return <BookOpen className="h-4 w-4 text-blue-400" />;
  };

  return (
    <div className="h-full rounded-xl border border-slate-800 bg-[#0C1424] p-5 flex flex-col justify-between hover:border-slate-700 hover:bg-[#0F1A30] transition-all">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#111C30] border border-slate-800 inline-flex">
              {getTypeIcon(resource.type)}
            </span>
            <span className="font-mono text-xs text-slate-400">
              {resource.type}
            </span>
          </div>
          {getDifficultyBadge(resource.difficulty)}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white tracking-tight leading-snug">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {resource.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] font-mono bg-[#080D1A] border border-slate-800 text-slate-400 px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-400">
          Updated {resource.updatedAt}
        </span>
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-[#FF9900] hover:underline inline-flex items-center gap-1.5 font-medium"
        >
          <span>Open Guide</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
