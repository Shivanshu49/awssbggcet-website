import type { Metadata } from 'next';
import communityDayData from '@/content/community-day.json';
import site from '@/content/site.json';
import { formatEventDate, formatEventTime, getEventBySlug } from '@/lib/events';
import { StickyNav } from '@/components/community-day/StickyNav';
import { HeroSection } from '@/components/community-day/HeroSection';
import { AboutSection } from '@/components/community-day/AboutSection';
import { PillarsSection } from '@/components/community-day/PillarsSection';
import { HighlightsSection } from '@/components/community-day/HighlightsSection';
import { ScheduleSection } from '@/components/community-day/ScheduleSection';
import { JourneySection } from '@/components/community-day/JourneySection';
import { FaqSection } from '@/components/community-day/FaqSection';
import { FinalCta } from '@/components/community-day/FinalCta';

const eventSlug = communityDayData.slug;
const eventRecord = getEventBySlug(eventSlug);

const dateText = eventRecord ? formatEventDate(eventRecord.date) : '21 Nov 2026';
const timeText = eventRecord ? formatEventTime(eventRecord) : '10:00 AM – 4:00 PM IST';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.awssbggcet.com'),
  title: `${communityDayData.title} | ${communityDayData.theme}`,
  description: communityDayData.hero.description,
  openGraph: {
    type: 'website',
    siteName: site.clubName,
    title: communityDayData.title,
    description: communityDayData.hero.description,
    locale: 'en_IN',
    images: [{ url: '/events/aws-community-day-banner.jpg', alt: communityDayData.title }],
  },
};

export default function CommunityDayPage() {
  return (
    <div className="relative min-h-screen bg-[#090511] text-[#F8FAFC]">
      {/* Sticky Secondary Navigation Bar */}
      <StickyNav registrationUrl={communityDayData.registrationUrl} />

      {/* Hero Section */}
      <HeroSection
        eyebrow={communityDayData.hero.eyebrow}
        headline={communityDayData.hero.headline}
        subheading={communityDayData.hero.subheading}
        description={communityDayData.hero.description}
        registrationUrl={communityDayData.registrationUrl}
        factCards={communityDayData.hero.factCards}
      />

      {/* About Community Day Section */}
      <AboutSection
        badge={communityDayData.aboutEvent.badge}
        heading={communityDayData.aboutEvent.heading}
        paragraphs={communityDayData.aboutEvent.paragraphs}
      />

      {/* Learn, Build, Connect Pillars Section */}
      <PillarsSection pillars={communityDayData.communityPillars} />

      {/* Curated Highlights Section */}
      <HighlightsSection highlights={communityDayData.highlights} />

      {/* Confirmed Schedule & Timeline Section */}
      <ScheduleSection agenda={communityDayData.agenda} date={dateText} />

      {/* Attendee Journey Section */}
      <JourneySection steps={communityDayData.attendeeJourney} />

      {/* FAQs Section */}
      <FaqSection faqs={communityDayData.faqs} />

      {/* Final Call to Action */}
      <FinalCta
        registrationUrl={communityDayData.registrationUrl}
        venueName={communityDayData.venue.shortName}
        dateText={`${dateText} · ${timeText}`}
      />
    </div>
  );
}
