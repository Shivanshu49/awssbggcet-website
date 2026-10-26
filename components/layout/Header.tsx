import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import site from '@/content/site.json';
import { NAV_ITEMS } from '@/lib/constants';
import { MobileNav } from './MobileNav';
import { NavLink } from './NavLink';

export function Header() {
  return (
    <header className="navbar-floating navbar-corner-glow rounded-2xl border border-white/15 bg-[#090511]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
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

        {/* Right Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href={site.joinFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#FBBF24] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#090511] shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#F59E0B]"
          >
            Join Club
          </Link>
          <MobileNav joinFormUrl={site.joinFormUrl} />
        </div>
      </div>
    </header>
  );
}

export default Header;