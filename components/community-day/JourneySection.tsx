import React from 'react';
import { Compass, UserCheck, QrCode, Sparkles } from 'lucide-react';

interface JourneyStep {
  step: string;
  title: string;
  description: string;
}

interface JourneySectionProps {
  steps: JourneyStep[];
}

export function JourneySection({ steps }: JourneySectionProps) {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return Compass;
      case 1:
        return UserCheck;
      case 2:
        return QrCode;
      case 3:
        return Sparkles;
      default:
        return Compass;
    }
  };

  return (
    <section id="journey" className="relative scroll-mt-24 border-t border-[#4C2A66]/30 bg-[#0B0713] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#A855F7] uppercase">
            Step-by-Step Guide
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            YOUR COMMUNITY DAY JOURNEY
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#CFC5DC] sm:text-base">
            Everything you need to know about registering, receiving your entry pass, and attending the conference.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => {
            const Icon = getStepIcon(index);
            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-2xl border border-[#4C2A66]/50 bg-[#120B1D]/90 p-6 backdrop-blur-sm transition-all hover:border-[#FBBF24]/50 hover:bg-[#150D24]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-[#FBBF24]">
                      {item.step}
                    </span>
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#FBBF24]/10 text-[#FBBF24]">
                      <Icon className="size-4" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[#CFC5DC]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#4C2A66]/30 pt-3">
                  <span className="font-mono text-[10px] text-[#A855F7] uppercase tracking-wider">
                    {index < 2 ? 'Before The Day' : 'On Event Day'}
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

