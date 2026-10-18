'use client';

import React from 'react';
import { EventCard, EventItem } from '@/components/cards/EventCard';

interface TimelineProps {
  events: EventItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
      {/* Responsive spine: left-aligned on mobile, centered on desktop */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-[#3B1F54] left-4 md:left-1/2 -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="space-y-10 md:space-y-12">
        {events.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={event.id || index}
              className={`relative flex flex-col md:flex-row items-start md:items-center ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Event Card Container */}
              <div className="w-full pl-8 md:pl-0 md:w-[calc(50%-2rem)]">
                <EventCard event={event} />
              </div>

              {/* Responsive Node Indicator */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 md:top-auto flex items-center justify-center pointer-events-none z-10">
                <div className="w-5 h-5 rounded-full bg-[#100B18] border-2 border-amber-400 flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.35)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                </div>
              </div>

              {/* Spacer balancing desktop alternation */}
              <div className="hidden md:block md:w-[calc(50%-2rem)]" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;