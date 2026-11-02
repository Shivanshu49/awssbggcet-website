import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Sparkles } from 'lucide-react';
import communityDayData from '@/content/community-day.json';
import { formatEventDate, formatEventTime, getEventBySlug } from '@/lib/events';
import { TwoStepRegistrationForm } from '@/components/registration/TwoStepRegistrationForm';

const eventSlug = communityDayData.slug;
const eventRecord = getEventBySlug(eventSlug);

const dateText = eventRecord ? formatEventDate(eventRecord.date) : '21 Nov 2026';
const timeText = eventRecord ? formatEventTime(eventRecord) : '10:00 AM – 4:00 PM IST';
const venueText = eventRecord ? eventRecord.venue : communityDayData.venue.name;

export const metadata: Metadata = {
  title: `Register | ${communityDayData.title}`,
  description: `Complete your official registration for ${communityDayData.title} at ${communityDayData.venue.shortName}.`,
};

export default function CommunityDayRegisterPage() {
  return (
    <div className="relative min-h-screen bg-[#090511] pt-6 pb-20 text-[#F8FAFC]">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-[#A855F7]/10 blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/community-day"
            className="inline-flex items-center gap-2 rounded-full border border-[#4C2A66]/60 bg-[#120B1D] px-4 py-2 font-mono text-xs font-semibold text-[#CFC5DC] transition-all hover:border-[#FBBF24]/50 hover:bg-[#180E28] hover:text-white"
          >
            <ArrowLeft className="size-3.5 text-[#FBBF24]" />
            <span>Back to Community Day</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-3.5 py-1 font-mono text-xs font-semibold text-[#FBBF24]">
            <Sparkles className="size-3.5" />
            <span>Official Event Registration</span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            {communityDayData.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-[#E9D5FF]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4C2A66]/60 bg-[#120B1D] px-3 py-1">
              <Calendar className="size-3.5 text-[#FBBF24]" />
              {dateText} · {timeText}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4C2A66]/60 bg-[#120B1D] px-3 py-1">
              <MapPin className="size-3.5 text-[#FBBF24]" />
              {communityDayData.venue.shortName}
            </span>
          </div>
        </div>

        {/* Two-Step Registration Form */}
        <TwoStepRegistrationForm
          eventTitle={communityDayData.title}
          eventVenue={venueText}
          eventDate={dateText}
        />
      </div>
    </div>
  );
}
