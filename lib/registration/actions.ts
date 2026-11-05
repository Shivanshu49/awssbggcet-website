'use server';

import { randomBytes, randomInt } from 'node:crypto';

import { and, eq, inArray, isNull, lt, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { after } from 'next/server';

import { db } from '@/lib/db';
import { events, registrations } from '@/lib/db/schema';

import { EVENT_SLUG, eventPage } from './content';
import { sendPassLink, sendRegistrationReceived } from './email';
import { interestsEditable } from './format';
import { submitUtr, takeSeat } from './seats';
import { verifyTurnstile } from './turnstile';
import {
  BUILDER_ID_TAKEN,
  builderIdSchema,
  emailSchema,
  firstErrors,
  interestsSchema,
  passCodeSchema,
  paymentSchema,
  registrationSchema,
  UTR_TAKEN,
  type RegistrationInput,
} from './validation';

const TURNSTILE_ERROR = "We couldn't verify you're human. Please try again.";
const GENERIC_ERROR = 'Something went wrong. Please try again.';

const TICKET_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // A–Z and 2–9 minus look-alikes
const generateCode = () => randomBytes(16).toString('base64url');
const generateTicketNo = () =>
  Array.from({ length: 6 }, () => TICKET_ALPHABET[randomInt(TICKET_ALPHABET.length)]).join('');

// Worth retrying: a fresh code can't hit these again. Any other constraint is a real conflict.
const CODE_CONSTRAINTS = [
  'registrations_ticket_no_unique',
  'registrations_pass_code_unique',
  'registrations_checkin_code_unique',
];
const BUILDER_ID_INDEX = 'registrations_event_id_builder_id_key';
const UTR_INDEX = 'registrations_event_id_utr_key';

// Drizzle wraps the driver's error, so the Postgres details sit on `cause`.
function pgError(err: unknown): { code?: string; constraint_name?: string } {
  let current = err as { cause?: unknown; constraint_name?: string; code?: string } | undefined;
  while (current?.cause && !current.constraint_name) current = current.cause as typeof current;
  return current ?? {};
}

const getEvent = async () =>
  (
    await db
      .select({ id: events.id, registrationOpen: events.registrationOpen })
      .from(events)
      .where(eq(events.slug, EVENT_SLUG))
      .limit(1)
  )[0];

// Returns the new pass, or null if this email is already registered.
async function insertRegistration(eventId: string, input: RegistrationInput) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await db.transaction(async (tx) => {
        const [row] = await tx
          .insert(registrations)
          .values({
            eventId,
            name: input.name,
            email: input.email,
            phone: input.phone,
            college: input.college,
            branch: input.branch,
            yearOfStudy: input.yearOfStudy,
            mealPref: input.mealPref,
            builderId: input.builderId,
            status: 'pending',
            passCode: generateCode(),
            checkinCode: generateCode(),
            ticketNo: generateTicketNo(),
            consentVersion: eventPage.registration.consentVersion,
            consentedAt: new Date(),
          })
          .onConflictDoNothing({ target: [registrations.eventId, registrations.email] })
          .returning({ id: registrations.id, passCode: registrations.passCode });
        if (!row) return null;

        // A duplicate attempt (above) never touches a seat.
        const hasSeat = await takeSeat(tx, eventId);
        const [held] = await tx
          .update(registrations)
          .set(hasSeat ? { seatHeldAt: sql`now()` } : { status: 'waitlisted' })
          .where(eq(registrations.id, row.id))
          .returning({ seatHeldAt: registrations.seatHeldAt });
        return { passCode: row.passCode, seatHeldAt: held.seatHeldAt };
      });
    } catch (err) {
      if (attempt >= 5 || !CODE_CONSTRAINTS.includes(pgError(err).constraint_name ?? '')) throw err;
    }
  }
}

// Atomic, so two requests can't both pass the 10-minute limit. The link only ever goes by email.
async function emailPassLink(eventId: string, email: string) {
  const [row] = await db
    .update(registrations)
    .set({ linkSentAt: sql`now()` })
    .where(
      and(
        eq(registrations.eventId, eventId),
        eq(registrations.email, email),
        or(
          isNull(registrations.linkSentAt),
          lt(registrations.linkSentAt, sql`now() - interval '10 minutes'`),
        ),
      ),
    )
    .returning({ name: registrations.name, passCode: registrations.passCode });
  if (row) after(() => sendPassLink(email, row.name, row.passCode));
}

export type RegisterResult = {
  fieldErrors?: Record<string, string>;
  formError?: string;
  notice?: string;
};

export async function register(input: unknown, turnstileToken: unknown): Promise<RegisterResult> {
  if (!(await verifyTurnstile(turnstileToken))) return { formError: TURNSTILE_ERROR };

  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error) };
  const data = parsed.data;

  let created: Awaited<ReturnType<typeof insertRegistration>>;
  try {
    const event = await getEvent();
    if (!eventPage.registration.open || !event?.registrationOpen) {
      return { formError: "Registration isn't open right now." };
    }
    created = await insertRegistration(event.id, data);
    if (created === null) {
      await emailPassLink(event.id, data.email);
      return { notice: "This email is already registered — we've emailed your pass link." };
    }
  } catch (err) {
    const { code, constraint_name: constraint } = pgError(err);
    if (constraint === BUILDER_ID_INDEX) return { fieldErrors: { builderId: BUILDER_ID_TAKEN } };
    console.error('[register] failed:', code ?? 'unknown');
    return { formError: GENERIC_ERROR };
  }

  const { passCode, seatHeldAt } = created;
  after(() => sendRegistrationReceived(data.email, data.name, passCode, seatHeldAt));
  redirect(`/pass/${passCode}`);
}

export type FindPassResult = { fieldError?: string; formError?: string; sent?: boolean };

// The answer is the same whether or not the email is registered.
export async function findMyPass(email: unknown, turnstileToken: unknown): Promise<FindPassResult> {
  if (!(await verifyTurnstile(turnstileToken))) return { formError: TURNSTILE_ERROR };

  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { fieldError: parsed.error.issues[0].message };

  try {
    const event = await getEvent();
    if (event) await emailPassLink(event.id, parsed.data);
    return { sent: true };
  } catch (err) {
    console.error('[find-my-pass] failed:', pgError(err).code ?? 'unknown');
    return { formError: GENERIC_ERROR };
  }
}

// The pass code is the key: these three actions change only the row it opens.
export async function saveBuilderId(code: unknown, value: unknown): Promise<{ error?: string }> {
  const passCode = passCodeSchema.safeParse(code);
  const builderId = builderIdSchema.safeParse(value);
  if (!builderId.success) return { error: builderId.error.issues[0].message };
  const locked = "This Builder ID can't be changed. Contact us if it's wrong.";
  if (!passCode.success) return { error: locked };

  try {
    // Locked once a UTR is submitted. Cancelled passes don't show this field at all.
    // Never touches seat_held_at, so saving a Builder ID can't move the deadline.
    const rows = await db
      .update(registrations)
      .set({ builderId: builderId.data })
      .where(
        and(
          eq(registrations.passCode, passCode.data),
          inArray(registrations.status, ['pending', 'waitlisted']),
        ),
      )
      .returning({ id: registrations.id });
    if (!rows.length) return { error: locked };
  } catch (err) {
    const { code: pgCode, constraint_name: constraint } = pgError(err);
    if (constraint === BUILDER_ID_INDEX) return { error: BUILDER_ID_TAKEN };
    console.error('[builder-id] failed:', pgCode ?? 'unknown');
    return { error: GENERIC_ERROR };
  }
  revalidatePath(`/pass/${passCode.data}`);
  return {};
}

export type PaymentResult = { fieldErrors?: Record<string, string>; formError?: string };

export async function submitPayment(code: unknown, input: unknown): Promise<PaymentResult> {
  const passCode = passCodeSchema.safeParse(code);
  const parsed = paymentSchema.safeParse(input);
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error) };
  const closed = "This pass can't take a payment any more — contact us.";
  if (!passCode.success) return { formError: closed };

  try {
    if (!(await submitUtr(db, { passCode: passCode.data, ...parsed.data }))) return { formError: closed };
  } catch (err) {
    const { code: pgCode, constraint_name: constraint } = pgError(err);
    if (constraint === UTR_INDEX) return { fieldErrors: { utr: UTR_TAKEN } };
    console.error('[payment] failed:', pgCode ?? 'unknown');
    return { formError: GENERIC_ERROR };
  }
  revalidatePath(`/pass/${passCode.data}`);
  return {};
}

export async function saveInterests(code: unknown, input: unknown): Promise<{ error?: string }> {
  const passCode = passCodeSchema.safeParse(code);
  const parsed = interestsSchema.safeParse(input);
  if (!parsed.success) return { error: firstErrors(parsed.error).note ?? GENERIC_ERROR };
  const closed = "Workshop interests can't be changed any more.";
  if (!passCode.success) return { error: closed };

  try {
    const [row] = await db
      .select({ status: registrations.status, startsAt: events.startsAt })
      .from(registrations)
      .innerJoin(events, eq(registrations.eventId, events.id))
      .where(eq(registrations.passCode, passCode.data))
      .limit(1);
    if (!row || !interestsEditable(row.status, row.startsAt)) return { error: closed };

    await db
      .update(registrations)
      .set({ interests: parsed.data.interests, interestsNote: parsed.data.note || null })
      .where(eq(registrations.passCode, passCode.data));
  } catch (err) {
    console.error('[interests] failed:', pgError(err).code ?? 'unknown');
    return { error: GENERIC_ERROR };
  }
  revalidatePath(`/pass/${passCode.data}`);
  return {};
}
