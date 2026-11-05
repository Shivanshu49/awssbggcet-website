import { Clock, User, Tag } from "lucide-react";
import data from "@/content/community-day.json";

const TYPE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Keynote: {
    bg: "bg-amber-400/10",
    text: "text-amber-300",
    border: "border-amber-400/30",
  },
  "Technical Session": {
    bg: "bg-purple-500/10",
    text: "text-purple-300",
    border: "border-purple-500/30",
  },
  "Live Demo": {
    bg: "bg-cyan-500/10",
    text: "text-cyan-300",
    border: "border-cyan-500/30",
  },
  "Interactive Activity": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
  },
  Networking: {
    bg: "bg-blue-500/10",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
  "Panel Discussion": {
    bg: "bg-pink-500/10",
    text: "text-pink-300",
    border: "border-pink-500/30",
  },
  Ceremony: {
    bg: "bg-amber-400/15",
    text: "text-amber-200",
    border: "border-amber-400/40",
  },
};

export function Schedule() {
  const { schedule } = data;

  return (
    <section id="schedule" className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto scroll-mt-28">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/40 text-purple-300 text-xs font-semibold">
          <span>Official Event Agenda</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Summit Schedule
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Full-day technical timeline running from 10:00 AM to 05:00 PM IST at the GCET Auditorium.
        </p>
      </div>

      <div className="space-y-4">
        {schedule.map((item, index) => {
          const typeStyle = TYPE_STYLES[item.type] || {
            bg: "bg-slate-800/40",
            text: "text-slate-300",
            border: "border-slate-700",
          };

          return (
            <div
              key={`${item.time}-${index}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6 transition-all hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] backdrop-blur-sm flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              {/* Time Column */}
              <div className="md:w-56 shrink-0 space-y-1.5">
                <div className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-amber-400">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{item.time}</span>
                </div>
                <div className="block">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
                  >
                    <Tag className="w-3 h-3" />
                    <span>{item.type}</span>
                  </span>
                </div>
              </div>

              {/* Content Column */}
              <div className="flex-1 space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium pt-1">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Speaker / Lead: {item.speaker}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
