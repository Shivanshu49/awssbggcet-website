import Link from "next/link";
import { ArrowRight, Sparkles, Ticket } from "lucide-react";
import data from "@/content/community-day.json";

export function FinalCTA() {
  const { finalCTA } = data;

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Neon Halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-gradient-to-r from-purple-600/20 via-amber-500/20 to-purple-600/20 rounded-full blur-[140px] -z-10"
      />

      <div className="max-w-4xl mx-auto rounded-3xl border border-amber-400/30 bg-[#0c0817]/95 p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-[0_0_40px_rgba(251,191,36,0.15)] backdrop-blur-xl relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{finalCTA.badge}</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {finalCTA.heading}
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          {finalCTA.subheading}
        </p>

        {/* Highlighted Price Tag */}
        <div className="pt-2">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>{finalCTA.fee} • Auditorium Pass</span>
          </span>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link
            href="/community-day/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-10 py-4 text-base uppercase tracking-wider transition-all duration-200 shadow-[0_0_30px_rgba(251,191,36,0.45)] hover:shadow-[0_0_45px_rgba(251,191,36,0.8)] hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <span>{finalCTA.buttonText}</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="text-xs text-slate-400 pt-2">
          Strict limit of 200 participants • Digital pass issued instantly upon verification
        </p>
      </div>
    </section>
  );
}
