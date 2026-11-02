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

export function initials(name: string) {
  const words = name.trim().split(/\s+/);
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
}

export type JourneyState = 'done' | 'current' | 'upcoming' | 'info';

export function journeyStates(
  journey: JourneyItem[],
  reg: Pick<Registration, 'status' | 'builderId' | 'checkedInAt'>,
): JourneyState[] {
  const done = {
    registered: true,
    builder_id: Boolean(reg.builderId),
    approved: reg.status === 'approved',
    checked_in: Boolean(reg.checkedInAt),
  };
  // Nothing is "next" for a registration that was turned down.
  let currentFound = reg.status === 'rejected' || reg.status === 'cancelled';
  return journey.map(({ step }) => {
    if (step === null) return 'info';
    if (done[step]) return 'done';
    if (currentFound) return 'upcoming';
    currentFound = true;
    return 'current';
  });
}

export function interestsEditable(status: Registration['status'], startsAt: Date, now = new Date()) {
  return (status !== 'pending' && status !== 'approved') || now < startsAt;
}
