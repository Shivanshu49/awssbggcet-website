import { Zap, ShieldCheck, Database, Users, Gamepad2, Award } from "lucide-react";
import data from "@/content/community-day.json";

const ICON_MAP = {
  Zap,
  ShieldCheck,
  Database,
  Users,
  Gamepad2,
  Award,
};

export function Highlights() {
  const { highlights } = data;

  return (
    <section id="highlights" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold">
          <span>Technical Tracks & Perks</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What’s Happening at SCD 2026
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Six power-packed tracks spanning deep architecture walkthroughs, live serverless coding, panel discussions, and competitive cloud games.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((item) => {
          const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP] || Zap;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(251,191,36,0.12)] hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
