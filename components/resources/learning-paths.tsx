import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, UserCheck } from "lucide-react";

interface LearningPath {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {paths.map((path, idx) => (
        <div
          key={path.id}
          className="rounded-xl border border-slate-800 bg-[#0C1424] p-6 flex flex-col justify-between hover:border-slate-700 transition-all"
        >
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <span className="font-mono text-xs font-semibold text-[#FF9900]">
                ROADMAP 0{idx + 1}
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                  <Clock className="h-3 w-3 text-slate-500" />
                  {path.duration}
                </span>
                <Badge variant="orange">{path.level}</Badge>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white tracking-tight">
              {path.title}
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {path.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/60">
              <span className="font-mono text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Key Curriculum Milestones
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                {path.modules.map((mod, mIdx) => (
                  <li key={mIdx} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-[#FF9900] shrink-0 mt-0.5" />
                    <span>{mod}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-400">
            <UserCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Target: {path.recommendedFor}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
