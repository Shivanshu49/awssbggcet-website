// Usage: pnpm db:seed-event <slug>
// Upserts the DB event row from content/events.json + content/event-pages/<slug>.json.
// seats_taken is left alone, so re-running it never loses count.
import { existsSync, readFileSync } from 'node:fs';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import eventsData from '../content/events.json';
import { events } from '../lib/db/schema';
import { dbSsl } from '../lib/db/ssl';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');

const slug = process.argv[2];
const event = eventsData.find((e) => e.slug === slug);
const pagePath = `content/event-pages/${slug}.json`;
if (!event || !existsSync(pagePath)) {
  console.error(`Usage: pnpm db:seed-event <slug>. No event and content file for "${slug}".`);
  process.exit(1);
}

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url?.startsWith('postgres')) {
  console.error('DIRECT_URL (or DATABASE_URL) is not set to a Postgres URL.');
  process.exit(1);
}

const { registration } = JSON.parse(readFileSync(pagePath, 'utf8'));
const values = {
  title: event.title,
  startsAt: new Date(event.date),
  endsAt: 'endDate' in event && event.endDate ? new Date(event.endDate) : null,
  venue: event.venue,
  mode: event.mode as 'online' | 'offline' | 'hybrid',
  capacity: registration.capacity || null, // 0 means "not set yet": no limit, counter hidden
  registrationOpen: registration.open,
};

async function main(databaseUrl: string, eventSlug: string) {
  const client = postgres(databaseUrl, { prepare: false, max: 1, ssl: dbSsl(databaseUrl) });
  const [row] = await drizzle(client)
    .insert(events)
    .values({ slug: eventSlug, ...values })
    .onConflictDoUpdate({ target: events.slug, set: values })
    .returning({
      slug: events.slug,
      capacity: events.capacity,
      seatsTaken: events.seatsTaken,
      registrationOpen: events.registrationOpen,
    });
  await client.end();
  console.log(`Seeded on ${new URL(databaseUrl).hostname}:`, row);
}

main(url, slug).catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
