import React from 'react';
import { EventItem, EventCard } from '@/components/cards/EventCard';

interface TimelineProps {
  events: EventItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="relative max-w-5xl mx-auto py-8">
      {/* Central Illuminated Spine */}
      <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-amber-400 via-purple-500 to-purple-900/40 shadow-[0_0_10px_rgba(168,85,247,0.3)] hidden sm:block" />

      <div className="space-y-10">
        {events.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={event.id}
              className="relative flex flex-col sm:flex-row items-center"
            >
              {/* Timeline Card Slot */}
              <div
                className={`w-full sm:w-1/2 pl-8 sm:pl-0 ${
                  isEven ? 'sm:pr-12' : 'sm:order-2 sm:pl-12'
                }`}
              >
                <EventCard event={event} />
              </div>

              {/* Central Glowing Node Marker */}
              <div className="absolute left-4 sm:left-1/2 top-8 -translate-x-1/2 w-5 h-5 rounded-full bg-[#08060D] border-2 border-amber-300 shadow-[0_0_10px_#FDE68A] hidden sm:flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              </div>

              {/* Counterbalance Spacer */}
              <div
                className={`hidden sm:block w-1/2 ${
                  isEven ? 'order-2' : 'order-1'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};