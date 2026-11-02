'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { User, LogOut, Sparkles, ExternalLink, ShieldCheck, ChevronRight, Award } from 'lucide-react';

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button in Header Navigation */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle AWS Profile Menu"
        aria-expanded={isOpen}
        className={`group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'ring-2 ring-[#FBBF24] bg-[#1E1133] shadow-[0_0_15px_rgba(251,191,36,0.4)]'
            : 'bg-[#150D24] border border-[#4C2A66]/60 hover:border-[#FBBF24]/60 hover:bg-[#1E1133] shadow-sm'
        }`}
      >
        {user ? (
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#7E22CE] via-[#A855F7] to-[#FBBF24] flex items-center justify-center text-xs font-bold font-mono text-white shadow-inner">
            {user.initials}
          </div>
        ) : (
          <div className="flex items-center justify-center text-[#CFC5DC] group-hover:text-[#FBBF24] transition-colors">
            <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
        )}

        {/* Status Dot */}
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#090511] ${
            user ? 'bg-emerald-400 shadow-[0_0_6px_#34D399]' : 'bg-[#FBBF24]'
          }`}
        />
      </button>

      {/* Popover Card (Matches Screenshot 2 & 3) */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-88 rounded-2xl border border-[#4C2A66]/70 bg-gradient-to-b from-[#180E29]/98 via-[#130C22]/98 to-[#090511]/98 p-5 backdrop-blur-3xl shadow-[0_16px_48px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] ring-1 ring-inset ring-white/[0.05] z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Apple Specular Top Rim */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {!user ? (
            /* ============================================================== */
            /* STATE A: NOT SIGNED IN (Exact Inspiration from AWS Screenshots) */
            /* ============================================================== */
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_#FBBF24]" />
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  AWS Profile
                </h3>
              </div>

              <p className="text-xs text-[#CFC5DC] leading-relaxed mb-5 font-normal">
                Your profile helps improve your interactions with select AWS experiences.
              </p>

              {/* Primary Action Button (Matches Screenshot 2 & 3) */}
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#241738] hover:bg-[#301F4B] border border-[#A855F7]/40 hover:border-[#FBBF24]/60 py-3 px-4 text-xs sm:text-sm font-semibold text-white hover:text-[#FBBF24] transition-all duration-200 shadow-md active:scale-[0.98] group"
              >
                <span>Create profile or sign in</span>
                <ChevronRight className="w-4 h-4 text-[#C084FC] group-hover:text-[#FBBF24] group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Helper Links */}
              <div className="mt-4 pt-3.5 border-t border-[#4C2A66]/35 space-y-2">
                <Link
                  href="/community-day"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-xs text-[#9E92B0] hover:text-[#FBBF24] transition-colors py-1"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
                    Community Day &apos;26 Pass
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#4C2A66]" />
                </Link>

                <a
                  href="https://aws.amazon.com/free/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs text-[#9E92B0] hover:text-[#FBBF24] transition-colors py-1"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A855F7]" />
                    AWS Free Tier &amp; Educate
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#9E92B0]" />
                </a>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* STATE B: SIGNED IN BUILDER PROFILE                            */
            /* ============================================================== */
            <div>
              {/* Profile Card Header */}
              <div className="flex items-start gap-3 pb-4 border-b border-[#4C2A66]/40">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#7E22CE] via-[#A855F7] to-[#FBBF24] flex items-center justify-center text-sm font-bold font-mono text-white shadow-md shrink-0">
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white truncate">
                      {user.name}
                    </h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-[11px] font-mono text-[#9E92B0] truncate">
                    {user.email}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#1E1133] border border-[#4C2A66]/60 text-[10px] font-mono text-[#FDE68A]">
                    <span>AWS ID:</span>
                    <span className="text-[#FBBF24] font-bold">{user.builderId}</span>
                  </div>
                </div>
              </div>

              {/* Status & Member Level */}
              <div className="py-3 border-b border-[#4C2A66]/30 flex items-center justify-between text-xs font-mono">
                <span className="text-[#9E92B0]">Role</span>
                <span className="text-[#C084FC] font-semibold">{user.role}</span>
              </div>

              {/* Quick Profile Navigation */}
              <div className="py-2.5 space-y-1">
                <Link
                  href="/community-day"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-[#CFC5DC] hover:text-[#FBBF24] hover:bg-[#1C122C] transition-colors"
                >
                  <Award className="w-4 h-4 text-[#FBBF24]" />
                  <span>My Summit Registration</span>
                </Link>
              </div>

              {/* Sign Out Action */}
              <div className="pt-2.5 border-t border-[#4C2A66]/35">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#150D24] hover:bg-[#201335] border border-[#4C2A66]/50 text-xs font-mono text-[#F87171] hover:text-red-300 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of AWS ID</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
