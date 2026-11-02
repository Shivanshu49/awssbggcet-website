import { eq } from 'drizzle-orm';
import { Calendar, Check, Download, Lock, Ticket } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BuilderIdForm } from '@/components/registration/BuilderIdForm';
import { EventFaq, EventSchedule } from '@/components/registration/EventInfo';
import { CARD, CARD_TITLE, SECONDARY_BUTTON } from '@/components/registration/field-styles';
import { InterestsForm } from '@/components/registration/InterestsForm';
import site from '@/content/site.json';
import { db } from '@/lib/db';
import { events, registrations, type Registration } from '@/lib/db/schema';
import { formatEventDate, getEventBySlug } from '@/lib/events';
import { EVENT_SLUG, eventPage, type JourneyItem } from '@/lib/registration/content';
import {
  initials,
  interestsEditable,
  journeyStates,
  maskEmail,
  maskPhone,
  type JourneyState,
} from '@/lib/registration/format';
import { passCodeSchema } from '@/lib/registration/validation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your pass',
  robots: { index: false, follow: false },
  referrer: 'no-referrer', // The code must never leak through the Referer header to outside links.
};

const BADGES: Record<Registration['status'], { label: string; className: string }> = {
  pending: { label: 'PENDING APPROVAL', className: 'border-[#FBBF24]/50 bg-[#FBBF24]/10 text-[#FBBF24]' },
  approved: { label: 'PASS ISSUED', className: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300' },
  waitlisted: { label: 'WAITLISTED', className: 'border-[#A855F7]/60 bg-[#A855F7]/10 text-[#D8B4FE]' },
  rejected: { label: 'NOT APPROVED', className: 'border-red-500/50 bg-red-950/40 text-red-300' },
  cancelled: { label: 'NOT APPROVED', className: 'border-red-500/50 bg-red-950/40 text-red-300' },
};

const PHASES: { phase: JourneyItem['phase']; label: string }[] = [
  { phase: 'before', label: 'BEFORE THE DAY' },
  { phase: 'venue', label: 'AT THE VENUE' },
];

function JourneyMarker({ state }: { state: JourneyState }) {
  if (state === 'done') {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#FBBF24] text-[#090511]">
        <Check className="size-3.5" aria-hidden="true" />
        <span className="sr-only">Done:</span>
      </span>
    );
  }
  if (state === 'current') {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-[#FBBF24]">
        <span className="size-2 rounded-full bg-[#FBBF24]" />
        <span className="sr-only">Next:</span>
      </span>
    );
  }
  return <span className="ml-1.5 mt-1.5 size-2 shrink-0 rounded-full bg-[#4C2A66]" aria-hidden="true" />;
}

function Journey({ reg }: { reg: Registration }) {
  const { journey } = eventPage;
  if (!journey.length) return null;
  const states = journeyStates(journey, reg);
  return (
    <section aria-labelledby="journey-heading" className={CARD}>
      <h2 id="journey-heading" className={CARD_TITLE}>
        Your journey
      </h2>
      {PHASES.map(({ phase, label }) => {
        const items = journey.map((item, i) => ({ ...item, state: states[i] })).filter((item) => item.phase === phase);
        if (!items.length) return null;
        return (
          <div key={phase} className="mt-5">
            <p className="font-mono text-[10px] font-bold tracking-wider text-amber-400/80">{label}</p>
            <ol className="mt-3 flex flex-col gap-3">
              {items.map(({ title, body, state }) => (
                <li
                  key={title}
                  data-state={state}
                  aria-current={state === 'current' ? 'step' : undefined}
                  className="flex items-start gap-3"
                >
                  <JourneyMarker state={state} />
                  <div className="min-w-0">
                    <p className={`text-sm ${state === 'upcoming' || state === 'info' ? 'text-[#A89DB5]' : 'font-semibold text-white'}`}>
                      {title}
                    </p>
                    {body && <p className="mt-0.5 text-xs leading-relaxed text-[#A89DB5]">{body}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </section>
  );
}

function QrBlock({ code, reg, missingBuilderId }: { code: string; reg: Registration; missingBuilderId: boolean }) {
  if (reg.status === 'approved') {
    return (
      <section aria-labelledby="qr-heading" className={`${CARD} flex flex-col items-center text-center`}>
        <h2 id="qr-heading" className={CARD_TITLE}>
          QR pass
        </h2>
        <Image
          src={`/pass/${code}/qr.png`}
          alt="Your entry QR code"
          width={224}
          height={224}
          unoptimized
          className="mt-4 rounded-xl bg-white p-2"
        />
        <p className="mt-3 font-mono text-sm tracking-widest text-[#FBBF24]">{reg.ticketNo}</p>
        <a href={`/pass/${code}/qr.png`} download={`pass-${reg.ticketNo}.png`} className={`${SECONDARY_BUTTON} mt-4`}>
          <Download className="size-4" aria-hidden="true" />
          Download QR
        </a>
      </section>
    );
  }
  if (reg.status === 'pending') {
    return (
      <section aria-labelledby="qr-heading" className={`${CARD} flex flex-col items-center py-8 text-center`}>
        <h2 id="qr-heading" className={CARD_TITLE}>
          QR pass
        </h2>
        <Lock className="mt-4 size-8 text-[#4C2A66]" aria-hidden="true" />
        <p className="mt-3 text-sm text-[#CFC5DC]">
          {missingBuilderId ? 'Add your Builder ID' : 'Your QR appears here once approved'}
        </p>
      </section>
    );
  }
  return (
    <section className={CARD}>
      <p className="text-sm leading-relaxed text-[#CFC5DC]">
        {reg.status === 'waitlisted'
          ? "You're on the waitlist. Your QR appears here if a seat opens up."
          : "This registration wasn't approved."}{' '}
        Questions? Email{' '}
        <a href={`mailto:${site.email}`} className="text-[#FBBF24] underline-offset-2 hover:underline">
          {site.email}
        </a>
        .
      </p>
    </section>
  );
}

export default async function PassPage({ params }: { params: Promise<{ code: string }> }) {
  // Unknown code: the normal 404. Never say whether a code exists.
  const code = passCodeSchema.safeParse((await params).code);
  if (!code.success) notFound();

  const [row] = await db
    .select({ reg: registrations, startsAt: events.startsAt })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(registrations.passCode, code.data))
    .limit(1);
  if (!row) notFound();

  const { reg, startsAt } = row;
  const event = getEventBySlug(EVENT_SLUG)!;
  const { registration, workshops, schedule } = eventPage;
  const badge = BADGES[reg.status];
  const missingBuilderId = registration.builderIdRequired && !reg.builderId;
  const builderIdEditable = reg.status === 'pending' || reg.status === 'waitlisted';
  const notApproved = reg.status === 'rejected' || reg.status === 'cancelled';
  const hasSideColumn = schedule.length > 0;

  const builderIdForm = (
    <BuilderIdForm
      code={code.data}
      initial={reg.builderId}
      signupUrl={registration.builderIdSignupUrl}
      required={registration.builderIdRequired}
    />
  );

  return (
    <div
      className={`mx-auto grid gap-5 px-4 pt-4 pb-20 text-[#F8FAFC] sm:px-6 sm:pt-10 ${
        hasSideColumn ? 'max-w-5xl lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start' : 'max-w-3xl'
      }`}
    >
      <div className="flex min-w-0 flex-col gap-5">
        {builderIdEditable && missingBuilderId && builderIdForm}

        <section aria-label="Pass details" className={`${CARD} flex flex-wrap items-start gap-4`}>
          <span
            aria-hidden="true"
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#FBBF24] text-lg font-black text-[#090511]"
          >
            {initials(reg.name)}
          </span>
          <div className="min-w-0 flex-1 basis-52">
            <h1 className="text-xl font-bold break-words text-white sm:text-2xl">{reg.name}</h1>
            <p className="mt-0.5 text-sm break-words text-[#CFC5DC]">{reg.college}</p>
            <p className="mt-0.5 text-xs text-[#A89DB5]">
              {maskEmail(reg.email)} · {maskPhone(reg.phone)}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-xs text-[#E9D5FF]">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5 text-[#FBBF24]" aria-hidden="true" />
                {formatEventDate(event.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Ticket className="size-3.5 text-[#FBBF24]" aria-hidden="true" />
                {reg.ticketNo}
              </span>
            </div>
          </div>
          <span className={`rounded-full border px-3 py-1.5 font-mono text-[10px] font-bold tracking-wide ${badge.className}`}>
            {badge.label}
          </span>
        </section>

        {builderIdEditable && !missingBuilderId && builderIdForm}
        {reg.status === 'approved' && reg.builderId && (
          <section aria-labelledby="builder-id-heading" className={CARD}>
            <h2 id="builder-id-heading" className={CARD_TITLE}>
              AWS Builder ID
            </h2>
            <p className="mt-2 font-mono text-sm text-[#E9D5FF]">{reg.builderId}</p>
          </section>
        )}

        <QrBlock code={code.data} reg={reg} missingBuilderId={missingBuilderId} />

        {workshops.length > 0 && !notApproved && (
          <InterestsForm
            code={code.data}
            workshops={workshops}
            initialInterests={reg.interests}
            initialNote={reg.interestsNote}
            editable={interestsEditable(reg.status, startsAt)}
          />
        )}

        <EventFaq />
        <Journey reg={reg} />

        <p className="text-center text-xs text-[#A89DB5]">
          Bookmark this page — it&apos;s your pass. Lost it?{' '}
          <Link href="/pass" className="font-semibold text-[#FBBF24] underline-offset-2 hover:underline">
            Find my pass
          </Link>
          .
        </p>
      </div>

      {hasSideColumn && <EventSchedule className="lg:sticky lg:top-24" />}
    </div>
  );
}
