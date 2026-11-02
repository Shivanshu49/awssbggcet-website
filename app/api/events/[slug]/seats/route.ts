import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { EVENT_SLUG, eventPage } from '@/lib/registration/content';
import { turnstileReady } from '@/lib/registration/turnstile';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [event] = await db
    .select({ capacity: events.capacity, taken: events.seatsTaken, open: events.registrationOpen })
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(
    {
      capacity: event.capacity,
      taken: event.taken,
      open: event.open && slug === EVENT_SLUG && eventPage.registration.open && turnstileReady,
    },
    { headers: { 'Cache-Control': 's-maxage=30' } },
  );
}
