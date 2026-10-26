'use client';

import React, { useState } from 'react';
import { EventItem } from '@/components/cards/EventCard';
import { TimelineSection as Timeline } from '@/components/sections/Timeline';

import { PhotoGrid, GalleryPhoto } from '@/components/sections/PhotoGrid';

interface EventTabsProps {
  upcomingEvents: EventItem[];
  pastEvents: EventItem[];
  galleryPhotos: GalleryPhoto[];
}

export const EventTabs: React.FC<EventTabsProps> = ({
  upcomingEvents,
  pastEvents,
  galleryPhotos,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="w-full">
      <div className="flex justify-center mb-10">
        <div
          role="tablist"
          aria-label="Event Schedules"
          className="inline-flex p-1.5 rounded-2xl bg-[#100B18] border border-[#4C2A66]/60"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'upcoming'}
            aria-controls="panel-upcoming"
            id="tab-upcoming"
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeTab === 'upcoming'
                ? 'bg-gradient-to-r from-purple-900/60 to-purple-800/40 text-amber-300 border border-amber-300/40 shadow-[0_0_12px_rgba(253,230,138,0.15)]'
                : 'text-[#A89DB5] hover:text-white'
            }`}
          >
            Upcoming Events ({upcomingEvents.length})
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'past'}
            aria-controls="panel-past"
            id="tab-past"
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeTab === 'past'
                ? 'bg-gradient-to-r from-purple-900/60 to-purple-800/40 text-amber-300 border border-amber-300/40 shadow-[0_0_12px_rgba(253,230,138,0.15)]'
                : 'text-[#A89DB5] hover:text-white'
            }`}
          >
            Past Events & Gallery ({pastEvents.length})
          </button>
        </div>
      </div>

      <div
        id="panel-upcoming"
        role="tabpanel"
        aria-labelledby="tab-upcoming"
        hidden={activeTab !== 'upcoming'}
      >
        {upcomingEvents.length > 0 ? (
          <Timeline events={upcomingEvents} />
        ) : (
          <div className="text-center py-16 px-4 bg-[#100B18]/60 rounded-3xl border border-[#4C2A66]/40 max-w-xl mx-auto">
            <h3 className="text-base font-bold text-white mb-1">No Upcoming Events Scheduled</h3>
            <p className="text-xs text-[#A89DB5]">New workshops and hackathons will be announced shortly.</p>
          </div>
        )}
      </div>

      <div
        id="panel-past"
        role="tabpanel"
        aria-labelledby="tab-past"
        hidden={activeTab !== 'past'}
      >
        {pastEvents.length > 0 ? (
          <div className="space-y-16">
            <div>
              <h3 className="text-sm font-mono text-amber-300 uppercase tracking-widest text-center mb-6">
                Archived Sessions
              </h3>
              <Timeline events={pastEvents} />
            </div>

            {galleryPhotos.length > 0 && (
              <div className="pt-10 border-t border-[#4C2A66]/40">
                <div className="text-center mb-8">
                  <span className="text-xs font-mono text-amber-300 uppercase tracking-widest">
                    Captured Moments
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">3D Spherical Moments Gallery</h3>
                </div>
                <PhotoGrid photos={galleryPhotos} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-[#100B18]/60 rounded-3xl border border-[#4C2A66]/40 max-w-xl mx-auto">
            <h3 className="text-base font-bold text-white mb-1">No Past Event Records</h3>
            <p className="text-xs text-[#A89DB5]">Completed sessions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};