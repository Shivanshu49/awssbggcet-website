import { and, asc, eq, ilike, or } from 'drizzle-orm';
import Link from 'next/link';

import { CheckInButton, CheckInDesk } from '@/components/admin/CheckInDesk';
import { CARD, CARD_TITLE, FIELD_INPUT, SECONDARY_BUTTON, SMALL_SECONDARY_BUTTON, fieldBorder } from '@/components/registration/field-styles';
import { requireAdmin } from '@/lib/admin/auth';
import { escapeLike } from '@/lib/admin/rules';
import { db } from '@/lib/db';
import { events, registrations } from '@/lib/db/schema';
import { EVENT_SLUG } from '@/lib/registration/content';
import { formatDeadline, maskEmail } from '@/lib/registration/format';

export const dynamic = 'force-dynamic';

const RESULT_LIMIT = 20;
const single = (value?: string | string[]) => (typeof value === 'string' ? value.trim() : '');

export default async function CheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string | string[]; q?: string | string[] }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const q = single(params.q);
  const pattern = `%${escapeLike(q)}%`;

  const rows = q
    ? await db
        .select({
          id: registrations.id,
          name: registrations.name,
          email: registrations.email,
          college: registrations.college,
          ticketNo: registrations.ticketNo,
          status: registrations.status,
          checkinCode: registrations.checkinCode,
          checkedInAt: registrations.checkedInAt,
        })
        .from(registrations)
        .innerJoin(events, eq(registrations.eventId, events.id))
        .where(
          and(
            eq(events.slug, EVENT_SLUG),
            or(
              ilike(registrations.ticketNo, pattern),
              ilike(registrations.email, pattern),
              ilike(registrations.name, pattern),
            ),
          ),
        )
        .orderBy(asc(registrations.name))
        .limit(RESULT_LIMIT)
    : [];

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Check-in</h1>
        <Link href="/admin/scd" className={SMALL_SECONDARY_BUTTON}>
          Registrations
        </Link>
      </div>

      <CheckInDesk initialCode={single(params.c)} />

      <section aria-labelledby="search-heading" className={`${CARD} flex flex-col gap-3`}>
        <h2 id="search-heading" className={CARD_TITLE}>
          Search
        </h2>
        <form className="flex flex-wrap gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Search by ticket, email or name"
            placeholder="Ticket, email or name"
            className={`${FIELD_INPUT} ${fieldBorder()} min-w-0 flex-1 basis-48`}
          />
          <button type="submit" className={SECONDARY_BUTTON}>
            Search
          </button>
        </form>

        {q && !rows.length && <p className="text-sm text-[#A89DB5]">Nobody found.</p>}
        <ul className="flex flex-col divide-y divide-[#4C2A66]/40">
          {rows.map((row) => (
            <li key={row.id} className="flex flex-col gap-2 py-3">
              <div className="min-w-0 text-sm">
                <p className="font-semibold break-words text-white">{row.name}</p>
                <p className="break-words text-[#CFC5DC]">{row.college}</p>
                <p className="font-mono text-xs break-all text-[#E9D5FF]">
                  {row.ticketNo} · {maskEmail(row.email)}
                </p>
              </div>
              {row.status !== 'approved' && !row.checkedInAt && (
                <p className="text-xs text-red-300">Can&apos;t check in: {row.status.replace('_', ' ')}</p>
              )}
              {row.checkedInAt && (
                <p className="text-xs text-[#FBBF24]">Checked in at {formatDeadline(row.checkedInAt)}</p>
              )}
              {row.status === 'approved' && !row.checkedInAt && <CheckInButton code={row.checkinCode} />}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
