import { asc, eq } from 'drizzle-orm';

import { requireAdmin } from '@/lib/admin/auth';
import { toCsv } from '@/lib/admin/rules';
import { db } from '@/lib/db';
import { events, registrations } from '@/lib/db/schema';
import { EVENT_SLUG } from '@/lib/registration/content';

export const dynamic = 'force-dynamic';

const HEADER = [
  'Ticket', 'Name', 'Email', 'Phone', 'College', 'Branch', 'Year', 'Meal', 'Builder ID', 'Status',
  'UTR', 'Payer name', 'UTR submitted at', 'Pass issued at', 'Checked in at', 'Registered at',
];

export async function GET() {
  await requireAdmin();

  const rows = await db
    .select({ reg: registrations })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(events.slug, EVENT_SLUG))
    .orderBy(asc(registrations.createdAt));

  const csv = toCsv([
    HEADER,
    ...rows.map(({ reg }) => [
      reg.ticketNo, reg.name, reg.email, reg.phone, reg.college, reg.branch, reg.yearOfStudy, reg.mealPref,
      reg.builderId, reg.status, reg.utr, reg.payerName,
      reg.utrSubmittedAt?.toISOString() ?? null,
      reg.approvedAt?.toISOString() ?? null,
      reg.checkedInAt?.toISOString() ?? null,
      reg.createdAt.toISOString(),
    ]),
  ]);

  // The byte-order mark makes Excel read the file as UTF-8, so names in Indian scripts survive.
  return new Response(`﻿${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="scd-registrations.csv"',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
