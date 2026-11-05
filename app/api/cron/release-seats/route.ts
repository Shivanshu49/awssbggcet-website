import { eq } from 'drizzle-orm';
import { after, NextResponse } from 'next/server';

import { cronAuthorized } from '@/lib/admin/cron-auth';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { EVENT_SLUG } from '@/lib/registration/content';
import { sendDeadlineReminder, sendSeatOpened, sendSeatReleased } from '@/lib/registration/email';
import { runHourlyJob } from '@/lib/registration/seats';

export const dynamic = 'force-dynamic';

const json = (body: object, status = 200) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  if (!cronAuthorized(request.headers.get('authorization'))) return json({ error: 'Unauthorized' }, 401);

  const [event] = await db
    .select({ id: events.id, startsAt: events.startsAt })
    .from(events)
    .where(eq(events.slug, EVENT_SLUG))
    .limit(1);
  if (!event) return json({ error: 'Event not found' }, 404);
  // Once the event has started, nobody should lose a seat or get a deadline email.
  if (event.startsAt <= new Date()) return json({ skipped: 'event has started' });

  const { released, promoted, reminded } = await runHourlyJob(db, event.id);
  // One at a time, so a burst stays within the SMTP provider's rate limit.
  after(async () => {
    for (const row of released) await sendSeatReleased(row);
    for (const row of promoted) await sendSeatOpened(row);
    for (const row of reminded) await sendDeadlineReminder(row);
  });
  return json({ released: released.length, promoted: promoted.length, reminded: reminded.length });
}
