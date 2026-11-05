"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Highlights", href: "#highlights" },
  { label: "Schedule", href: "#schedule" },
  { label: "Speakers", href: "#speakers" },
  { label: "Journey", href: "#journey" },
  { label: "FAQ", href: "#faq" },
  { label: "Venue", href: "#venue" },
];

export function SubNav() {
  return (
    <nav
      aria-label="In-page Event Navigation"
      className="sticky top-20 z-30 mx-auto max-w-5xl px-4 py-2 mb-10"
    >
      <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar rounded-full border border-purple-500/25 bg-[#090514]/90 p-1.5 backdrop-blur-xl shadow-lg shadow-purple-950/40">
        <div className="flex items-center gap-1 shrink-0">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-amber-400 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>
        <Link
          href="/community-day/register"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 transition-all active:scale-95 shadow-md shadow-amber-400/20"
        >
          <span>Register (₹45)</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}
