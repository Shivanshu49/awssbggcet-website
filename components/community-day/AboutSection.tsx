import React from 'react';
import { Sparkles, Terminal, Rocket, Users } from 'lucide-react';

interface AboutSectionProps {
  badge: string;
  heading: string;
  paragraphs: string[];
}

export function AboutSection({ badge, heading, paragraphs }: AboutSectionProps) {
  return (
    <section id="about" className="relative scroll-mt-24 border-t border-[#4C2A66]/30 bg-[#0B0713] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left: Text and Overview */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#A855F7]/40 bg-[#A855F7]/10 px-3.5 py-1 text-xs font-mono font-medium text-[#E9D5FF]">
              <Sparkles className="size-3.5 text-[#FBBF24]" />
              <span>{badge}</span>
            </div>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-4xl">
              {heading}
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#CFC5DC] sm:text-base">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* Right: Key Stats / Value Pillars */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-[#4C2A66]/60 bg-[#120B1D] p-5 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#FBBF24]/10 text-[#FBBF24]">
                    <Terminal className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Student Driven</h3>
                    <p className="text-xs text-[#CFC5DC]">Designed by students, for students</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#4C2A66]/60 bg-[#120B1D] p-5 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#A855F7]/10 text-[#A855F7]">
                    <Rocket className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Real-world Cloud</h3>
                    <p className="text-xs text-[#CFC5DC]">Practical architecture over abstract slides</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#4C2A66]/60 bg-[#120B1D] p-5 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Open to All Colleges</h3>
                    <p className="text-xs text-[#CFC5DC]">Welcoming learners across Delhi NCR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

