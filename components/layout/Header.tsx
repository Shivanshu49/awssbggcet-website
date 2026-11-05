'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import site from '@/content/site.json';
import { NAV_ITEMS } from '@/lib/constants';
import { MobileNav } from './MobileNav';
import { NavLink } from './NavLink';

// Not rendered until first opened, so framer-motion stays out of every page's JS.
const RolledLetterBanner = dynamic(
  () => import('./RolledLetterBanner').then((mod) => mod.RolledLetterBanner),
  { ssr: false },
);

const BANNER_AUTO_OPENED_KEY = 'scd-banner-auto-opened';

export function Header() {
  const pathname = usePathname();
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [bannerKey, setBannerKey] = useState(0);

  // Auto-open on the home page only, at most once per browser session. The flag
  // is written when the timer fires, so React's dev double-run of this effect
  // can't set it and then cancel the open.
  useEffect(() => {
    if (pathname !== '/') return;

    const timer = setTimeout(() => {
      try {
        if (sessionStorage.getItem(BANNER_AUTO_OPENED_KEY)) return;
        sessionStorage.setItem(BANNER_AUTO_OPENED_KEY, '1');
      } catch {
        return; // Storage blocked: can't honour "once", so leave it to the manual button.
      }
      setBannerKey((prev) => prev + 1);
      setIsBannerOpen(true);
    }, 450);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleOpenBanner = () => {
    setBannerKey((prev) => prev + 1);
    setIsBannerOpen(true);
  };

  const handleCloseBanner = () => {
    setIsBannerOpen(false);
  };

  return (
    <>
      <header className="navbar-floating navbar-corner-glow rounded-2xl border border-white/15 bg-[#090511]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 sm:h-16 items-center justify-between px-2.5 sm:px-6">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0 shrink">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden bg-[#150E22] border border-[#A855F7]/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-transform group-hover:scale-105 shrink-0">
              <Image
                src="/logo/sbg-logo.png"
                alt="AWS Builder Center GCET Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-[#FBBF24] transition-colors truncate whitespace-nowrap">
              AWS Builder Center GCET
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 bg-[#100B18] px-3 py-1.5 rounded-full border border-[#4C2A66]/50">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className={
                  item.href === '/community-day'
                    ? 'px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap text-[#FBBF24] border border-[#FBBF24]/60 bg-[#FBBF24]/10 shadow-[0_0_12px_rgba(251,191,36,0.25)] hover:bg-[#FBBF24]/20 transition-all'
                    : 'px-4 py-1.5 rounded-full text-xs font-medium text-[#CFC5DC] hover:text-[#FBBF24] transition-all'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Button & Community Day Banner Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Cinematic Banner Replay / Trigger Button */}
            <button
              type="button"
              onClick={handleOpenBanner}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-gradient-to-r from-[#7E22CE]/30 via-[#A855F7]/20 to-[#FBBF24]/30 border border-[#FBBF24]/60 px-2 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-[#FDE68A] hover:bg-[#FBBF24]/30 hover:border-[#FBBF24] transition-all duration-200 shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              title="Open AWS Student Community Day 2026 Announcement"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FBBF24] animate-pulse shrink-0" />
              <span className="hidden sm:inline lg:hidden xl:inline font-mono">Community Day &apos;26</span>
              <span className="sm:hidden lg:inline xl:hidden font-mono">Event</span>
            </button>

            {site.joinFormUrl && (
              <Link
                href={site.joinFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#FBBF24] px-3.5 sm:px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#090511] shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#F59E0B] shrink-0"
              >
                Join Club
              </Link>
            )}
            <MobileNav joinFormUrl={site.joinFormUrl} onOpenBanner={handleOpenBanner} />
          </div>
        </div>
      </header>

      {/* CINEMATIC EVENT PORTAL ANNOUNCEMENT */}
      {bannerKey > 0 && (
        <RolledLetterBanner
          key={bannerKey}
          isOpen={isBannerOpen}
          onClose={handleCloseBanner}
        />
      )}
    </>
  );
}

export default Header;
