'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

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
        {/* Spherical Golden Ball */}
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[radial-gradient(circle_at_35%_35%,_#FFFBEB_0%,_#FDE68A_28%,_#F59E0B_62%,_#78350F_100%)] shadow-[0_4px_12px_rgba(0,0,0,0.7)] ring-1 ring-amber-200/90" />
        {/* Stepped Collar Ring */}
        <div className="w-2 sm:w-3.5 h-5 sm:h-7 bg-[linear-gradient(to_bottom,_#FFFBEB_0%,_#FDE68A_25%,_#D97706_50%,_#78350F_100%)] rounded-sm shadow-sm border-x border-amber-300/70" />
      </div>

      {/* Main Brownish-Walnut Roller Cylinder */}
      <div
        className={`relative flex-1 h-5 sm:h-7 rounded-sm shadow-[0_6px_16px_rgba(0,0,0,0.85)] border-y border-amber-300/80 overflow-hidden flex items-center justify-between px-3 ${
          isTop
            ? 'bg-[linear-gradient(to_bottom,_#FDE68A_0%,_#D97706_15%,_#92400E_42%,_#451A03_78%,_#1C0A00_100%)]'
            : 'bg-[linear-gradient(to_top,_#FDE68A_0%,_#D97706_15%,_#92400E_42%,_#451A03_78%,_#1C0A00_100%)]'
        }`}
      >
        {/* Specular golden light sweep */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-100/95 to-transparent opacity-90" />
        {/* Bottom shadow trim */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black/60" />
        {/* Warm gold inscription in cylinder */}
        <span className="relative z-10 text-[8px] sm:text-[10px] font-mono font-bold tracking-widest text-[#FEF08A] uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          ✦ AWS STUDENT COMMUNITY DAY 2026 ✦
        </span>
        <span className="relative z-10 hidden sm:inline-block text-[8px] font-mono text-[#FDE68A]/95 tracking-wider uppercase drop-shadow">
          GCET GREATER NOIDA
        </span>
      </div>

      {/* Right Golden Knob (Stepped Collar + Sphere) */}
      <div className="flex items-center shrink-0">
        {/* Stepped Collar Ring */}
        <div className="w-2 sm:w-3.5 h-5 sm:h-7 bg-[linear-gradient(to_bottom,_#FFFBEB_0%,_#FDE68A_25%,_#D97706_50%,_#78350F_100%)] rounded-sm shadow-sm border-x border-amber-300/70" />
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[radial-gradient(circle_at_35%_35%,_#FFFBEB_0%,_#FDE68A_28%,_#F59E0B_62%,_#78350F_100%)] shadow-[0_4px_12px_rgba(0,0,0,0.7)] ring-1 ring-amber-200/90" />
      </div>
    </div>
  );
}

export function RolledLetterBanner({ isOpen, onClose }: RolledLetterBannerProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isFullyUnrolled, setIsFullyUnrolled] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  // Multi-stage timeline:
  // 0.0s - 0.6s: Closed scroll pause
  // 0.6s - 3.2s: Unrolling vertically with progressive clipping reveal
  // 3.2s: Transition into floating poster (flowing in air)
  // 3.8s: Reveal details panel & interactive controls
  useEffect(() => {
    if (!isOpen) {
      setIsFullyUnrolled(false);
      setIsInteractive(false);
      return;
    }

    if (prefersReducedMotion) {
      setIsFullyUnrolled(true);
      setIsInteractive(true);
      return;
    }

    setIsFullyUnrolled(false);
    setIsInteractive(false);

    const unrollTimer = setTimeout(() => {
      setIsFullyUnrolled(true);
    }, 3200);

    const interactiveTimer = setTimeout(() => {
      setIsInteractive(true);
    }, 3800);

    return () => {
      clearTimeout(unrollTimer);
      clearTimeout(interactiveTimer);
    };
  }, [isOpen, prefersReducedMotion]);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Google Calendar URL
  const calendarUrl = useMemo(
    () =>
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        'AWS Student Community Day 2026 – GCET'
      )}&dates=20261121T043000Z/20261121T103000Z&details=${encodeURIComponent(
        'AWS Student Community Day organized by AWS Student Builder Group at Galgotias College of Engineering & Technology. Learn | Build | Connect. 10:00 AM - 4:00 PM.'
      )}&location=${encodeURIComponent(
        'Galgotias College of Engineering and Technology, Knowledge Park II, Greater Noida, Uttar Pradesh 201310'
      )}`,
    []
  );

  const handleBackdropClick = () => {
    if (isInteractive) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="brown-royal-scroll-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.38, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[140] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/92 backdrop-blur-xl"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="AWS Student Community Day 2026 Royal Proclamation"
        >
          {/* =========================================================================
              1. DARK SCREEN WITH SUBTLE GOLDEN PARTICLES & WARM AMBIENT GLOW
              ========================================================================= */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* Ambient warm brownish amber and purple atmospheric glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[650px] rounded-full bg-gradient-to-r from-[#7E22CE]/20 via-[#92400E]/22 to-[#451A03]/25 blur-[140px]" />

            {/* Subtle floating golden particles */}
            {GOLDEN_PARTICLES.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0.15, 0.75, 0.15],
                  y: [0, -18, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: 'easeInOut',
                }}
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                }}
                className="absolute rounded-full bg-[#FEF08A] shadow-[0_0_8px_#FBBF24]"
              />
            ))}
          </div>

          {/* =========================================================================
              2. THE ROYAL SCROLL ASSEMBLY (BROWNISH PARCHMENT)
              Starts closed, unrolls vertically, then floats gently flowing in the air!
              ========================================================================= */}
          <motion.div
            animate={
              isFullyUnrolled && !prefersReducedMotion
                ? {
                    y: [0, -12, 3, -12, 0], // Subtle vertical floating levitation
                    rotateZ: [0, 0.8, -0.6, 0.8, 0], // Organic gentle air tilt
                    rotateX: [0, 2, -1.5, 2, 0], // 3D depth in the air
                  }
                : { y: 0, rotateZ: 0, rotateX: 0 }
            }
            transition={{
              repeat: Infinity,
              duration: 5.2,
              ease: 'easeInOut',
            }}
            style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
            className="relative w-full max-w-4xl my-auto py-2 sm:py-4 flex flex-col items-center z-40 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TOP BROWNISH ROYAL SCROLL ROD */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 } // Starts centered with bottom rod (closed state)
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.1,
                duration: prefersReducedMotion ? 0.2 : 0.5,
                ease: 'easeOut',
              }}
              className="relative z-30 w-full flex items-center justify-center"
            >
              <RoyalScrollRod isTop={true} />
            </motion.div>

            {/* UNROLLING ROYAL BROWN PARCHMENT & POSTER CANVAS */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { height: 'auto', opacity: 1 }
                  : { height: 0, opacity: 1 } // Completely closed initially: poster hidden!
              }
              animate={{
                height: 'auto',
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0.2,
                transition: { duration: 0.45, ease: 'easeInOut' },
              }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.6, // Holds closed scroll for suspense
                duration: prefersReducedMotion ? 0.2 : 2.5, // Majestic vertical unroll
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: 'top center' }}
              className="relative z-20 w-full overflow-hidden shadow-[0_25px_60px_-10px_rgba(0,0,0,0.95),0_0_35px_rgba(168,85,247,0.35),0_0_20px_rgba(251,191,36,0.25)] -my-0.5"
            >
              {/* Royal Brownish-Amber Parchment Body */}
              <div className="relative w-full border-x-4 border-[#B45309] bg-[linear-gradient(to_right,_#1C0D05_0%,_#2A1408_8%,_#3B1C0B_25%,_#4C240E_50%,_#3B1C0B_75%,_#2A1408_92%,_#1C0D05_100%)] p-4 sm:p-6 md:p-8 shadow-[inset_0_0_50px_rgba(0,0,0,0.85),inset_15px_0_30px_-10px_rgba(0,0,0,0.8),inset_-15px_0_30px_-10px_rgba(0,0,0,0.8)]">
                
                {/* Inset Gold Pinstripe Margins on Left and Right */}
                <div className="pointer-events-none absolute inset-y-0 left-2.5 sm:left-4 w-0.5 bg-gradient-to-b from-[#FEF08A] via-[#FBBF24] to-[#B45309] shadow-[0_0_8px_#FBBF24] opacity-90" />
                <div className="pointer-events-none absolute inset-y-0 right-2.5 sm:right-4 w-0.5 bg-gradient-to-b from-[#FEF08A] via-[#FBBF24] to-[#B45309] shadow-[0_0_8px_#FBBF24] opacity-90" />

                {/* Subtle parchment silk sheen watermark */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(254,240,138,0.08)_0%,_transparent_75%)]" />

                {/* CLOSE 'X' BUTTON - Revealed smoothly once scroll has unrolled */}
                <motion.button
                  type="button"
                  onClick={onClose}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                  animate={isInteractive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.35 }}
                  aria-label="Close announcement and access website"
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
                    PROGRESSIVE POSTER REVEAL USING ANIMATED CLIPPING MASK
                    Reveals top-to-bottom as the royal rods pull apart, then transforms into floating poster
                    ========================================================================= */}
                <motion.div
                  initial={
                    prefersReducedMotion
                      ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1 }
                      : { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0.85, scale: 0.98 } // Clipped completely initially!
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
                    duration: prefersReducedMotion ? 0.2 : 2.4, // Realistic animated clipping matching unroll
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

                  {/* 100% COMPLETE POSTER: Exact Aspect Ratio (1024/576) with Zero Cropping */}
                  <div className="relative w-full aspect-[1024/576]">
                    <Image
                      src="/events/aws-community-day-banner.jpg"
                      alt="AWS Student Community Day 2026 - Galgotias College of Engineering and Technology"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1024px"
                      className="object-contain w-full h-full block"
                    />
                  </div>
                </motion.div>

                {/* =========================================================================
                    3. DETAILS PANEL & BUTTONS (Brownish-Amber Theme)
                    ========================================================================= */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={
                    isInteractive
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{
                    duration: 0.5,
                    ease: 'easeOut',
                  }}
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

                  {/* Actions: Add to Calendar & Access Website */}
                  <div className="flex items-center gap-2.5 self-end md:self-auto w-full md:w-auto">
                    <a
                      href={calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B1C0B] border border-[#FDE68A]/60 text-xs font-semibold text-[#FEF08A] hover:bg-[#522710] transition-all duration-200 shadow-[0_0_12px_rgba(251,191,36,0.25)] hover:scale-105 active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#FDE68A]" />
                      <span>Add to Calendar</span>
                      <ExternalLink className="w-3 h-3 text-[#FDE68A]" />
                    </a>

                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] text-[#090511] text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:bg-[#F59E0B] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer font-mono"
                    >
                      <span>Access Website</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
                  : { opacity: 0, y: -20 } // Starts centered touching top rod (closed state)
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.6,
                duration: prefersReducedMotion ? 0.2 : 2.5, // Follows unrolling bottom edge
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative z-30 w-full flex items-center justify-center"
            >
              <RoyalScrollRod isTop={false} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
