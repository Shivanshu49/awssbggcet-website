'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sparkles, Ticket } from 'lucide-react';
import site from '@/content/site.json';
import { NAV_ITEMS } from '@/lib/constants';
import { MobileNav } from './MobileNav';
import { NavLink } from './NavLink';

const RolledLetterBanner = dynamic(
  () => import('./RolledLetterBanner').then((mod) => mod.RolledLetterBanner),
  { ssr: false },
);

const BANNER_AUTO_OPENED_KEY = 'scd-banner-auto-opened';

export function Header() {
  const pathname = usePathname();
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [bannerKey, setBannerKey] = useState(0);

  useEffect(() => {
    if (pathname !== '/') return;

    const timer = setTimeout(() => {
      try {
        if (sessionStorage.getItem(BANNER_AUTO_OPENED_KEY)) return;
        sessionStorage.setItem(BANNER_AUTO_OPENED_KEY, '1');
      } catch {
        return;
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
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-deep-purple via-vibrant-pink to-black border-b border-white/10 shadow-lg backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-[#150E22] border border-[#A855F7]/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-transform group-hover:scale-105 shrink-0">
              <Image
                src="/logo/sbg-logo.png"
                alt="AWS Builder Center GCET Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-tight group-hover:text-gold transition-colors">
                AWS Builder Center GCET
              </span>
              <span className="text-[10px] font-mono text-[#E9D5FF]/80">
                Galgotias College of Engineering &amp; Technology
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className={
                  item.href === '/community-day'
                    ? 'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap text-gold border border-gold/60 bg-gold/10 shadow-[0_0_12px_rgba(244,163,0,0.25)] hover:bg-gold/20 transition-all'
                    : 'px-3.5 py-1.5 rounded-full text-xs font-medium text-white/90 hover:text-gold transition-colors focus:outline-none'
                }
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
              className="inline-flex items-center gap-1.5 rounded-full bg-black/30 border border-gold/50 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition-all shadow-[0_0_12px_rgba(244,163,0,0.2)] hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
              title="Open AWS Student Community Day 2026 Announcement"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span className="hidden sm:inline font-mono">Community Day &apos;26</span>
              <span className="sm:hidden font-mono">Event</span>
            </button>

            {/* Prominent Register Now CTA button */}
            <Link
              href="/community-day/register"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_15px_rgba(244,163,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(244,163,0,0.5)] active:scale-95 focus:outline-none"
            >
              <Ticket className="size-3.5" />
              <span>Register Now</span>
            </Link>

            {/* Mobile Navigation Drawer */}
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
