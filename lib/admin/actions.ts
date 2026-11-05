'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { after } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { EVENT_SLUG, eventPage, qrReleased } from '@/lib/registration/content';
import { sendBuilderIdReminder, sendPaymentConfirmed, sendQrPass, sendSeatOpened } from '@/lib/registration/email';
import { formatDeadline } from '@/lib/registration/format';
import {
  cancelRow,
  claimBuilderIdReminders,
  confirmRow,
  countQrUnsent,
  markQrEmailed,
  Refused,
  restoreRow,
  sendNextQrPass,
} from '@/lib/registration/seats';
import { emailSchema, UTR_TAKEN, utrSchema } from '@/lib/registration/validation';

import { authConfigured, isAdminEmail, requireAdmin, supabaseServer } from './auth';

const GENERIC_ERROR = 'Something went wrong. Please try again.';
const BAD_CODE = "That code isn't valid. Check it or ask for a new one.";

export type ActionResult = { error?: string };

// Same answer whether or not the email is an admin, and no call to Supabase for anyone else,
// so this form can't create accounts or show who the admins are.
export async function sendAdminCode(email: unknown): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (authConfigured() && isAdminEmail(parsed.data)) {
    const { error } = await (await supabaseServer()).auth.signInWithOtp({ email: parsed.data });
    if (error) console.error('[admin-login] code not sent:', error.status ?? 'unknown');
  }
  return {};
}

export async function verifyAdminCode(email: unknown, code: unknown): Promise<ActionResult> {
  const parsedEmail = emailSchema.safeParse(email);
  const parsedCode = z.string().trim().regex(/^\d{6,10}$/).safeParse(code);
  if (!parsedEmail.success || !parsedCode.success || !authConfigured() || !isAdminEmail(parsedEmail.data)) {
    return { error: BAD_CODE };
  }
  const { error } = await (await supabaseServer()).auth.verifyOtp({
    email: parsedEmail.data,
    token: parsedCode.data,
    type: 'email',
  });
  if (error) return { error: BAD_CODE };
  redirect('/admin/scd');
}

export async function signOutAdmin() {
  await requireAdmin();
  await (await supabaseServer()).auth.signOut();
  redirect('/admin/login');
}

const UTR_INDEX = 'registrations_event_id_utr_key';

// Drizzle wraps the driver's error, so the Postgres details sit on `cause`.
function constraintOf(err: unknown) {
  let current = err as { cause?: unknown; constraint_name?: string } | undefined;
  while (current?.cause && !current.constraint_name) current = current.cause as typeof current;
  return current?.constraint_name;
}

async function runChange(label: string, change: () => Promise<unknown>): Promise<ActionResult> {
  try {
    await change();
  } catch (err) {
    if (err instanceof Refused) return { error: err.message };
    if (constraintOf(err) === UTR_INDEX) return { error: UTR_TAKEN };
    console.error(`[admin] ${label} failed:`, (err as { code?: string }).code ?? 'unknown');
    return { error: GENERIC_ERROR };
  }
  revalidatePath('/admin/scd');
  return {};
}

const confirmSchema = z.object({
  id: z.uuid(),
  from: z.enum(['payment_submitted', 'cancelled']),
  builderId: z.string().min(1),
  utr: utrSchema,
});

export async function confirmPayment(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = confirmSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  return runChange('confirm', async () => {
    const row = await db.transaction((tx) => confirmRow(tx, { ...parsed.data, admin }));
    after(async () => {
      if (!qrReleased()) return void (await sendPaymentConfirmed(row));
      // Past the release date nobody should wait for another batch, so the QR goes out now.
      if (await sendQrPass(row)) await markQrEmailed(db, row.id);
    });
  });
}

const cancelSchema = z.object({
  id: z.uuid(),
  from: z.enum(['pending', 'payment_submitted', 'approved', 'waitlisted']),
});

export async function cancelRegistration(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = cancelSchema.safeParse(input);
  if (!parsed.success) return { error: GENERIC_ERROR };
  return runChange('cancel', async () => {
    const promoted = await db.transaction((tx) => cancelRow(tx, parsed.data.id, parsed.data.from));
    if (promoted) after(() => sendSeatOpened(promoted));
  });
}

export async function restoreSeat(id: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) return { error: GENERIC_ERROR };
  return runChange('restore', async () => {
    const row = await db.transaction((tx) => restoreRow(tx, parsed.data));
    after(() => sendSeatOpened(row));
  });
}

export async function sendBuilderIdReminders(): Promise<ActionResult & { sent?: number }> {
  await requireAdmin();
  try {
    const [event] = await db.select({ id: events.id }).from(events).where(eq(events.slug, EVENT_SLUG)).limit(1);
    if (!event) return { error: GENERIC_ERROR };
    const rows = await claimBuilderIdReminders(db, event.id);
    after(async () => {
      for (const row of rows) await sendBuilderIdReminder(row);
    });
    return { sent: rows.length };
  } catch (err) {
    console.error('[admin] reminder failed:', (err as { code?: string }).code ?? 'unknown');
    return { error: GENERIC_ERROR };
  }
}

const QR_BATCH_MS = 45_000; // Stops short of the admin page's 60-second limit. The next click carries on.

export async function sendQrPasses(): Promise<ActionResult & { sent?: number; failed?: number; remaining?: number }> {
  await requireAdmin();
  if (!qrReleased()) {
    return { error: `QR passes can't be sent before ${formatDeadline(new Date(eventPage.registration.qrReleaseAt))}.` };
  }
  try {
    const [event] = await db.select({ id: events.id }).from(events).where(eq(events.slug, EVENT_SLUG)).limit(1);
    if (!event) return { error: GENERIC_ERROR };
    const failed: string[] = [];
    let sent = 0;
    const stopAt = Date.now() + QR_BATCH_MS;
    while (Date.now() < stopAt) {
      const result = await sendNextQrPass(db, event.id, failed, sendQrPass);
      if (!result) break;
      if (result.sent) sent++;
      else failed.push(result.id);
    }
    return { sent, failed: failed.length, remaining: await countQrUnsent(db, event.id) };
  } catch (err) {
    console.error('[admin] QR passes failed:', (err as { code?: string }).code ?? 'unknown');
    return { error: GENERIC_ERROR };
  }
}
