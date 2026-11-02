import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";

import site from "@/content/site.json";
import { formatEventDate, formatEventTime, getEventBySlug } from "@/lib/events";

// Non-null on purpose: this page is static, so a removed or renamed entry fails
// the build instead of shipping a 404 for the flagship event.
const event = getEventBySlug("aws-student-community-day-2026")!;
const dateLabel = formatEventDate(event.date);
const timeLabel = formatEventTime(event);

const description = `${event.description} ${dateLabel}, ${timeLabel}, ${event.venue}.`;

export const metadata: Metadata = {
  // Relative image URLs need a base, or share previews point at localhost.
  metadataBase: new URL("https://www.awssbggcet.com"),
  title: event.title,
  description,
  openGraph: {
    type: "website",
    siteName: site.clubName,
    title: event.title,
    description,
    locale: "en_IN",
    images: [{ url: "/events/aws-community-day-banner.jpg", alt: event.title }],
  },
};

const DETAILS = [
  { icon: Calendar, label: dateLabel },
  { icon: Clock, label: timeLabel },
  { icon: MapPin, label: event.venue },
];

export default function CommunityDayPage() {
  return (
    <div className="text-[#F8FAFC]">
      {/* Everything in this section has to fit above the fold on a phone. */}
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-4 pb-14 text-center sm:px-6 sm:pt-14 sm:pb-20">
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
          {event.title}
        </h1>
        <ul className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
          {DETAILS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#4C2A66]/60 bg-[#150D24] px-3.5 py-2 text-left font-mono text-xs text-[#E9D5FF]"
            >
              <Icon
                className="size-4 shrink-0 text-[#FBBF24]"
                aria-hidden="true"
              />
              {label}
            </li>
          ))}
        </ul>
        <Link
          href={event.registrationUrl}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#FBBF24] px-8 py-4 text-sm font-bold text-[#090511] uppercase shadow-[0_0_30px_rgba(251,191,36,0.45)] transition-all hover:bg-amber-300"
        >
          Register Now
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      <section
        aria-labelledby="about-heading"
        className="border-t border-[#4C2A66]/30 bg-[#0B0713] px-4 py-14 sm:px-6"
      >
        <div className="mx-auto max-w-3xl">
          <h2 id="about-heading" className="text-2xl font-bold sm:text-3xl">
            About the event
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#CFC5DC] sm:text-base">
            {event.description}
          </p>
        </div>
      </section>
    </div>
  );
}
