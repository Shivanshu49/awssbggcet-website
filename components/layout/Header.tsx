import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavLink } from './NavLink';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Learning', href: '/learning' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#090511]/90 border-b border-[#4C2A66]/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight group-hover:text-[#FBBF24] transition-colors">
              AWS Builder Center GCET
            </span>
            <span className="text-[10px] font-mono text-[#A855F7]">
              Galgotias College of Engineering &amp; Technology
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#100B18] px-3 py-1.5 rounded-full border border-[#4C2A66]/50">
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
            href="/contact"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#090511] font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-0.5"
          >
            Join Club
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;