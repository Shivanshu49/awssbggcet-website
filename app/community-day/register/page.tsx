import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Ticket } from "lucide-react";

import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/components/registration/field-styles";
import { LazyRegistrationForm } from "@/components/registration/LazyRegistrationForm";
import { formatEventDate, getEventBySlug } from "@/lib/events";
import { EVENT_SLUG, eventPage } from "@/lib/registration/content";
import { turnstileReady } from "@/lib/registration/turnstile";

const event = getEventBySlug(EVENT_SLUG)!;
// No unprotected form: production without Turnstile keys stays on the closed state.
const open = eventPage.registration.open && turnstileReady;

export const metadata: Metadata = {
  title: `Register for ${event.title}`,
  description: open
    ? `Register for ${event.title}, ${formatEventDate(event.date)}, ${event.venue}.`
    : eventPage.registration.closedMessage,
};

const DETAILS = [
  { icon: Calendar, label: formatEventDate(event.date) },
  { icon: MapPin, label: event.venue },
];

const details = (
  <ul className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
    {DETAILS.map(({ icon: Icon, label }) => (
      <li
        key={label}
        className="inline-flex items-center gap-2 rounded-2xl border border-[#4C2A66]/60 bg-[#150D24] px-3.5 py-2 text-left font-mono text-xs text-[#E9D5FF]"
      >
        <Icon className="size-4 shrink-0 text-[#FBBF24]" aria-hidden="true" />
        {label}
      </li>
    ))}
  </ul>
);

export default function CommunityDayRegisterPage() {
  if (open) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-4 pb-20 text-center text-[#F8FAFC] sm:px-6 sm:pt-14">
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
          Register for {event.title}
        </h1>
        {details}
        <div className="mt-8 w-full">
          <LazyRegistrationForm />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-4 pb-20 text-center text-[#F8FAFC] sm:px-6 sm:pt-14">
      <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
        {eventPage.registration.closedMessage}
      </h1>
      <p className="mt-4 text-sm text-[#CFC5DC] sm:text-base">{event.title}</p>
      {details}
      <div className="mt-7 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
        <Link href="/pass" className={`${PRIMARY_BUTTON} w-full sm:w-auto`}>
          <Ticket className="size-4" aria-hidden="true" />
          Find my pass
        </Link>
        <Link href="/community-day" className={`${SECONDARY_BUTTON} w-full sm:w-auto`}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Community Day
        </Link>
      </div>
    </section>
  );
}
