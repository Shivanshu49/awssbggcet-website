import React from 'react';
import { Clock, Calendar } from 'lucide-react';

interface AgendaItem {
  time: string;
  title: string;
  description: string;
  tag: string;
  type: string;
}

interface ScheduleSectionProps {
  agenda: AgendaItem[];
  date: string;
}

export function ScheduleSection({ agenda, date }: ScheduleSectionProps) {
  const getDotColor = (type: string) => {
    switch (type) {
      case 'keynote':
        return 'bg-[#FBBF24] border-[#FBBF24]/50 text-[#FBBF24]';
      case 'workshop':
        return 'bg-[#A855F7] border-[#A855F7]/50 text-[#A855F7]';
      case 'break':
        return 'bg-emerald-400 border-emerald-400/50 text-emerald-400';
      case 'interactive':
        return 'bg-amber-400 border-amber-400/50 text-amber-400';
      default:
        return 'bg-purple-400 border-purple-400/50 text-purple-400';
    }
  };

  return (
    <section id="schedule" className="relative scroll-mt-24 border-t border-[#4C2A66]/30 bg-[#090511] py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-3.5 py-1 font-mono text-xs font-semibold text-[#FBBF24]">
            <Calendar className="size-3.5" />
            <span>Event Timeline · {date}</span>
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            SCHEDULE &amp; AGENDA
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#CFC5DC] sm:text-base">
            A comprehensive, single-day track engineered for deep technical learning and high-energy community engagement.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-14 border-l border-[#4C2A66]/60 pl-6 sm:pl-8 space-y-8">
          {agenda.map((item, index) => {
            const dotStyle = getDotColor(item.type);
            return (
              <div key={index} className="group relative">
                {/* Timeline Node Icon */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 flex size-4 items-center justify-center rounded-full border-2 bg-[#090511] ${dotStyle}`}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                </div>

                {/* Content Card */}
                <div className="rounded-2xl border border-[#4C2A66]/50 bg-[#120B1D]/80 p-5 backdrop-blur-sm transition-all hover:border-[#A855F7]/60 hover:bg-[#150E24]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#FBBF24]">
                      <Clock className="size-3.5" />
                      <span>{item.time}</span>
                    </div>
                    <span className="rounded-full border border-[#4C2A66] bg-[#1A112B] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#E9D5FF]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-white group-hover:text-[#FBBF24] transition-colors sm:text-lg">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[#CFC5DC] sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

