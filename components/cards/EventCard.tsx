import React from 'react';
import Image from 'next/image';
import { MapPin, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  location: string;
  featured?: boolean;
  registrationUrl?: string;
  imageUrl?: string;
  isPast?: boolean;
}

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card
      className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        event.featured && !event.isPast
          ? 'bg-gradient-to-br from-[#1b1226] to-[#120b1c] border-amber-400/60 shadow-[0_0_24px_rgba(251,191,36,0.12)]'
          : 'bg-[#100B18]/90 border-[#4C2A66]/50 hover:border-purple-400/50 hover:bg-[#171020]'
      }`}
    >
      {event.featured && !event.isPast && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-300 via-purple-400 to-amber-300" />
      )}

      {event.imageUrl && (
        <div className="relative w-full h-44 overflow-hidden bg-[#171020]">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100B18] via-transparent to-transparent opacity-80" />
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full border ${
                event.featured && !event.isPast
                  ? 'bg-amber-950/40 text-amber-300 border-amber-400/40'
                  : 'bg-purple-950/40 text-purple-300 border-purple-500/30'
              }`}
            >
              {event.date}
            </span>
            <span className="text-[11px] font-mono text-[#A89DB5] tracking-wide">
              {event.category}
            </span>
          </div>

          <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight group-hover:text-amber-200 transition-colors mb-2">
            {event.title}
          </h3>

          <p className="text-xs text-[#A89DB5] leading-relaxed line-clamp-3 mb-4">
            {event.description}
          </p>
        </div>

        <div>
          <div className="flex items-center text-xs text-purple-300/80 mb-5 gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          {event.isPast ? (
            <div className="inline-flex items-center text-xs font-mono text-[#A89DB5] py-2">
              Event Concluded
            </div>
          ) : event.registrationUrl ? (
            <Button
              asChild
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all ${
                event.featured
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                  : 'bg-purple-600/80 hover:bg-purple-500 text-white border border-purple-400/30'
              }`}
            >
              <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                <span>Register Now</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </Button>
          ) : (
            <Button
              disabled
              variant="outline"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#A89DB5] bg-[#171020] border-[#4C2A66]/40 cursor-not-allowed"
            >
              Registration Opening Soon
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};