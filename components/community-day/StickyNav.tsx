'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Ticket } from 'lucide-react';

interface StickyNavProps {
  registrationUrl: string;
}

export function StickyNav({ registrationUrl }: StickyNavProps) {
  return (
    <div className="sticky top-20 z-40 w-full border-y border-[#4C2A66]/40 bg-[#090511]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Anchor Links */}
        <nav aria-label="Community Day sub-navigation" className="flex items-center gap-1 overflow-x-auto py-1 text-xs font-medium text-[#CFC5DC] no-scrollbar sm:gap-2">
          <a
            href="#about"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
          >
            About
          </a>
          <a
            href="#pillars"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
          >
            Learn &amp; Build
          </a>
          <a
            href="#highlights"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
          >
            Highlights
          </a>
          <a
            href="#schedule"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
          >
            Agenda
          </a>
          <a
            href="#journey"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
          >
            Your Journey
          </a>
          <a
            href="#faqs"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
          >
            FAQs
          </a>
        </nav>

        {/* Quick Action */}
        <div className="shrink-0 pl-2">
          <Link
            href={registrationUrl}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FBBF24] px-4 py-1.5 text-xs font-bold text-[#090511] uppercase shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all hover:bg-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] active:scale-95"
          >
            <Ticket className="size-3.5" aria-hidden="true" />
            <span>Register Now</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

