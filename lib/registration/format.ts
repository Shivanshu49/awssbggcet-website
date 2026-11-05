import type { Registration } from '@/lib/db/schema';

import type { JourneyItem } from './content';

// The link may get forwarded, so contact details are never shown in full.
export function maskEmail(email: string) {
  const [local, domain] = email.split('@');
  return `${local.slice(0, Math.min(2, Math.max(local.length - 1, 1)))}****@${domain}`;
}

export function maskPhone(phone: string) {
  return `${phone.slice(0, 2)}•••••${phone.slice(-3)}`;
}

export function maskUtr(utr: string) {
  return `••••••••${utr.slice(-4)}`;
}

export function initials(name: string) {
  const words = name.trim().split(/\s+/);
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
}

export const SEAT_HOLD_HOURS = 48;
export const SEAT_RULE = 'Add your Builder ID and pay within 48 hours, or the seat goes to the waitlist.';

export function seatDeadline(seatHeldAt: Date) {
  return new Date(seatHeldAt.getTime() + SEAT_HOLD_HOURS * 3_600_000);
}

const deadlineFormat = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatDeadline(deadline: Date) {
  return `${deadlineFormat.format(deadline)} IST`;
}

export type JourneyState = 'done' | 'current' | 'upcoming' | 'info';

export function journeyStates(
  journey: JourneyItem[],
  reg: Pick<Registration, 'status' | 'builderId' | 'utr' | 'checkedInAt'>,
): JourneyState[] {
  const done = {
    registered: true,
    builder_id: Boolean(reg.builderId),
    paid: Boolean(reg.utr),
    approved: reg.status === 'approved',
    checked_in: Boolean(reg.checkedInAt),
  };
  // Nothing is "next" for a registration that was turned down.
  let currentFound = reg.status === 'rejected' || reg.status === 'cancelled';
  return journey.map(({ step }) => {
    if (step === null) return 'info';
    if (done[step]) return 'done';
    // Paying needs a seat, so it can't be the next step for someone on the waitlist.
    if (step === 'paid' && reg.status === 'waitlisted') currentFound = true;
    if (currentFound) return 'upcoming';
    currentFound = true;
    return 'current';
  });
}

export function interestsEditable(status: Registration['status'], startsAt: Date, now = new Date()) {
  return ['pending', 'payment_submitted', 'approved', 'waitlisted'].includes(status) && now < startsAt;
}
