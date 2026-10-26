'use client';

import React from 'react';
import { EventItem } from '@/components/cards/EventCard';

interface TimelineSectionProps {
  events?: EventItem[];
}

export function TimelineSection({ events }: TimelineSectionProps) {
  const displayEvents = events && events.length > 0 ? events : [
    {
      title: 'Hack-Cloud GCET 2026: 24h Sprint',
      date: 'October 26, 2026',
      description: 'A 24-hour hands-on cloud hackathon building scalable serverless solutions on AWS.',
      isUpcoming: true,
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayEvents.map((event, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-[#130C22] border border-[#4C2A66]/40 hover:border-[#FBBF24]/50 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-[#FBBF24] px-2.5 py-1 rounded-md bg-[#1B1130] border border-[#FBBF24]/20">
                {event.date}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
            <p className="text-sm text-[#CFC5DC] leading-relaxed mb-6">{event.description}</p>
            <button className="font-mono text-xs font-bold text-[#0B0714] bg-[#FBBF24] hover:bg-[#F59E0B] px-4 py-2 rounded-lg transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimelineSection;