import { and, asc, eq, isNull, lt, or, sql } from 'drizzle-orm';

import type { db } from '@/lib/db'; // Type only, so scripts can import this module outside Next.js.
import { events, registrations } from '@/lib/db/schema';

type Db = typeof db;
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

// Thrown inside a transaction to roll it back; the message is safe to show an admin.
export class Refused extends Error {}
export const STALE = 'This row changed. Reload the page and try again.';
export const EVENT_FULL = 'Event full.';
export const EVENT_FULL_REFUND = 'Event full, so no seat can be restored. This payment qualifies for a refund.';

const CONTACT = {
  id: registrations.id,
  eventId: registrations.eventId,
  name: registrations.name,
  email: registrations.email,
  passCode: registrations.passCode,
  seatHeldAt: registrations.seatHeldAt,
};

// One conditional UPDATE is atomic, so a rush of sign-ups can't pass capacity.
export async function takeSeat(tx: Tx, eventId: string) {
  const [seat] = await tx
    .update(events)
    .set({ seatsTaken: sql`${events.seatsTaken} + 1` })
    .where(and(eq(events.id, eventId), or(isNull(events.capacity), lt(events.seatsTaken, events.capacity))))
    .returning({ id: events.id });
  return Boolean(seat);
}

// SKIP LOCKED: two seats released at once go to two different people.
async function promoteNext(tx: Tx, eventId: string) {
  const [next] = await tx
    .select({ id: registrations.id })
    .from(registrations)
    .where(and(eq(registrations.eventId, eventId), eq(registrations.status, 'waitlisted')))
    .orderBy(asc(registrations.createdAt), asc(registrations.id))
    .limit(1)
    .for('update', { skipLocked: true });
  if (!next) return null;
  const [row] = await tx
    .update(registrations)
    .set({ status: 'pending', seatHeldAt: sql`now()` })
    .where(eq(registrations.id, next.id))
    .returning(CONTACT);
  return row;
}

// A released seat goes straight to the oldest waitlisted person. seats_taken only drops
// when nobody is waiting, so a new sign-up can't jump the queue. Returns who got the seat.
export async function passSeatOn(tx: Tx, eventId: string) {
  const promoted = await promoteNext(tx, eventId);
  if (!promoted) {
    await tx
      .update(events)
      .set({ seatsTaken: sql`${events.seatsTaken} - 1` })
      .where(eq(events.id, eventId));
  }
  return promoted;
}

export type CancelFrom = 'pending' | 'payment_submitted' | 'approved' | 'waitlisted';

export async function cancelRow(tx: Tx, id: string, from: CancelFrom) {
  const [row] = await tx
    .update(registrations)
    .set({ status: 'cancelled' })
    .where(and(eq(registrations.id, id), eq(registrations.status, from)))
    .returning({ eventId: registrations.eventId });
  if (!row) throw new Refused(STALE);
  return from === 'waitlisted' ? null : passSeatOn(tx, row.eventId);
}

// Only for a row with no UTR: one with a UTR claims a payment, so it goes through Confirm.
// Clearing deadline_reminded_at gives the fresh clock its own reminder.
export async function restoreRow(tx: Tx, id: string) {
  const [row] = await tx
    .update(registrations)
    .set({ status: 'pending', seatHeldAt: sql`now()`, deadlineRemindedAt: null })
    .where(and(eq(registrations.id, id), eq(registrations.status, 'cancelled'), isNull(registrations.utr)))
    .returning(CONTACT);
  if (!row) throw new Refused(STALE);
  if (!(await takeSeat(tx, row.eventId))) throw new Refused(EVENT_FULL);
  return row;
}

export type ConfirmFrom = 'payment_submitted' | 'cancelled';

// builderId is what the admin saw, so a Builder ID changed in the meantime can't slip through.
export async function confirmRow(
  tx: Tx,
  { id, from, builderId, utr, admin }: { id: string; from: ConfirmFrom; builderId: string; utr: string; admin: string },
) {
  const [row] = await tx
    .update(registrations)
    .set({
      status: 'approved',
      utr,
      utrSubmittedAt: sql`coalesce(${registrations.utrSubmittedAt}, now())`,
      approvedAt: sql`now()`,
      approvedBy: admin,
    })
    .where(and(eq(registrations.id, id), eq(registrations.status, from), eq(registrations.builderId, builderId)))
    .returning({ ...CONTACT, checkinCode: registrations.checkinCode, ticketNo: registrations.ticketNo });
  if (!row) throw new Refused(STALE);
  if (from === 'cancelled' && !(await takeSeat(tx, row.eventId))) throw new Refused(EVENT_FULL_REFUND);
  return row;
}
