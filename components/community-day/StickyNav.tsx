'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Ticket } from 'lucide-react';

interface StickyNavProps {
  registrationUrl: string;
}

export function StickyNav({ registrationUrl }: StickyNavProps) {
  return (
    <div className="sticky top-16 z-40 w-full border-y border-white/10 bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Anchor Links */}
        <nav aria-label="Community Day sub-navigation" className="flex items-center gap-1 overflow-x-auto py-1 text-xs font-medium text-white/80 no-scrollbar sm:gap-2">
          <a
            href="#about"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-gold focus:outline-none"
          >
            About
          </a>
          <a
            href="#pillars"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-gold focus:outline-none"
          >
            Learn &amp; Build
          </a>
          <a
            href="#highlights"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-gold focus:outline-none"
          >
            Highlights
          </a>
          <a
            href="#schedule"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-gold focus:outline-none"
          >
            Agenda
          </a>
          <a
            href="#journey"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-gold focus:outline-none"
          >
            Your Journey
          </a>
          <a
            href="#faqs"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-gold focus:outline-none"
          >
            FAQs
          </a>
        </nav>

        {/* Quick Action */}
        <div className="shrink-0 pl-2">
          <Link
            href={registrationUrl}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-3.5 py-1.5 text-xs font-bold text-black uppercase shadow-[0_0_12px_rgba(244,163,0,0.3)] transition-all hover:brightness-110 active:scale-95 focus:outline-none"
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
