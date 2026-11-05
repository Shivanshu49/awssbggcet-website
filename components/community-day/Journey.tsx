import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import data from "@/content/community-day.json";

export function Journey() {
  const { journey } = data;

  return (
    <section id="journey" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/40 text-purple-300 text-xs font-semibold">
          <span>Seamless Attendee Experience</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Your SCD Journey
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          From online pass registration to day-of check-in at GCET Auditorium, here is what to expect.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {journey.map((item) => {
          return (
            <div
              key={item.step}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-amber-400/40 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)] transition-all backdrop-blur-sm relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono font-black text-lg flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                    0{item.step}
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.step === 1 && (
                <div className="pt-6">
                  <Link
                    href="/community-day/register"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-1 transition-all"
                  >
                    <span>Register Now (₹45)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
