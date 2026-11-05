import { and, asc, eq, isNotNull, isNull, lt, lte, or, sql } from 'drizzle-orm';

import type { db } from '@/lib/db'; // Type only, so scripts can import this module outside Next.js.
import { events, registrations } from '@/lib/db/schema';

import { SEAT_HOLD_HOURS } from './format';

type Db = typeof db;
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

// Thrown inside a transaction to roll it back; the message is safe to show an admin.
export class Refused extends Error {}
export const STALE = 'This row changed. Reload the page and try again.';
export const EVENT_FULL = 'Event full.';
export const EVENT_FULL_REFUND = 'Event full, so no seat can be restored. This payment qualifies for a refund.';

const REMINDER_AFTER_HOURS = 24;

const CONTACT = {
  id: registrations.id,
  eventId: registrations.eventId,
  name: registrations.name,
  email: registrations.email,
  passCode: registrations.passCode,
  seatHeldAt: registrations.seatHeldAt,
};

type Contact = {
  id: string;
  eventId: string;
  name: string;
  email: string;
  passCode: string;
  seatHeldAt: Date | null;
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
async function lockNextWaiting(tx: Tx, eventId: string) {
  const [next] = await tx
    .select({ id: registrations.id })
    .from(registrations)
    .where(and(eq(registrations.eventId, eventId), eq(registrations.status, 'waitlisted')))
    .orderBy(asc(registrations.createdAt), asc(registrations.id))
    .limit(1)
    .for('update', { skipLocked: true });
  return next?.id ?? null;
}

async function promote(tx: Tx, id: string) {
  const [row] = await tx
    .update(registrations)
    .set({ status: 'pending', seatHeldAt: sql`now()` })
    .where(eq(registrations.id, id))
    .returning(CONTACT);
  return row;
}

// A released seat goes straight to the oldest waitlisted person. seats_taken only drops
// when nobody is waiting, so a new sign-up can't jump the queue. Returns who got the seat.
export async function passSeatOn(tx: Tx, eventId: string) {
  const next = await lockNextWaiting(tx, eventId);
  if (next) return promote(tx, next);
  await tx
    .update(events)
    .set({ seatsTaken: sql`${events.seatsTaken} - 1` })
    .where(eq(events.id, eventId));
  return null;
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

// Needs status = pending, as the 48-hour release does, so exactly one of them wins.
export async function submitUtr(
  database: Db,
  { passCode, utr, payerName }: { passCode: string; utr: string; payerName: string },
) {
  const rows = await database
    .update(registrations)
    .set({ status: 'payment_submitted', utr, payerName, utrSubmittedAt: sql`now()` })
    .where(
      and(
        eq(registrations.passCode, passCode),
        eq(registrations.status, 'pending'),
        isNotNull(registrations.builderId),
      ),
    )
    .returning({ id: registrations.id });
  return rows.length > 0;
}

const pastHours = (hours: number) => sql`now() - make_interval(hours => ${hours})`;

// Cancelled, not waitlisted: the queue is ordered by created_at, so they'd go straight back to the front.
async function releaseExpired(database: Db, eventId: string) {
  const expired = await database
    .select({ id: registrations.id })
    .from(registrations)
    .where(
      and(
        eq(registrations.eventId, eventId),
        eq(registrations.status, 'pending'),
        lt(registrations.seatHeldAt, pastHours(SEAT_HOLD_HOURS)),
      ),
    );

  const released: Contact[] = [];
  const promoted: Contact[] = [];
  for (const { id } of expired) {
    await database.transaction(async (tx) => {
      const [row] = await tx
        .update(registrations)
        .set({ status: 'cancelled' })
        .where(
          and(
            eq(registrations.id, id),
            eq(registrations.status, 'pending'),
            lt(registrations.seatHeldAt, pastHours(SEAT_HOLD_HOURS)),
          ),
        )
        .returning(CONTACT);
      if (!row) return; // They paid, or another run got here first.
      released.push(row);
      const next = await passSeatOn(tx, eventId);
      if (next) promoted.push(next);
    });
  }
  return { released, promoted };
}

// Free seats alongside a waitlist only happen when capacity is raised. Stops when either runs out.
async function fillFreeSeats(database: Db, eventId: string) {
  const promoted: Contact[] = [];
  for (;;) {
    const row = await database.transaction(async (tx) => {
      const next = await lockNextWaiting(tx, eventId);
      if (!next || !(await takeSeat(tx, eventId))) return null;
      return promote(tx, next);
    });
    if (!row) return promoted;
    promoted.push(row);
  }
}

// The UPDATE claims each row before anything is sent, so overlapping runs can't send twice.
function claimDeadlineReminders(database: Db, eventId: string) {
  return database
    .update(registrations)
    .set({ deadlineRemindedAt: sql`now()` })
    .where(
      and(
        eq(registrations.eventId, eventId),
        eq(registrations.status, 'pending'),
        lte(registrations.seatHeldAt, pastHours(REMINDER_AFTER_HOURS)),
        isNull(registrations.deadlineRemindedAt),
      ),
    )
    .returning({ ...CONTACT, builderId: registrations.builderId });
}

// Releases run first, so nobody being released also gets a reminder.
export async function runHourlyJob(database: Db, eventId: string) {
  const { released, promoted } = await releaseExpired(database, eventId);
  const filled = await fillFreeSeats(database, eventId);
  const reminded = await claimDeadlineReminders(database, eventId);
  return { released, promoted: [...promoted, ...filled], reminded };
}
