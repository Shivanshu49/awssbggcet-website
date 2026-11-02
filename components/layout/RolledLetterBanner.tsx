'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Sparkles, ExternalLink, ArrowRight, QrCode } from 'lucide-react';

interface RolledLetterBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Subtle golden ambient particles in the dark space
const GOLDEN_PARTICLES = [
  { id: 1, x: '14%', y: '16%', size: 3, delay: 0.2, duration: 5.2 },
  { id: 2, x: '84%', y: '20%', size: 3.5, delay: 0.5, duration: 4.8 },
  { id: 3, x: '20%', y: '82%', size: 2.5, delay: 0.9, duration: 5.5 },
  { id: 4, x: '82%', y: '78%', size: 4, delay: 0.4, duration: 6.0 },
  { id: 5, x: '8%', y: '50%', size: 3, delay: 1.2, duration: 5.0 },
  { id: 6, x: '92%', y: '48%', size: 3.5, delay: 0.3, duration: 4.5 },
  { id: 7, x: '35%', y: '10%', size: 2.5, delay: 1.5, duration: 5.8 },
  { id: 8, x: '65%', y: '90%', size: 3, delay: 0.7, duration: 4.9 },
  { id: 9, x: '50%', y: '6%', size: 3, delay: 1.0, duration: 4.6 },
  { id: 10, x: '50%', y: '94%', size: 3.5, delay: 0.6, duration: 5.4 },
];

// Rich Brownish-Walnut Royal Scroll Rod with Polished Golden End Caps
function RoyalScrollRod({ isTop = true }: { isTop?: boolean }) {
  return (
    <div className="relative z-30 w-[104%] max-w-[calc(100%+2.5rem)] flex items-center justify-center pointer-events-none select-none">
      {/* Left Golden Knob (Sphere + Stepped Collar) */}
      <div className="flex items-center shrink-0">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[radial-gradient(circle_at_35%_35%,_#FFFBEB_0%,_#FDE68A_28%,_#F59E0B_62%,_#78350F_100%)] shadow-[0_4px_12px_rgba(0,0,0,0.7)] ring-1 ring-amber-200/90" />
        <div className="w-2 sm:w-3.5 h-5 sm:h-7 bg-[linear-gradient(to_bottom,_#FFFBEB_0%,_#FDE68A_25%,_#D97706_50%,_#78350F_100%)] rounded-sm shadow-sm border-x border-amber-300/70" />
      </div>

      {/* Main Brownish-Walnut Roller Cylinder */}
      <div
        className={`flex-1 h-5 sm:h-7 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.9),0_2px_10px_rgba(120,53,15,0.8)] border-y border-amber-300/60 relative overflow-hidden ${
          isTop
            ? 'bg-[linear-gradient(to_bottom,_#54250C_0%,_#78350F_18%,_#9A3412_36%,_#D97706_50%,_#78350F_68%,_#451A03_100%)]'
            : 'bg-[linear-gradient(to_bottom,_#451A03_0%,_#78350F_22%,_#9A3412_40%,_#D97706_50%,_#78350F_72%,_#381402_100%)]'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(254,240,138,0.35)_0%,_transparent_70%)]" />
        <div className="absolute top-1 sm:top-1.5 inset-x-4 h-0.5 sm:h-1 bg-white/45 blur-[0.6px] rounded-full pointer-events-none" />
      </div>

      {/* Right Golden Knob (Stepped Collar + Sphere) */}
      <div className="flex items-center shrink-0">
        <div className="w-2 sm:w-3.5 h-5 sm:h-7 bg-[linear-gradient(to_bottom,_#FFFBEB_0%,_#FDE68A_25%,_#D97706_50%,_#78350F_100%)] rounded-sm shadow-sm border-x border-amber-300/70" />
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[radial-gradient(circle_at_35%_35%,_#FFFBEB_0%,_#FDE68A_28%,_#F59E0B_62%,_#78350F_100%)] shadow-[0_4px_12px_rgba(0,0,0,0.7)] ring-1 ring-amber-200/90" />
      </div>
    </div>
  );
}

export const RolledLetterBanner: React.FC<RolledLetterBannerProps> = ({
  isOpen,
  onClose,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFullyUnrolled, setIsFullyUnrolled] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setScrollProgress(0);
      setIsFullyUnrolled(false);
      setIsInteractive(false);
      return;
    }

    if (prefersReducedMotion) {
      setScrollProgress(100);
      setIsFullyUnrolled(true);
      setIsInteractive(true);
      return;
    }

    const timer1 = setTimeout(() => setScrollProgress(25), 250);
    const timer2 = setTimeout(() => setScrollProgress(60), 750);
    const timer3 = setTimeout(() => setScrollProgress(90), 1300);
    const timer4 = setTimeout(() => {
      setScrollProgress(100);
      setIsFullyUnrolled(true);
    }, 1850);
    const timer5 = setTimeout(() => {
      setIsInteractive(true);
    }, 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [isOpen, prefersReducedMotion]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const calendarUrl = useMemo(() => {
    const title = encodeURIComponent('AWS Student Community Day 2026 - GCET');
    const details = encodeURIComponent(
      'Join AWS Student Builder Group GCET for the premier flagship student cloud engineering conference featuring keynote sessions, hands-on cloud labs, architect showcases, and community networking.'
    );
    const location = encodeURIComponent('Galgotias College of Engineering & Technology, Greater Noida');
    const dates = '20261121T043000Z/20261121T103000Z'; // 10:00 AM - 4:00 PM IST
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  }, []);

  const registrationUrl = '/events/aws-student-community-day-2026/register';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="AWS Student Community Day 2026 Royal Announcement"
        >
          {/* Deep Dark Royal Space Backdrop with Blur */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-[#050209]/92 backdrop-blur-xl transition-opacity"
          />

          {/* Ambient Warm Golden Particles */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
            {GOLDEN_PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0.2, scale: 0.8 }}
                animate={{
                  opacity: [0.2, 0.85, 0.2],
                  scale: [0.8, 1.25, 0.8],
                  y: ['0px', '-20px', '0px'],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  left: p.x,
                  top: p.y,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                className="absolute rounded-full bg-[#FDE68A] shadow-[0_0_12px_#FBBF24]"
              />
            ))}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] bg-amber-600/10 blur-[130px] rounded-full pointer-events-none" />
          </div>

          {/* =========================================================================
              ROYAL SCROLL ASSEMBLY WRAPPER
              ========================================================================= */}
          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center my-auto py-4">
            {/* TOP BROWNISH ROYAL SCROLL ROD */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex justify-center -mb-2 z-30"
            >
              <RoyalScrollRod isTop={true} />
            </motion.div>

            {/* UNROLLING SCROLL BODY */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { height: 'auto', opacity: 1 }
                  : { height: 0, opacity: 0.3 }
              }
              animate={
                prefersReducedMotion
                  ? { height: 'auto', opacity: 1 }
                  : {
                      height: scrollProgress === 0 ? 0 : 'auto',
                      opacity: scrollProgress === 0 ? 0.3 : 1,
                    }
              }
              transition={{
                duration: prefersReducedMotion ? 0.1 : 1.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(180,83,9,0.35)]"
              style={{
                background:
                  'radial-gradient(circle at 50% 20%, #451A03 0%, #2A1105 45%, #180903 100%)',
              }}
            >
              {/* Outer Golden Border Filigree */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-amber-300/80 z-20 shadow-[inset_0_0_30px_rgba(251,191,36,0.2)]" />

              {/* Inner Parchment Content Frame */}
              <div className="relative z-10 p-3.5 sm:p-6 md:p-7 flex flex-col justify-between">
                {/* Subtle parchment silk sheen watermark */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(254,240,138,0.08)_0%,_transparent_75%)]" />

                {/* CLOSE 'X' BUTTON */}
                <motion.button
                  type="button"
                  onClick={onClose}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                  animate={isInteractive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.35 }}
                  aria-label="Close announcement and view website"
                  title="Close (Esc)"
                  className="group absolute top-3 right-3 sm:top-5 sm:right-6 z-50 flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-[#2A1308]/95 text-white border-2 border-[#FDE68A] shadow-[0_0_15px_rgba(251,191,36,0.6)] hover:bg-[#FBBF24] hover:text-[#090511] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md"
                >
                  <span className="text-xs font-mono font-bold uppercase tracking-wider hidden sm:inline">
                    Close
                  </span>
                  <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
                </motion.button>

                {/* Royal Header Proclamation Pill */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  animate={isFullyUnrolled ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.45 }}
                  className="mb-3 sm:mb-4 flex flex-wrap items-center justify-between gap-2 pr-16 sm:pr-24"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A1308]/85 border border-[#FDE68A]/60 shadow-[0_0_10px_rgba(251,191,36,0.25)]">
                    <Sparkles className="w-3.5 h-3.5 text-[#FDE68A] animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#FEF08A]">
                      Royal Event Proclamation
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono text-[#FEF08A] font-semibold drop-shadow hidden sm:inline">
                    Galgotias College of Engineering &amp; Technology
                  </span>
                </motion.div>

                {/* =========================================================================
                    PROGRESSIVE POSTER REVEAL USING ANIMATED CLIPPING MASK + INTEGRATED QR CODE OVERLAY
                    ========================================================================= */}
                <motion.div
                  initial={
                    prefersReducedMotion
                      ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1 }
                      : { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0.85, scale: 0.98 }
                  }
                  animate={
                    prefersReducedMotion
                      ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1 }
                      : {
                          clipPath: isFullyUnrolled
                            ? 'inset(0% 0% 0% 0%)'
                            : ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
                          opacity: 1,
                          scale: isFullyUnrolled ? 1 : 0.98,
                        }
                  }
                  transition={{
                    delay: prefersReducedMotion ? 0 : 0.65,
                    duration: prefersReducedMotion ? 0.2 : 2.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative w-full rounded-xl overflow-hidden bg-[#07030A] border-2 border-[#FDE68A] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(251,191,36,0.35)]"
                >
                  {/* Gold Corner Ornaments on Poster */}
                  <div className="pointer-events-none absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FEF08A] z-20 shadow-[0_0_8px_#FBBF24]" />
                  <div className="pointer-events-none absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FEF08A] z-20 shadow-[0_0_8px_#FBBF24]" />
                  <div className="pointer-events-none absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FEF08A] z-20 shadow-[0_0_8px_#FBBF24]" />
                  <div className="pointer-events-none absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FEF08A] z-20 shadow-[0_0_8px_#FBBF24]" />

                  {/* Golden Light Sweep travelling across the poster as it unrolls */}
                  {!prefersReducedMotion && (
                    <motion.div
                      initial={{ y: '-100%', opacity: 0 }}
                      animate={{
                        y: ['-100%', '220%'],
                        opacity: [0, 0.6, 0],
                      }}
                      transition={{
                        delay: 1.4,
                        duration: 1.8,
                        ease: 'easeInOut',
                      }}
                      className="pointer-events-none absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-amber-200/25 to-transparent z-20"
                    />
                  )}

                  {/* 100% COMPLETE POSTER: Exact Aspect Ratio (1024/576) */}
                  <Link
                    href={registrationUrl}
                    onClick={onClose}
                    className="group/poster relative w-full aspect-[1024/576] block cursor-pointer"
                    title="Click to Open Community Day Registration Page"
                  >
                    <Image
                      src="/events/aws-community-day-banner.jpg"
                      alt="AWS Student Community Day 2026 - Galgotias College of Engineering and Technology"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1024px"
                      className="object-contain w-full h-full block group-hover/poster:scale-[1.01] transition-transform duration-300"
                    />

                    {/* Integrated Scannable Registration QR Badge on Poster */}
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 bg-[#090511]/90 backdrop-blur-md p-1.5 sm:p-2 rounded-xl border border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center gap-2 group-hover/poster:border-amber-300 transition-colors">
                      <div className="bg-white p-1 rounded-lg">
                        <Image
                          src="/events/community-day-register-qr.png"
                          alt="Scan to Register QR Code"
                          width={44}
                          height={44}
                          className="w-9 h-9 sm:w-11 sm:h-11 object-contain block"
                        />
                      </div>
                      <div className="text-left pr-1.5 hidden sm:block">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
                          Scan to Register
                        </span>
                        <span className="text-[8px] font-mono text-[#C4B5DA] block">
                          Instant Pass
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* =========================================================================
                    3. DETAILS PANEL & BUTTONS — Prominent "REGISTER NOW" CTA
                    ========================================================================= */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={isInteractive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="mt-4 pt-3.5 border-t border-amber-400/30 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4"
                >
                  {/* Metadata Chips on Brownish-Amber background */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A1308]/90 border border-amber-500/50 text-[#FEF08A] shadow-md font-medium">
                      <Calendar className="w-4 h-4 text-[#FDE68A]" />
                      <span>21 November 2026</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A1308]/90 border border-amber-500/50 text-[#FEF08A] shadow-md">
                      <Clock className="w-4 h-4 text-[#FDE68A]" />
                      <span>10:00 AM – 4:00 PM IST</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A1308]/90 border border-amber-500/50 text-[#FEF08A] shadow-md">
                      <MapPin className="w-4 h-4 text-[#FDE68A]" />
                      <span className="truncate max-w-[210px] sm:max-w-none">GCET Campus, Greater Noida</span>
                    </div>
                  </div>

                  {/* Actions: Add to Calendar & PROMINENT REGISTER NOW BUTTON */}
                  <div className="flex items-center gap-2.5 self-end md:self-auto w-full md:w-auto">
                    <a
                      href={calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#3B1C0B] border border-[#FDE68A]/60 text-xs font-semibold text-[#FEF08A] hover:bg-[#522710] transition-all duration-200 shadow-[0_0_12px_rgba(251,191,36,0.25)] hover:scale-105 active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#FDE68A]" />
                      <span>Add to Calendar</span>
                      <ExternalLink className="w-3 h-3 text-[#FDE68A]" />
                    </a>

                    <Link
                      href={registrationUrl}
                      onClick={onClose}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-extrabold uppercase tracking-wider shadow-[0_0_25px_rgba(251,191,36,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer font-mono"
                    >
                      <span>Register Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>

                {/* Helper Key Hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isInteractive ? { opacity: 0.75 } : { opacity: 0 }}
                  className="mt-2.5 text-center text-[10px] font-mono text-[#FEF08A]"
                >
                  Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-white font-mono border border-amber-200/30">Esc</kbd> or click ✕ to enter website.
                </motion.p>
              </div>
            </motion.div>

            {/* BOTTOM BROWNISH ROYAL SCROLL ROD */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: -20 }
              }
              animate={{
                opacity: 1,
                y: prefersReducedMotion
                  ? 0
                  : scrollProgress === 0
                  ? -20
                  : 0,
              }}
              transition={{
                duration: prefersReducedMotion ? 0.1 : 1.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full flex justify-center -mt-2 z-30"
            >
              <RoyalScrollRod isTop={false} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
