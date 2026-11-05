// Usage: DATABASE_URL=postgres://postgres@127.0.0.1:55432/scd pnpm check:seats
// Section 7's seat rules, run on real transactions. Local Postgres only: it never loads .env.local,
// and it refuses any other host. It uses its own event rows and deletes them afterwards.
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';

import { eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '../lib/db/schema';
import { dbSsl } from '../lib/db/ssl';
import { cancelRow, confirmRow, EVENT_FULL, EVENT_FULL_REFUND, Refused, restoreRow, STALE, takeSeat, type Tx } from '../lib/registration/seats';

const { events, registrations } = schema;

const url = process.env.DATABASE_URL ?? '';
if (!url || dbSsl(url) !== false) {
  console.error('check:seats only runs against a local Postgres. Set DATABASE_URL to one.');
  process.exit(1);
}

const client = postgres(url, { prepare: false, max: 8, ssl: false });
const db = drizzle(client, { schema });
const eventIds: string[] = [];

async function newEvent(capacity: number | null, seatsTaken = 0) {
  const [row] = await db
    .insert(events)
    .values({ slug: `check-${randomBytes(6).toString('hex')}`, title: 'Check', startsAt: new Date(), mode: 'offline', capacity, seatsTaken })
    .returning({ id: events.id });
  eventIds.push(row.id);
  return row.id;
}

let clock = Date.parse('2026-11-01T00:00:00Z');
async function person(eventId: string, status: schema.Registration['status'], extra: Partial<schema.NewRegistration> = {}) {
  const code = randomBytes(8).toString('hex');
  const [row] = await db
    .insert(registrations)
    .values({
      eventId,
      name: code,
      email: `${code}@example.test`,
      phone: '9812345210',
      college: 'GCET',
      yearOfStudy: '2nd',
      status,
      passCode: code,
      checkinCode: `c${code}`,
      ticketNo: code.slice(0, 8),
      consentVersion: 'v1',
      consentedAt: new Date(),
      createdAt: new Date((clock += 1000)), // A fixed order, so "oldest first" is testable.
      ...extra,
    })
    .returning({ id: registrations.id });
  return row.id;
}

const seats = async (eventId: string) =>
  (await db.select({ n: events.seatsTaken }).from(events).where(eq(events.id, eventId)))[0].n;
const rowOf = async (id: string) => (await db.select().from(registrations).where(eq(registrations.id, id)))[0];
const inTx = <T>(fn: (tx: Tx) => Promise<T>) => db.transaction(fn as never) as Promise<T>;
const refusedWith = (message: string) => (err: unknown) => err instanceof Refused && err.message === message;

async function main() {
  // A released seat goes to the oldest waitlisted person, and seats_taken doesn't move.
  let event = await newEvent(1, 1);
  const holder = await person(event, 'pending', { seatHeldAt: new Date() });
  const older = await person(event, 'waitlisted', { builderId: `b${randomBytes(4).toString('hex')}` });
  const newer = await person(event, 'waitlisted');
  const promoted = await inTx((tx) => cancelRow(tx, holder, 'pending'));
  assert.equal(promoted?.id, older, 'oldest first');
  assert.equal((await rowOf(older)).status, 'pending');
  assert.ok((await rowOf(older)).seatHeldAt, 'promotion starts the clock');
  assert.equal((await rowOf(newer)).status, 'waitlisted');
  assert.equal((await rowOf(holder)).status, 'cancelled');
  assert.equal(await seats(event), 1, 'the seat changed hands');

  // Someone promoted without a Builder ID still gets a clock.
  const second = await inTx((tx) => cancelRow(tx, older, 'pending'));
  assert.equal(second?.id, newer);
  assert.ok((await rowOf(newer)).seatHeldAt, 'clock starts with no Builder ID too');

  // Nobody waiting: the seat is freed.
  assert.equal(await inTx((tx) => cancelRow(tx, newer, 'pending')), null);
  assert.equal(await seats(event), 0);

  // Cancelling someone who holds no seat changes nothing.
  event = await newEvent(1, 1);
  const waiting = await person(event, 'waitlisted');
  assert.equal(await inTx((tx) => cancelRow(tx, waiting, 'waitlisted')), null);
  assert.equal(await seats(event), 1);

  // A stale page can't cancel twice or count twice.
  event = await newEvent(2, 2);
  const once = await person(event, 'pending', { seatHeldAt: new Date() });
  const results = await Promise.allSettled([
    inTx((tx) => cancelRow(tx, once, 'pending')),
    inTx((tx) => cancelRow(tx, once, 'pending')),
  ]);
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1, 'exactly one cancel wins');
  assert.equal(await seats(event), 1, 'two clicks free one seat');
  await assert.rejects(inTx((tx) => cancelRow(tx, once, 'approved')), refusedWith(STALE), 'wrong from-status');

  // Two seats released at once go to two different people.
  event = await newEvent(2, 2);
  const a = await person(event, 'pending', { seatHeldAt: new Date() });
  const b = await person(event, 'approved');
  const w1 = await person(event, 'waitlisted');
  const w2 = await person(event, 'waitlisted');
  const both = await Promise.all([inTx((tx) => cancelRow(tx, a, 'pending')), inTx((tx) => cancelRow(tx, b, 'approved'))]);
  assert.deepEqual(both.map((p) => p?.id).sort(), [w1, w2].sort(), 'no one promoted twice');
  assert.equal(await seats(event), 2);

  // A rush for the last seat: exactly one gets it.
  event = await newEvent(1, 0);
  const rush = await Promise.all(Array.from({ length: 6 }, () => inTx((tx) => takeSeat(tx, event))));
  assert.equal(rush.filter(Boolean).length, 1);
  assert.equal(await seats(event), 1);
  event = await newEvent(null, 0);
  assert.equal(await inTx((tx) => takeSeat(tx, event)), true, 'no capacity means no limit');

  // Restore seat: fresh clock, reminder cleared, one seat taken.
  event = await newEvent(1, 0);
  const old = new Date('2026-11-01T00:00:00Z');
  const back = await person(event, 'cancelled', { seatHeldAt: old, deadlineRemindedAt: old });
  await inTx((tx) => restoreRow(tx, back));
  let row = await rowOf(back);
  assert.equal(row.status, 'pending');
  assert.ok(row.seatHeldAt! > old, 'fresh clock');
  assert.equal(row.deadlineRemindedAt, null, 'gets its own reminder');
  assert.equal(await seats(event), 1);
  await assert.rejects(inTx((tx) => restoreRow(tx, back)), refusedWith(STALE), 'no longer cancelled');

  // No free seat: "Event full", and the row stays exactly as it was.
  const full = await person(event, 'cancelled', { seatHeldAt: old, deadlineRemindedAt: old });
  await assert.rejects(inTx((tx) => restoreRow(tx, full)), refusedWith(EVENT_FULL));
  row = await rowOf(full);
  assert.equal(row.status, 'cancelled', 'rolled back');
  assert.equal(row.deadlineRemindedAt?.getTime(), old.getTime(), 'rolled back');
  assert.equal(await seats(event), 1);

  // A row with a UTR claims a payment, so it can't be restored.
  event = await newEvent(5, 0);
  const claimed = await person(event, 'cancelled', { utr: '100000000001' });
  await assert.rejects(inTx((tx) => restoreRow(tx, claimed)), refusedWith(STALE));
  assert.equal(await seats(event), 0);

  // Confirm: no seat change from payment_submitted.
  event = await newEvent(1, 1);
  const builderId = `b${randomBytes(4).toString('hex')}`;
  const paid = await person(event, 'payment_submitted', { builderId, utr: '100000000002', utrSubmittedAt: old });
  const base = { id: paid, from: 'payment_submitted' as const, builderId, admin: 'admin@example.test' };
  await assert.rejects(inTx((tx) => confirmRow(tx, { ...base, builderId: 'someone-else', utr: '100000000002' })), refusedWith(STALE), 'Builder ID changed');
  await inTx((tx) => confirmRow(tx, { ...base, utr: '100000000003' }));
  row = await rowOf(paid);
  assert.equal(row.status, 'approved');
  assert.equal(row.utr, '100000000003', 'the admin can correct the UTR');
  assert.equal(row.utrSubmittedAt?.getTime(), old.getTime(), 'keeps the original submit time');
  assert.equal(row.approvedBy, 'admin@example.test');
  assert.ok(row.approvedAt);
  assert.equal(await seats(event), 1);
  await assert.rejects(inTx((tx) => confirmRow(tx, { ...base, utr: '100000000003' })), refusedWith(STALE), 'no double confirm');

  // Confirm a late payer: needs a seat, and says "refund" when there isn't one.
  const late = await person(event, 'cancelled', { builderId: `b${randomBytes(4).toString('hex')}` });
  const lateRow = await rowOf(late);
  const lateInput = { id: late, from: 'cancelled' as const, builderId: lateRow.builderId!, admin: 'a@example.test' };
  await assert.rejects(inTx((tx) => confirmRow(tx, { ...lateInput, utr: '100000000004' })), refusedWith(EVENT_FULL_REFUND));
  assert.equal((await rowOf(late)).status, 'cancelled', 'rolled back');
  assert.equal((await rowOf(late)).utr, null, 'rolled back');
  assert.equal(await seats(event), 1);
  await db.update(events).set({ capacity: 2 }).where(eq(events.id, event));
  await inTx((tx) => confirmRow(tx, { ...lateInput, utr: '100000000004' }));
  assert.equal((await rowOf(late)).status, 'approved');
  assert.ok((await rowOf(late)).utrSubmittedAt, 'submit time filled in');
  assert.equal(await seats(event), 2);

  // One UTR, one pass: the database refuses it, and the change rolls back.
  const dupe = await person(event, 'payment_submitted', { builderId: `b${randomBytes(4).toString('hex')}`, utr: '100000000005' });
  const dupeRow = await rowOf(dupe);
  await assert.rejects(
    inTx((tx) => confirmRow(tx, { id: dupe, from: 'payment_submitted', builderId: dupeRow.builderId!, utr: '100000000004', admin: 'a@example.test' })),
    (err: { cause?: { constraint_name?: string } }) => err.cause?.constraint_name === 'registrations_event_id_utr_key',
  );
  assert.equal((await rowOf(dupe)).status, 'payment_submitted');

  console.log('Seat rules OK');
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (eventIds.length) await db.delete(events).where(inArray(events.id, eventIds));
    await client.end();
  });
