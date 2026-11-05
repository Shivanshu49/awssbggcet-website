import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin, Sparkles, Users } from "lucide-react";
import data from "@/content/community-day.json";

export function Hero() {
  const { hero } = data;

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6">
      {/* Background Accent Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-gradient-to-tr from-purple-700/20 via-amber-500/15 to-transparent rounded-full blur-[120px] -z-10"
      />

      <div className="mx-auto max-w-5xl text-center space-y-6">
        {/* Top Flagship Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold shadow-[0_0_15px_rgba(251,191,36,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{hero.badge}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase">
          <span className="text-white">BUILD. </span>
          <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">LEARN. </span>
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">CONNECT.</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-2xl font-bold tracking-tight text-slate-200">
          {hero.tagline}
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {hero.description}
        </p>

        {/* Metadata Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 text-purple-200">
            <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{hero.date}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 text-purple-200">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{hero.time}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-950/40 text-amber-200">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{hero.venue}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-950/40 text-amber-200 font-semibold">
            <Users className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{hero.capacity}</span>
          </div>
        </div>

        {/* Pricing Notice & Action CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/community-day/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold px-8 py-3.5 text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:shadow-[0_0_35px_rgba(251,191,36,0.7)] hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <span>{hero.ctaRegister}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="#schedule"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-900/20 hover:bg-purple-900/40 text-purple-200 font-semibold px-6 py-3.5 text-sm transition-all duration-200 hover:border-purple-400/60"
          >
            <span>{hero.ctaExplore}</span>
          </a>
        </div>

        {/* Nominal Fee Callout */}
        <div className="pt-2">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wider uppercase px-4 py-1.5 rounded-full bg-[#090c15]/95 border-2 border-amber-400 text-white shadow-[0_0_16px_rgba(251,191,36,0.75),inset_0_0_8px_rgba(251,191,36,0.25)]">
            <span className="text-amber-400">₹45 ONLY</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200 tracking-normal font-medium">Auditorium Pass</span>
            <span className="text-amber-300 text-xs">✦</span>
          </span>
        </div>
      </div>
    </section>
  );
}
