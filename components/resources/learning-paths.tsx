import React from "react";
import { levelBadgeClass } from "@/lib/learning";
import { Check, Clock, UserCheck } from "lucide-react";

export interface LearningPath {
  id: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  modules: string[];
  recommendedFor: string;
}

interface LearningPathsProps {
  paths: LearningPath[];
}

export function LearningPaths({ paths }: LearningPathsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {paths.map((path, idx) => (
        <div
          key={path.id}
          className="group flex flex-col justify-between rounded-3xl border border-[#4C2A66]/50 bg-[#100B18] p-6 transition-all duration-300 hover:border-amber-300/50 hover:bg-[#171020]"
        >
          <div>
            <div className="mb-3 flex items-center justify-between border-b border-[#4C2A66]/40 pb-3">
              <span className="font-mono text-xs font-semibold text-amber-300">
                ROADMAP 0{idx + 1}
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-mono text-[11px] text-[#A89DB5]">
                  <Clock className="h-3 w-3 text-[#9C90AA]" />
                  {path.duration}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${levelBadgeClass(
                    path.level,
                  )}`}
                >
                  {path.level}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-amber-200">
              {path.title}
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-[#A89DB5] sm:text-sm">
              {path.description}
            </p>

            <div className="mt-4 border-t border-[#4C2A66]/40 pt-3">
              <span className="mb-2 block font-mono text-[11px] font-semibold tracking-wider text-purple-300/80 uppercase">
                Key Curriculum Milestones
              </span>
              <ul className="space-y-1.5 font-mono text-xs text-[#A89DB5]">
                {path.modules.map((mod, mIdx) => (
                  <li key={mIdx} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                    <span>{mod}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-[#4C2A66]/40 pt-3 text-xs text-[#A89DB5]">
            <UserCheck className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
            <span>Target: {path.recommendedFor}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
