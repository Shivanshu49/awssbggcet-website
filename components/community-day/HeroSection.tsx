'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  MapPin,
  Ticket,
  Cpu,
  Sparkles,
  Terminal,
  CheckCircle2,
} from 'lucide-react';

interface FactCard {
  label: string;
  value: string;
  subvalue: string;
  icon: string;
}

interface HeroSectionProps {
  eyebrow: string;
  headline: string;
  subheading: string;
  description: string;
  registrationUrl: string;
  factCards: FactCard[];
}

export function HeroSection({
  eyebrow,
  headline,
  subheading,
  description,
  registrationUrl,
  factCards,
}: HeroSectionProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Calendar':
        return Calendar;
      case 'MapPin':
        return MapPin;
      case 'Ticket':
        return Ticket;
      case 'Cpu':
        return Cpu;
      default:
        return Sparkles;
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#180E28] via-[#0E0719] to-[#090511] pt-8 pb-16 sm:pt-14 sm:pb-24">
      {/* Ambient Gradient Glows matching deep-purple & vibrant-pink */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-deep-purple via-vibrant-pink to-transparent opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 -z-10 h-[350px] w-[350px] rounded-full bg-vibrant-pink/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headlines, CTAs, Copy */}
          <div className="flex flex-col text-left lg:col-span-7">
            {/* Eyebrow Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-gold shadow-[0_0_15px_rgba(244,163,0,0.15)]">
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>{eyebrow}</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl sm:leading-none">
              <span className="block text-white">BUILD. LEARN.</span>
              <span className="block bg-gradient-to-r from-gold via-amber-300 to-[#E9D5FF] bg-clip-text text-transparent">
                {headline.includes('CONNECT') ? 'CONNECT.' : headline}
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-4 text-lg font-semibold text-[#E9D5FF] sm:text-xl">
              {subheading}
            </p>

            {/* Description */}
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#CFC5DC] sm:text-base">
              {description}
            </p>

            {/* Call To Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={registrationUrl}
                className="inline-flex items-center gap-2.5 rounded-lg bg-gold px-7 py-3.5 text-sm font-bold text-black uppercase shadow-[0_0_25px_rgba(244,163,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_35px_rgba(244,163,0,0.55)] active:scale-95 focus:outline-none"
              >
                <span>Register Now</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>

              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-lg border border-vibrant-pink/40 bg-black/40 px-6 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-sm transition-all hover:border-gold/60 hover:text-gold focus:outline-none"
              >
                <span>Explore the Event</span>
              </a>
            </div>

            {/* Quick Status Pill */}
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#C084FC]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Registration Status: Pre-registration Open</span>
            </div>
          </div>

          {/* Right Column: Code & Cloud Architecture Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md rounded-2xl border border-vibrant-pink/40 bg-gradient-to-br from-[#1A0E2E]/90 to-black/90 p-5 shadow-[0_0_40px_rgba(60,42,145,0.4)] backdrop-blur-xl">
              {/* Card Window Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-rose-500/80" />
                  <span className="size-3 rounded-full bg-gold/80" />
                  <span className="size-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-[#C084FC]">
                  <Terminal className="size-3" />
                  <span>scd26-manifest.ts</span>
                </div>
              </div>

              {/* Code Snippet */}
              <div className="mt-4 font-mono text-xs leading-relaxed text-[#CFC5DC]">
                <p className="text-[#C084FC]">
                  <span className="text-purple-400">import</span> &#123;{' '}
                  <span className="text-gold">StudentBuilderGroup</span>{' '}
                  &#125; <span className="text-purple-400">from</span>{' '}
                  <span className="text-emerald-400">&apos;@gcet/cloud&apos;</span>;
                </p>
                <div className="my-2 border-l-2 border-gold/50 pl-3">
                  <p>
                    <span className="text-blue-400">const</span> event ={' '}
                    <span className="text-purple-400">await</span>{' '}
                    <span className="text-gold">StudentBuilderGroup</span>.
                    <span className="text-amber-300">init</span>(&#123;
                  </p>
                  <p className="pl-3 text-emerald-300">
                    name: <span className="text-white">&apos;Community Day 2026&apos;</span>,
                  </p>
                  <p className="pl-3 text-emerald-300">
                    date: <span className="text-gold">&apos;21 Nov 2026&apos;</span>,
                  </p>
                  <p className="pl-3 text-emerald-300">
                    venue: <span className="text-white">&apos;GCET Auditorium&apos;</span>,
                  </p>
                  <p className="pl-3 text-emerald-300">
                    mode: <span className="text-purple-300">&apos;In-Person&apos;</span>,
                  </p>
                  <p className="pl-3 text-emerald-300">
                    tracks: [<span className="text-white">&apos;Cloud&apos;</span>,{' '}
                    <span className="text-white">&apos;AI&apos;</span>,{' '}
                    <span className="text-white">&apos;DevOps&apos;</span>],
                  </p>
                  <p>&#125;);</p>
                </div>
                <p className="text-emerald-400">
                  {`// Status: Ready for attendees`}
                </p>
              </div>

              {/* Architectural Badges in Visual Card */}
              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 font-mono text-[11px]">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-white/90">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>Hands-on Labs</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-white/90">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>Peer Networking</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-white/90">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>Cloud Quizzes</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-white/90">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>Digital QR Pass</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fact Cards Row */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {factCards.map((card) => {
            const Icon = getIcon(card.icon);
            return (
              <div
                key={card.label}
                className="group relative flex items-start gap-4 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm transition-all hover:border-gold/50 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(244,163,0,0.15)]"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold shadow-[0_0_15px_rgba(244,163,0,0.15)] group-hover:scale-105 transition-transform">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-[#C084FC]">
                    {card.label}
                  </span>
                  <span className="mt-0.5 text-base font-bold text-white group-hover:text-gold transition-colors">
                    {card.value}
                  </span>
                  <span className="mt-0.5 text-xs text-[#CFC5DC]">
                    {card.subvalue}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
