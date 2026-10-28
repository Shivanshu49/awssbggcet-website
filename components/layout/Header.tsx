'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import site from '@/content/site.json';
import { NAV_ITEMS } from '@/lib/constants';
import { MobileNav } from './MobileNav';
import { NavLink } from './NavLink';
import { RolledLetterBanner } from './RolledLetterBanner';

export function Header() {
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [bannerKey, setBannerKey] = useState(0);

  // Automatically trigger the cinematic announcement sequence on initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBannerOpen(true);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

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
        <div className="mx-auto flex h-16 items-center justify-between px-3 sm:px-6">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-[#150E22] border border-[#A855F7]/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-transform group-hover:scale-105">
              <Image
                src="/logo/awslogo.png"
                alt="AWS Builder Center GCET Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-bold text-white tracking-tight group-hover:text-[#FBBF24] transition-colors">
                AWS Builder Center GCET
              </span>
              <span className="text-[10px] font-mono text-[#A855F7]">
                Galgotias College of Engineering &amp; Technology
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 bg-[#100B18] px-3 py-1.5 rounded-full border border-[#4C2A66]/50">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-[#CFC5DC] hover:text-[#FBBF24] transition-all"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Button & Community Day Banner Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cinematic Banner Replay / Trigger Button */}
            <button
              type="button"
              onClick={handleOpenBanner}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7E22CE]/30 via-[#A855F7]/20 to-[#FBBF24]/30 border border-[#FBBF24]/60 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-[#FDE68A] hover:bg-[#FBBF24]/30 hover:border-[#FBBF24] transition-all duration-200 shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
              title="Open AWS Student Community Day 2026 Announcement"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24] animate-pulse" />
              <span className="hidden sm:inline font-mono">Community Day &apos;26</span>
              <span className="sm:hidden font-mono">Event</span>
            </button>

            <Link
              href={site.joinFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#FBBF24] px-3.5 sm:px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#090511] shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#F59E0B]"
            >
              Join Club
            </Link>
            <MobileNav joinFormUrl={site.joinFormUrl} onOpenBanner={handleOpenBanner} />
          </div>
        </div>
      </header>

      {/* CINEMATIC EVENT PORTAL ANNOUNCEMENT */}
      <RolledLetterBanner
        key={bannerKey}
        isOpen={isBannerOpen}
        onClose={handleCloseBanner}
      />
    </>
  );
}

export default Header;