'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Terminal,
  Brain,
  Award,
  Gift,
  Users,
  Layers,
} from 'lucide-react';

interface Highlight {
  id: string;
  category: string;
  title: string;
  description: string;
  badge: string;
  icon: string;
}

interface HighlightsSectionProps {
  highlights: Highlight[];
}

export function HighlightsSection({ highlights }: HighlightsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Workshop', 'AI/ML', 'Keynote', 'Interactive'];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return Sparkles;
      case 'Terminal':
        return Terminal;
      case 'Brain':
        return Brain;
      case 'Award':
        return Award;
      case 'Gift':
        return Gift;
      case 'Users':
        return Users;
      default:
        return Layers;
    }
  };

  const filteredHighlights =
    selectedCategory === 'All'
      ? highlights
      : highlights.filter(
          (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <section id="highlights" className="relative scroll-mt-24 border-t border-[#4C2A66]/30 bg-[#0B0713] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#FBBF24] uppercase">
            Curated Experiences
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            WHAT&apos;S HAPPENING AT COMMUNITY DAY
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-[#CFC5DC] sm:text-base">
            From technical deep dives to interactive competitions, every session is built to maximize practical skills.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 font-mono text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'border border-[#FBBF24] bg-[#FBBF24] text-[#090511] font-bold shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : 'border border-[#4C2A66]/60 bg-[#140D22] text-[#CFC5DC] hover:border-[#FBBF24]/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHighlights.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#4C2A66]/50 bg-[#120B1D]/80 p-6 backdrop-blur-sm transition-all hover:border-[#A855F7]/60 hover:bg-[#160E25] hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl border border-[#4C2A66]/60 bg-[#191029] text-[#FBBF24] group-hover:scale-105 transition-transform">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full border border-[#4C2A66]/80 bg-[#191029] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#E9D5FF]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white group-hover:text-[#FBBF24] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[#CFC5DC]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#4C2A66]/30 pt-4 flex items-center justify-between font-mono text-[11px] text-[#A855F7]">
                  <span>Track: {item.category}</span>
                  <span className="text-emerald-400">Confirmed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

