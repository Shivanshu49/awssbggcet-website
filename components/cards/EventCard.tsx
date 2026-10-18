'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import type { Event } from '@/lib/events';

// isPast and dateLabel are computed by the page; dateLabel is formatted
// server-side in lib/events so it can't drift with the viewer's locale.
export type EventItem = Event & {
  isPast?: boolean;
  dateLabel: string;
};

export const EventCard: React.FC<{ event: EventItem }> = ({ event }) => {
  return (
    <Card className="rounded-2xl bg-[#100B18] border border-[#4C2A66]/50 p-6 transition-all duration-300 hover:border-amber-400/50 hover:bg-[#140E20] flex flex-col justify-between group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="space-y-4">
        {/* Date & Category Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#211235] text-purple-200 border border-purple-500/40">
            {event.dateLabel}
          </span>
          {event.mode && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#171020] text-amber-300 border border-amber-400/30">
              {event.mode}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#F8FAFC] group-hover:text-amber-200 transition-colors leading-snug">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#A89DB5] leading-relaxed line-clamp-3">
          {event.description}
        </p>

        {/* Location */}
        <div className="flex items-center space-x-2 text-xs font-mono text-purple-300/80 pt-1">
          <svg
            className="w-4 h-4 text-amber-400 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">
            {event.venue || 'Galgotias College of Engineering & Technology'}
          </span>
        </div>
      </div>

      {/* Action / Registration CTA */}
      <div className="pt-6 mt-4 border-t border-[#4C2A66]/30">
        {!event.isPast && event.registrationUrl ? (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#6B21A8] hover:bg-[#7E22CE] text-white border border-purple-400/30 hover:border-amber-400/60 shadow-[0_0_15px_rgba(107,33,168,0.25)] transition-all"
          >
            <span>Register Now</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        ) : (
          <div className="w-full text-center py-2 text-xs font-mono text-[#A89DB5]/60 bg-[#171020]/50 rounded-xl border border-purple-900/20">
            {event.isPast ? 'Event Concluded' : 'Registration Opening Soon'}
          </div>
        )}
      </div>
    </Card>
  );
};