import React from 'react';
import Link from 'next/link';
import { ArrowRight, Ticket, Sparkles, MapPin } from 'lucide-react';

interface FinalCtaProps {
  registrationUrl: string;
  venueName: string;
  dateText: string;
}

export function FinalCta({ registrationUrl, venueName, dateText }: FinalCtaProps) {
  return (
    <section className="relative overflow-hidden border-t border-[#4C2A66]/30 bg-gradient-to-b from-[#0B0713] to-[#090511] py-16 sm:py-24">
      {/* Glow Effects */}
      <div className="pointer-events-none absolute -bottom-20 left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[#FBBF24]/10 blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-[#FBBF24]/30 bg-gradient-to-br from-[#180E28] via-[#100B18] to-[#1F1035] p-8 text-center shadow-[0_0_50px_rgba(251,191,36,0.15)] sm:p-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-4 py-1.5 font-mono text-xs font-semibold text-[#FBBF24]">
            <Sparkles className="size-3.5" />
            <span>Limited Capacity Event</span>
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
            READY TO BE PART OF THE COMMUNITY?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#CFC5DC] sm:text-base">
            Secure your spot today to connect with student builders, participate in practical workshops, and elevate your cloud skills.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href={registrationUrl}
              className="inline-flex items-center gap-2 rounded-full bg-[#FBBF24] px-8 py-4 text-sm font-bold text-[#090511] uppercase shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all hover:bg-amber-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] active:scale-95"
            >
              <Ticket className="size-4" />
              <span>Register Now</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-[#A855F7]">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              {dateText}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-[#FBBF24]" />
              {venueName}
            </span>
            <span className="text-[#E9D5FF]">Free Entry · Pre-registration Required</span>
          </div>
        </div>
      </div>
    </section>
  );
}

