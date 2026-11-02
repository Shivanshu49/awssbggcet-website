'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { User, LogOut, ShieldCheck } from 'lucide-react';

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

      {/* Popover Card (Exact Clean Recreation of AWS Profile) */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-88 rounded-2xl border border-[#4C2A66]/70 bg-gradient-to-b from-[#180E29]/98 via-[#130C22]/98 to-[#090511]/98 p-5 backdrop-blur-3xl shadow-[0_16px_48px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] ring-1 ring-inset ring-white/[0.05] z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Apple Specular Top Rim */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {!user ? (
            /* ============================================================== */
            /* STATE A: NOT SIGNED IN (Exact Match of Screenshot)            */
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

              {/* Primary Action Button */}
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#241738] hover:bg-[#301F4B] border border-[#A855F7]/40 hover:border-[#FBBF24]/60 py-3 px-4 text-xs sm:text-sm font-semibold text-white hover:text-[#FBBF24] transition-all duration-200 shadow-md active:scale-[0.98] group"
              >
                <span>Create profile or sign in</span>
              </Link>
            </div>
          ) : (
            /* ============================================================== */
            /* STATE B: SIGNED IN AWS PROFILE                                */
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

              {/* Sign Out Action */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#150D24] hover:bg-[#201335] border border-[#4C2A66]/50 text-xs font-mono text-[#F87171] hover:text-red-300 transition-colors cursor-pointer"
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
