import React from 'react';
import { EventTabs } from '@/components/sections/EventTabs';
import { getUpcoming, getPast } from '@/lib/events';

export const metadata = {
  title: 'Events | AWS Student Builder Group GCET',
  description: 'Explore upcoming workshops, hackathons, and technical bootcamps at GCET.',
};

export default async function EventsPage() {
  const upcomingRaw = await getUpcoming();
  const pastRaw = await getPast();

  const upcomingEvents = (upcomingRaw || []).map((e: any) => ({
    id: String(e.id),
    title: e.title,
    date: e.date,
    category: e.category,
    description: e.description,
    location: e.location,
    featured: Boolean(e.featured),
    registrationUrl: e.registrationUrl,
    imageUrl: e.imageUrl,
    isPast: false,
  }));

  const pastEvents = (pastRaw || []).map((e: any) => ({
    id: String(e.id),
    title: e.title,
    date: e.date,
    category: e.category,
    description: e.description,
    location: e.location,
    featured: false,
    registrationUrl: e.registrationUrl,
    imageUrl: e.imageUrl,
    isPast: true,
  }));

  return (
    <main className="min-h-screen bg-[#08060D] text-[#F8FAFC] py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#171020] border border-amber-300/40 mb-4 shadow-[0_0_12px_rgba(253,230,138,0.15)]">
            <span className="w-2 h-2 rounded-full bg-amber-300" />
            <span className="text-xs font-mono text-amber-200">
              Community Calendar
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Events & Flagship Initiatives
          </h1>
          <p className="text-xs sm:text-sm text-[#A89DB5] leading-relaxed">
            Hands-on technical bootcamps, solution challenges, and architectural sessions
            hosted for students across Galgotias College of Engineering & Technology.
          </p>
        </div>

        <EventTabs
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
          galleryPhotos={[]}
        />
      </div>
    </main>
  );
}