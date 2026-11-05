import { UserCheck, Sparkles } from "lucide-react";
import data from "@/content/community-day.json";

export function Speakers() {
  const { speakers } = data;

  return (
    <section id="speakers" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold">
          <span>Featured Keynotes & Sessions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Speakers &amp; Session Leads
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Learn directly from AWS Heroes, enterprise security architects, community practitioners, and startup builders.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakers.map((speaker, index) => {
          return (
            <div
              key={`${speaker.role}-${index}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{speaker.status}</span>
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    {speaker.role}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {speaker.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {speaker.affiliation}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                    Session Topic
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                    {speaker.topic}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
