import React from 'react';
import { BookOpen, Hammer, Share2, ArrowRight } from 'lucide-react';

interface Pillar {
  key: string;
  title: string;
  description: string;
  badge: string;
}

interface PillarsSectionProps {
  pillars: Pillar[];
}

export function PillarsSection({ pillars }: PillarsSectionProps) {
  const getIcon = (key: string) => {
    switch (key) {
      case 'LEARN':
        return BookOpen;
      case 'BUILD':
        return Hammer;
      case 'CONNECT':
        return Share2;
      default:
        return BookOpen;
    }
  };

  const getAccent = (key: string) => {
    switch (key) {
      case 'LEARN':
        return {
          badge: 'border-[#FBBF24]/30 bg-[#FBBF24]/10 text-[#FBBF24]',
          iconBg: 'bg-[#FBBF24]/10 text-[#FBBF24]',
          borderHover: 'hover:border-[#FBBF24]/60',
        };
      case 'BUILD':
        return {
          badge: 'border-[#A855F7]/30 bg-[#A855F7]/10 text-[#A855F7]',
          iconBg: 'bg-[#A855F7]/10 text-[#A855F7]',
          borderHover: 'hover:border-[#A855F7]/60',
        };
      case 'CONNECT':
        return {
          badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
          iconBg: 'bg-emerald-500/10 text-emerald-400',
          borderHover: 'hover:border-emerald-500/60',
        };
      default:
        return {
          badge: 'border-white/20 bg-white/5 text-white',
          iconBg: 'bg-white/10 text-white',
          borderHover: 'hover:border-white/40',
        };
    }
  };

  return (
    <section id="pillars" className="relative scroll-mt-24 border-t border-[#4C2A66]/30 bg-[#090511] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#A855F7] uppercase">
            Our Core Methodology
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            A COMMUNITY BUILT FOR BUILDERS
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-[#CFC5DC] sm:text-base">
            Three interconnected pillars designed to take you from foundational concepts to real-world cloud deployment.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = getIcon(pillar.key);
            const style = getAccent(pillar.key);

            return (
              <div
                key={pillar.key}
                className={`group relative flex flex-col justify-between rounded-2xl border border-[#4C2A66]/50 bg-[#120B1D]/90 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${style.borderHover} hover:shadow-[0_0_30px_rgba(76,42,102,0.3)]`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-black text-white tracking-widest">
                      {pillar.key}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${style.badge}`}>
                      {pillar.badge}
                    </span>
                  </div>

                  <div className={`mt-6 flex size-12 items-center justify-center rounded-xl ${style.iconBg} transition-transform group-hover:scale-110`}>
                    <Icon className="size-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-white">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#CFC5DC]">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-1.5 font-mono text-xs font-medium text-[#A855F7] transition-colors group-hover:text-white">
                  <span>Explore tracks</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

