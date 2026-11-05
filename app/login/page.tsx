import type { Metadata } from "next";
import Link from "next/link";
import { Ticket, UserPlus, Mail, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Pass Access & Registration | AWS Student Community Day 2026",
  description:
    "Find your AWS Student Community Day pass or register to participate.",
};

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-16 bg-[#07090e] text-slate-100 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-purple-700/15 rounded-full blur-[100px] -z-10"
      />

      <div className="w-full max-w-3xl mx-auto">
        {/* Header Block */}
        <div className="text-center mb-10 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
            Event Pass & Entry
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Looking for your SCD Pass?
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Students do not require account logins. Your ticket access is linked
            directly to your registration pass link.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Already Registered */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 flex flex-col justify-between hover:border-purple-500/40 transition-colors backdrop-blur-sm">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Ticket className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Already registered?
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Retrieve your AWS Student Community Day 2026 pass link anytime.
                We will send it directly to your registered email address.
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/pass"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium px-5 py-3 transition-colors text-sm shadow-lg shadow-purple-600/20 group"
              >
                <span>Find My Pass</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Card 2: Not Registered Yet */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.12)] transition-all duration-300 backdrop-blur-sm relative">
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.45)] ring-2 ring-amber-300/40">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>₹45 ONLY</span>
              </span>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Not registered yet?
                </h2>
                <div className="inline-flex items-center gap-2 mt-2 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                  </span>
                  <span>₹45 per participant</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Reserve your seat for keynote sessions, hands-on workshops,
                networking, and exclusive community merchandise.
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/community-day/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold px-5 py-3 transition-colors text-sm shadow-lg shadow-amber-400/10 group"
              >
                <span>Register for Community Day</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Guidance Note */}
        <div className="mt-10 text-center border-t border-slate-800/80 pt-6">
          <p className="text-xs sm:text-sm text-slate-400 inline-flex items-center gap-2 flex-wrap justify-center">
            <Mail className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Lost your confirmation email or pass link?</span>
            <a
              href="mailto:gcetawscloudclub@gmail.com"
              className="text-amber-400 hover:underline font-medium"
            >
              gcetawscloudclub@gmail.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
