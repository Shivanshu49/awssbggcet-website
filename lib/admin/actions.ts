'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { db } from '@/lib/db';
import { cancelRow, confirmRow, Refused, restoreRow } from '@/lib/registration/seats';
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
  return runChange('confirm', () => db.transaction((tx) => confirmRow(tx, { ...parsed.data, admin })));
}

const cancelSchema = z.object({
  id: z.uuid(),
  from: z.enum(['pending', 'payment_submitted', 'approved', 'waitlisted']),
});

export async function cancelRegistration(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = cancelSchema.safeParse(input);
  if (!parsed.success) return { error: GENERIC_ERROR };
  return runChange('cancel', () => db.transaction((tx) => cancelRow(tx, parsed.data.id, parsed.data.from)));
}

export async function restoreSeat(id: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) return { error: GENERIC_ERROR };
  return runChange('restore', () => db.transaction((tx) => restoreRow(tx, parsed.data)));
}
