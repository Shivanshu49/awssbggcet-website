"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, Sparkles, X, ExternalLink, ArrowRight, Layers } from "lucide-react";
import data from "@/content/community-day.json";

interface SpeakerItem {
  role: string;
  name: string;
  affiliation: string;
  topic: string;
  status: string;
  image: string;
  poster?: string;
  linkedin: string;
}

export function Speakers() {
  const { speakers } = data as { speakers: SpeakerItem[] };
  const [selectedSpeaker, setSelectedSpeaker] = useState<SpeakerItem | null>(null);

  // Lock background scroll and touch action, and handle Escape key
  useEffect(() => {
    if (!selectedSpeaker) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedSpeaker(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSpeaker]);

  return (
    <section id="speakers" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Featured Keynotes &amp; Sessions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Speakers &amp; Session Leads
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Learn directly from AWS Solutions Architects, enterprise cloud &amp; AI leaders, and industry practitioners.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {speakers.map((speaker, index) => {
          const hasImage = Boolean(speaker.image && speaker.image.trim() !== "");
          const hasLinkedin = Boolean(speaker.linkedin && speaker.linkedin.trim() !== "");

          return (
            <div
              key={`${speaker.role}-${index}`}
              onClick={() => setSelectedSpeaker(speaker)}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] rounded-2xl border border-slate-800 bg-[#130c22]/90 hover:bg-[#171020] p-5 sm:p-6 flex flex-col justify-between hover:border-amber-400/60 hover:shadow-[0_12px_36px_rgba(168,85,247,0.16),0_0_24px_rgba(251,191,36,0.1)] hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-sm group cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedSpeaker(speaker);
                }
              }}
              aria-label={`View full poster and details for ${speaker.name}`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  {/* Speaker Avatar */}
                  {hasImage ? (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-purple-950/40 shrink-0 group-hover:border-amber-400 group-hover:shadow-[0_0_24px_rgba(251,191,36,0.25)] transition-all duration-300">
                      <Image
                        src={speaker.image}
                        alt={speaker.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-500/10 border-2 border-dashed border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 group-hover:border-amber-400/60 transition-colors">
                      <UserCheck className="w-8 h-8 opacity-75" />
                    </div>
                  )}

                  {/* Status Badge & Direct LinkedIn Link */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 inline-flex items-center gap-1 shrink-0">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{speaker.status}</span>
                    </span>

                    {hasLinkedin && (
                      <a
                        href={speaker.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${speaker.name} LinkedIn Profile`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-[#0077b5]/20 hover:border-[#0077b5]/60 text-slate-300 hover:text-white transition-all text-xs font-medium cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 fill-[#0a66c2]" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <span>Connect</span>
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                    {speaker.role}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5 group-hover:text-amber-200 transition-colors">
                    {speaker.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {speaker.affiliation}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Session Topic
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                    {speaker.topic}
                  </p>
                </div>

                {/* Inspect Hint */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-[#9e92b0] group-hover:text-amber-300 font-mono transition-colors">
                  <span>Click to view full poster</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Speaker Profile & Full Poster Modal */}
      <AnimatePresence>
        {selectedSpeaker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overscroll-contain"
            onClick={() => setSelectedSpeaker(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedSpeaker.name} Profile and Poster`}
          >
            <motion.article
              initial={{ opacity: 0, scale: 0.8, y: 35, rotateX: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", stiffness: 340, damping: 24, mass: 0.8 }}
              style={{ transformPerspective: 1200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[90vw] max-w-[360px] sm:max-w-md md:max-w-3xl max-h-[82dvh] sm:max-h-[88vh] overflow-y-auto overscroll-contain rounded-2xl sm:rounded-3xl border border-amber-400/50 bg-gradient-to-br from-[#171020] via-[#100b18] to-[#130c22] p-4 sm:p-7 md:p-8 shadow-[0_36px_100px_rgba(0,0,0,0.7),0_0_48px_rgba(168,85,247,0.18)] text-white"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedSpeaker(null)}
                className="absolute top-3 right-3 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-amber-400/40 bg-slate-950/85 hover:bg-[#1b1130] hover:border-amber-400 text-white flex items-center justify-center transition-all cursor-pointer z-20 focus-visible:outline-2 focus-visible:outline-amber-400 shadow-lg"
                aria-label="Close profile"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 md:gap-8 items-center">
                {/* Full Poster Column */}
                <div className="md:col-span-5 flex justify-center">
                  {selectedSpeaker.poster ? (
                    <div className="relative w-full max-w-[190px] sm:max-w-[240px] md:max-w-none aspect-[3/4] max-h-[42dvh] sm:max-h-[50dvh] md:max-h-none rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-purple-950/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] mx-auto">
                      <Image
                        src={selectedSpeaker.poster}
                        alt={`${selectedSpeaker.name} Community Day Official Poster`}
                        fill
                        sizes="(max-width: 640px) 70vw, (max-width: 768px) 50vw, 320px"
                        className="object-contain"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-[190px] sm:max-w-[240px] md:max-w-none aspect-[3/4] max-h-[42dvh] sm:max-h-[50dvh] md:max-h-none rounded-2xl border-2 border-dashed border-purple-500/40 bg-purple-950/20 flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-2 sm:space-y-3 mx-auto">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                        <Layers className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 font-bold">
                        Hands-On Technical Workshop
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-400">
                        Speaker details, prerequisites, and hands-on track lab requirements will be revealed shortly.
                      </p>
                    </div>
                  )}
                </div>

                {/* Details Column */}
                <div className="md:col-span-7 space-y-4 sm:space-y-5 text-left">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-purple-400 block mb-1">
                      AWS Student Community Day 2026
                    </span>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{selectedSpeaker.status}</span>
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono">
                        {selectedSpeaker.role}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      {selectedSpeaker.name}
                    </h3>

                    <p className="text-xs sm:text-sm md:text-base text-amber-300 font-medium mt-1">
                      {selectedSpeaker.affiliation}
                    </p>
                  </div>

                  {/* Confirmed Session Topic */}
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-1 sm:space-y-1.5">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest font-mono block">
                      Confirmed Session Topic
                    </span>
                    <p className="text-xs sm:text-base text-white font-semibold leading-snug">
                      {selectedSpeaker.topic}
                    </p>
                  </div>

                  {/* Social Profile Link */}
                  {selectedSpeaker.linkedin ? (
                    <div className="pt-1 sm:pt-2">
                      <a
                        href={selectedSpeaker.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-purple-500/40 bg-[#130c22]/90 hover:bg-[#1b1130] hover:border-amber-400/70 text-amber-300 hover:text-white font-medium text-xs sm:text-sm transition-all hover:scale-105 shadow-md"
                      >
                        <svg className="w-4 h-4 fill-[#0a66c2]" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <span>Connect on LinkedIn</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
